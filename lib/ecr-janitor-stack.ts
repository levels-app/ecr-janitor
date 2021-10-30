import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as events from '@aws-cdk/aws-events'
import * as targets from '@aws-cdk/aws-events-targets'

export class EcrJanitorStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const ENV: string = this.node.tryGetContext('env') || 'dev';

    //ECR policy needed for lambda to describe repositories, get lifecycle policy, put lifecycle policy
    const ecrAccessStatement =  new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
        'ecr:DescribeRepositories',
        'ecr:GetLifecyclePolicy',
        'ecr:PutLifecyclePolicy',
      ]
    });

    const ecrJanitorPolicy = new iam.Policy(this, 'ecr-janitor-policy', {
      policyName: 'ECRJanitorPolicy',
      statements: [ecrAccessStatement]
    });

    const lambdaIamRole = new iam.Role(this, 'ecr-janitor-role', {
      roleName: 'ECR-Janitor-Role',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSLambdaBasicExecutionRole'
        ),
      ],
    });

    ecrJanitorPolicy.attachToRole(lambdaIamRole);

    //Create lambda function
    const lambdaFunction = new lambda.Function(this, 'ECR-Janitor2', {
      functionName: `ECR-Janitor-${ENV}`,
      runtime: lambda.Runtime.PYTHON_3_8,            // execution environment
      code: lambda.Code.fromAsset('lambda'),   // code loaded from "lambda" directory
      handler: 'ecr_janitor.lambda_handler',        // file is "ecr_janitor", function is "lambda_handler"
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      role: lambdaIamRole,
    });

    //Add cloud watch event rule
    new events.Rule(this, 'scheduleRule', {
      //Run at 8:00 PM UTC (12:00 AM ETC)
      schedule: events.Schedule.cron({ minute: '0', hour: '20' }),
      targets: [new targets.LambdaFunction(lambdaFunction)]
    });
  }
}
