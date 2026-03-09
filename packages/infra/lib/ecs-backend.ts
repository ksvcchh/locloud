import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as ecs from "aws-cdk-lib/aws-ecs";

export interface EcsBackendProps {
  vpc: ec2.IVpc;
  listener: elbv2.IApplicationListener;
}

export class EcsBackend extends Construct {
  constructor(scope: Construct, id: string, props: EcsBackendProps) {
    super(scope, id);

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: props.vpc,
    });

    const taskDef = new ecs.FargateTaskDefinition(this, "TaskDef", {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    taskDef.addContainer("App", {
      image: ecs.ContainerImage.fromRegistry("nginx"),
      portMappings: [{ containerPort: 80 }],
    });

    const service = new ecs.FargateService(this, "Service", {
      cluster,
      taskDefinition: taskDef,
    });

    const tg = new elbv2.ApplicationTargetGroup(this, "ApiV2Tg", {
      vpc: props.vpc,
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: "/",
      },
    });

    service.attachToApplicationTargetGroup(tg);

    new elbv2.ApplicationListenerRule(this, "ApiV2Rule", {
      listener: props.listener,
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(["/api", "/api/*"])],
      action: elbv2.ListenerAction.forward([tg]),
    });
  }
}
