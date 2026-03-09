import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

export class InfraStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly alb: elbv2.ApplicationLoadBalancer;
  public readonly listener: elbv2.ApplicationListener;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
    });

    this.alb = new elbv2.ApplicationLoadBalancer(this, "Alb", {
      vpc: this.vpc,
      internetFacing: true,
    });

    this.listener = this.alb.addListener("Http", {
      port: 80,
      open: true,
      defaultAction: elbv2.ListenerAction.fixedResponse(404, {
        contentType: "text/plain",
        messageBody: "Not found",
      }),
    });
  }
}
