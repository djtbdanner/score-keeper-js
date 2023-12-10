const { Stack, App } = require('aws-cdk-lib');
const { ContainerImage, FargateTaskDefinition, Ec2Service, FargateService } = require('aws-cdk-lib/aws-ecs');
const { Vpc, SecurityGroup } = require('aws-cdk-lib/aws-ec2');
const ecs = require('aws-cdk-lib/aws-ecs');
const logs = require('aws-cdk-lib/aws-logs');
const ec2 = require('aws-cdk-lib/aws-ec2');
const { ApplicationLoadBalancer } = require('aws-cdk-lib/aws-elasticloadbalancingv2'); // Import ApplicationLoadBalancer
const { Role } = require('aws-cdk-lib/aws-iam');
const { LogGroup, RetentionDays, DescribeLogGroupsCommand } = require('aws-cdk-lib/aws-logs');
const { CfnService } = require('aws-cdk-lib/aws-ecs');

class MyWidgetServiceStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    // Retrieve the default VPC
    const defaultVpc = Vpc.fromLookup(this, 'DefaultVpc', { isDefault: true });

    // Create ECS Cluster in the default VPC
    const cluster = new ecs.Cluster(this, `${props.env.appName}Cluster`, {
      vpc: defaultVpc,
    });

    // Retrieve the existing ECS task execution role
    const ecsTaskExecutionRole = Role.fromRoleArn(this, 'ExistingECSTaskExecutionRole', 'arn:aws:iam::068092817236:role/ecsTaskExecutionRole');
    const sg = new ec2.SecurityGroup(this, `${props.env.appName}SecurityGroup`, {
      vpc: defaultVpc,
      description: `Security group for ECS tasks in ${props.env.appName}` 
    });
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP in');
    sg.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP out');

    // **  cannot check if logs exist so need to comment this in out as needed - just delete the log group manually I guess
    const theName = `ecs/${props.env.appName}LogGroup`;
    const logGroup = new LogGroup(this, `${props.env.appName}LogGroup`, {
      logGroupName: theName,
      retention: RetentionDays.ONE_MONTH, // Adjust retention as needed
    });

    // Create ECS Task Definition for Fargate
    const taskDefinition = new FargateTaskDefinition(this, `${props.env.appName}TaskDef`, {
      family: `${props.env.appName}`,
      executionRole: ecsTaskExecutionRole
    });

    taskDefinition.addContainer(`${props.env.appName}Container`, {
      image: ecs.ContainerImage.fromRegistry(`${props.env.account}.dkr.ecr.${props.env.region}.amazonaws.com/${props.env.appName}:latest`),
      portMappings: [{ containerPort: 80 }],
      memoryLimitMiB: 512,
      cpu: 256,
      essential: true,
      logging: ecs.LogDriver.awsLogs({
        logGroup,
        streamPrefix: `${props.env.appName}Container`,
      }),
    });

    console.log("starting the service");
    const securityGroupIds = this.node.tryGetContext('SecurityGroupIDs') || ['sg-033785b39f4978a4b'];

    // ECS Service
    const ecsService = new ecs.FargateService(this, `${props.env.appName}Service`, {
      cluster,
      serviceName: `${props.env.appName}Service`,
      taskDefinition,
      executionRole: ecsTaskExecutionRole,
      assignPublicIp: true,
      desiredCount: 1,
      platformVersion: ecs.FargatePlatformVersion.LATEST, // Update with your desired version
      deploymentController: {
        type: ecs.DeploymentControllerType.ECS,
      },
      securityGroups: [sg],
      maximumPercent: 100,
      minimumHealthyPercent: 1,
      circuitBreaker: {
        enable: true,
        rollback: true,
      },
      logging: ecs.LogDriver.awsLogs({
        logGroup,
        streamPrefix: `${props.env.appName}Service`,
      }),
      
    });
  }
}

// // Application Load Balancer
// const loadBalancer = new ApplicationLoadBalancer(this, `${props.env.appName}LoadBalancer`, {
//   vpc: defaultVpc,
//   internetFacing: true,
// });

// // Listener for HTTP (80)
// const httpListener = loadBalancer.addListener('HttpListener', {
//   port: 80,
//   protocol: ApplicationProtocol.HTTP,
// });

// // Redirect HTTP to HTTPS
// httpListener.addAction('HttpRedirectAction', {
//   action: {
//     type: 'redirect',
//     redirectAction: {
//       protocol: 'HTTPS',
//       port: '443',
//     },
//   },
// });

// // Listener for HTTPS (443)
// const httpsListener = loadBalancer.addListener('HttpsListener', {
//   port: 443,
//   protocol: ApplicationProtocol.HTTPS,
//   certificateArns: ['arn:aws:acm:us-east-1:068092817236:certificate/d95e229b-3e99-4d81-aa30-1a51fb233591'], // Replace with your SSL certificate ARN
// });

// // Attach ECS service to ALB
// httpsListener.addTargets('EcsTarget', {
//   targets: [service],
//   healthCheck: {
//     path: '/',
//     interval: Duration.seconds(30000),
//   },
// });

// // Route 53 DNS record
// const hostedZone = HostedZone.fromLookup(this, 'davedanner.com', {
//   domainName: 'score.davedanner.com',
// });

// new ARecord(this, 'YourDnsRecord', {
//   zone: hostedZone,
//   target: RecordTarget.fromAlias({ bind: () => loadBalancer.loadBalancerDnsName }),
//   recordName: 'your-subdomain', // You can set the subdomain here
//   ttl: Duration.minutes(5),
// });
// }
// }

module.exports = { MyWidgetServiceStack }

