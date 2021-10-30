# ECR Janitor stack

[![Deploy ECR Janitor](https://github.com/levels-app/ecr-janitor/actions/workflows/ecr-janitor-automatic-deploy.yml/badge.svg)](https://github.com/levels-app/ecr-janitor/actions/workflows/ecr-janitor-automatic-deploy.yml)

The ECR Janitor stack is used to deploy a lambda function that adds a lifecycle policy to ECR repositories that don't have one. The lifecycle policy deletes all untagged images 1 day after they're untagged.

##### List of parameters

Parameter name |  Description | Default value  | Required to pass in?
:------------ | :-------------|  :-------------| :-------------
env | The environment of the stack (dev, qa, prod) | dev  | Yes if not dev

#### How to deploy the stack locally, i.e deploy locally in dev
1. Configure your aws credentials via AWS Configure to the access key id of your choosing
2. Create this env variable with the aws account id you're deploying in ```export CDK_DEPLOY_ACCOUNT=12345678```
3. Create this env variable of the region you want to deploy in ```export CDK_DEPLOY_REGION=us-east-2```
4. Run ```cdk deploy ecrjanitor-dev -c env=dev ```

#### How to destroy the stack locally
1. Run  ```cdk destroy ecrjanitor-dev -f```