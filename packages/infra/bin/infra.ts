#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { InfraStack } from "../lib/infra-stack";
import { EcsBackend } from "../lib/ecs-backend";
import { LambdaRoute } from "../lib/lambdas-stack";
import * as path from "path";

const app = new cdk.App();
const ingress = new InfraStack(app, "InfraStack");

new EcsBackend(ingress, "ApiV2Backend", {
  vpc: ingress.vpc,
  listener: ingress.listener,
});

new LambdaRoute(ingress, "GenericLambdaRoute", {
  listener: ingress.listener,
  pathPatterns: ["/", "/*"],
  priority: 100,
  code: lambda.Code.fromAsset(path.join(__dirname, "lambda-handler")),
});
