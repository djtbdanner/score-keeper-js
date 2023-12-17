
const DOMAIN_NAME = 'davedanner.com';
const CERTIFICATE_ARN = 'arn:aws:acm:us-east-1:068092817236:certificate/d95e229b-3e99-4d81-aa30-1a51fb233591';

const { ApplicationLoadBalancer, ApplicationProtocol, ListenerAction, ListenerCertificate } = require('aws-cdk-lib/aws-elasticloadbalancingv2'); // Import ApplicationLoadBalancer
const {
  Cluster,
  ContainerImage,
  DeploymentControllerType,
  FargatePlatformVersion,
  FargateService,
  FargateTaskDefinition,
  LogDriver } = require('aws-cdk-lib/aws-ecs');
const { HostedZone, ARecord, RecordTarget, Duration } = require('aws-cdk-lib/aws-route53');
const { LogGroup, RetentionDays, DescribeLogGroupsCommand } = require('aws-cdk-lib/aws-logs');
const { Peer, Port, Vpc, SecurityGroup } = require('aws-cdk-lib/aws-ec2');
const { RemovalPolicy, Stack } = require('aws-cdk-lib');
const { Role } = require('aws-cdk-lib/aws-iam');

class CDKDeployStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    // Retrieve the default VPC
    const defaultVpc = Vpc.fromLookup(this, 'DefaultVpc', { isDefault: true });

    // Create ECS Cluster in the default VPC
    const cluster = new Cluster(this, `${props.env.appName}Cluster`, {
      vpc: defaultVpc,
    });

    // Retrieve the existing ECS task execution role
    const ecsTaskExecutionRole = Role.fromRoleArn(this, 'ExistingECSTaskExecutionRole', 'arn:aws:iam::068092817236:role/ecsTaskExecutionRole');
    const sg = new SecurityGroup(this, `${props.env.appName}SecurityGroup`, {
      vpc: defaultVpc,
      description: `Security group for ECS tasks in ${props.env.appName}`
    });
    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'Allow HTTP in');
    sg.addEgressRule(Peer.anyIpv4(), Port.tcp(80), 'Allow HTTP out');

    // log group
    const theName = `ecs/${props.env.appName}LogGroup`;
    const logGroup = new LogGroup(this, `${props.env.appName}LogGroup`, {
      logGroupName: theName,
      retention: RetentionDays.ONE_MONTH, // Adjust retention as needed
      removalPolicy: RemovalPolicy.DESTROY,// this allows the log group to be destroyed when destroy runs
    });

    // Create ECS Task Definition for Fargate
    const taskDefinition = new FargateTaskDefinition(this, `${props.env.appName}TaskDef`, {
      family: `${props.env.appName}`,
      executionRole: ecsTaskExecutionRole
    });

    taskDefinition.addContainer(`${props.env.appName}Container`, {
      image: ContainerImage.fromRegistry(`${props.env.account}.dkr.ecr.${props.env.region}.amazonaws.com/${props.env.appName}:latest`),
      portMappings: [{ containerPort: 80 }],
      memoryLimitMiB: 512,
      cpu: 256,
      essential: true,
      logging: LogDriver.awsLogs({
        logGroup,
        streamPrefix: `${props.env.appName}Container`,
      }),
    });

    // ECS Service
    const ecsService = new FargateService(this, `${props.env.appName}Service`, {
      cluster,
      serviceName: `${props.env.appName}Service`,
      taskDefinition,
      executionRole: ecsTaskExecutionRole,
      assignPublicIp: true,
      desiredCount: 1,
      platformVersion: FargatePlatformVersion.LATEST, 
      deploymentController: {
        type: DeploymentControllerType.ECS,
      },
      securityGroups: [sg],
      maximumPercent: 100,
      minimumHealthyPercent: 1,
      circuitBreaker: {
        enable: true,
        rollback: true,
      },
      logging: LogDriver.awsLogs({
        logGroup,
        streamPrefix: `${props.env.appName}Service`,
      }),
      removalPolicy: RemovalPolicy.DESTROY,
      forceNewDeployment: true,
    });

    // Application Load Balancer
    const loadBalancer = new ApplicationLoadBalancer(this, `${props.env.appName}LoadBalancer`, {
      vpc: defaultVpc,
      internetFacing: true,
    });

    // Create HTTP listener for redirection
    const httpListener = loadBalancer.addListener(`${props.env.appName}HttpListener`, {
      port: 80,
      protocol: ApplicationProtocol.HTTP,
      defaultAction: ListenerAction.redirect({
        protocol: ApplicationProtocol.HTTPS,
        port: '443',
        permanent: true, // Set to 'false' if you want a temporary redirect
      }),
    });

    // Create https listener
    const httpsListener = loadBalancer.addListener(`${props.env.appName}HttpsListener`, {
      port: 443,
      protocol: ApplicationProtocol.HTTPS,
      defaultAction: ListenerAction.redirect({
        protocol: ApplicationProtocol.HTTPS,
        port: '443',
      }),
      certificates: [ListenerCertificate.fromArn(CERTIFICATE_ARN)],
    });

    // Add Fargate service as a target to the HTTPS listener
    httpsListener.addTargets(`${props.env.appName}HttpsTarget`, {
      targets: [ecsService],
      port: 80, // Fargate service is listening on port 80
    });

    // Route 53 hosted zone
    const hostedZone = HostedZone.fromLookup(this, `${props.env.appName}HttpsTarget`, {
      domainName: DOMAIN_NAME, // domain name
    });

    // Create A record in Route 53
    new ARecord(this, `${props.env.appName}DNSRecord`, {
      zone: hostedZone,
      target: RecordTarget.fromAlias({
        bind: () => ({
          dnsName: loadBalancer.loadBalancerDnsName,
          hostedZoneId: loadBalancer.loadBalancerCanonicalHostedZoneId,
        }),
      }),
      recordName: 'score', // desired subdomain
    });
  }
}

module.exports = { CDKDeployStack }