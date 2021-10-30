import json
import boto3

lifeCyclePolicy = { "rules": [ { "rulePriority": 1, "description": "remove untagged images", "selection": { "tagStatus": "untagged", "countType": "sinceImagePushed","countUnit": "days","countNumber": 1 },"action": { "type": "expire" } } ] }

def lambda_handler(event, context):
    ecr_client = boto3.client('ecr')

    describe_repo_paginator = ecr_client.get_paginator('describe_repositories')
    updatedRepositories = []
    for response_list_repopaginator in describe_repo_paginator.paginate():
        for repo in response_list_repopaginator['repositories']:
            repoName = repo['repositoryName']

            try:
              #get lifecycle policy, if not found then put it
              ecr_client.get_lifecycle_policy(repositoryName=repoName)
            except:
                print("Adding lifecycle policy for: " + repoName)
                updatedRepositories.append(repoName)
                response = ecr_client.put_lifecycle_policy(repositoryName=repoName, lifecyclePolicyText=json.dumps(lifeCyclePolicy))

    return