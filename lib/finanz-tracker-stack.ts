import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import * as lambdaPy from "@aws-cdk/aws-lambda-python";
import * as sm from "@aws-cdk/aws-secretsmanager";
import * as cdk from "@aws-cdk/core";
import * as sns from "@aws-cdk/aws-sns";
import * as subscriptions from "@aws-cdk/aws-sns-subscriptions";
import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";

export class FinanzTrackerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const emailTopic = new sns.Topic(this, "EmailTopic");

    emailTopic.addSubscription(
      new subscriptions.EmailSubscription("laraasouza@hotmail.com")
    );

    emailTopic.addSubscription(
      new subscriptions.EmailSubscription("markusappel@hotmail.de")
    );

    const pin = new sm.Secret(this, "BankPinSecret");

    const dailyJob = new lambdaPy.PythonFunction(this, "DailyJob", {
      entry: "./daily-job",
      index: "index.py",
      handler: "handler",
      runtime: lambda.Runtime.PYTHON_3_7,
      environment: {
        BANK_PIN_SECRET_ARN: pin.secretArn,
        EMAIL_TOPIC_ARN: emailTopic.topicArn,
      },
      timeout: cdk.Duration.minutes(1),
    });

    const rule = new events.Rule(this, "DailyJobScheduleRule", {
      schedule: events.Schedule.expression("cron(0 12 * * ? *)"),
    });

    rule.addTarget(new targets.LambdaFunction(dailyJob));

    emailTopic.grantPublish(dailyJob);
    pin.grantRead(dailyJob);

    new cdk.CfnOutput(this, "UpdatePinCommand", {
      value: `Run the following command to configure the PIN:\n\n\taws secretsmanager put-secret-value --secret-id ${pin.secretName} --secret-string <PIN>\n`,
    });
  }
}
