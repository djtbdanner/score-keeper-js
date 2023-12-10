const taskDefinition = new ecs.FargateTaskDefinition(this, 'Task', {
    family: 'scorekeeper',
    memoryLimitMiB: 512,
    cpu: 256
  });
  
  taskDefinition.addContainer('scorekeeper', {
    image: ecs.ContainerImage.fromRegistry('your-ecr-repository-url'), 
    portMappings: [{containerPort: 80}] 
  });

  new ecs.FargateService('Service', {
    taskDefinition: taskDefinition,
    desiredCount: 1
  });