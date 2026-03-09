import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as targets from "aws-cdk-lib/aws-elasticloadbalancingv2-targets";

export interface LambdaRouteProps {
  listener: elbv2.IApplicationListener;
  pathPatterns: string[];
  priority: number;
  code: lambda.Code;
}

export class LambdaRoute extends Construct {
  constructor(scope: Construct, id: string, props: LambdaRouteProps) {
    super(scope, id);

    const fn = new lambda.Function(this, "Health", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: props.code,
    });

    new elbv2.ApplicationListenerRule(this, "Rule", {
      listener: props.listener,
      priority: props.priority,
      conditions: [elbv2.ListenerCondition.pathPatterns(props.pathPatterns)],
      action: elbv2.ListenerAction.forward([
        new elbv2.ApplicationTargetGroup(this, "LambdaTg", {
          targetType: elbv2.TargetType.LAMBDA,
          targets: [new targets.LambdaTarget(fn)],
        }),
      ]),
    });
  }
}

// export class LambdasStack extends cdkStack {
//   constructor(scope: Construct, id: string, props?: cdkStackProps) {
//     super(scope, id, props);
//     const fn = new lmbdFunction(this, "Health", {
//       runtime: lmbdRuntime.NODEJS_LATEST,
//       handler: "index.handler",
//       code: lmbdCode.fromAsset(pathJoin(__dirname, "lambda-handler")),
//     });
//     const endpoint = new apigwLambdaRestApi(this, "ApiGwEndpoint", {
//       handler: fn,
//     });
//   }
// }
