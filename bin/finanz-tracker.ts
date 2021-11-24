#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { FinanzTrackerStack } from "../lib/finanz-tracker-stack";

const app = new cdk.App();
new FinanzTrackerStack(app, "FinanzTrackerStackV1", {
  env: { account: "794147591978", region: "eu-west-1" },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
