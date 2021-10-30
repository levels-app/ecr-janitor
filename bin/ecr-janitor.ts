#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcrJanitorStack } from '../lib/ecr-janitor-stack';

const env = {
    account: process.env.CDK_DEPLOY_ACCOUNT,
    region:  process.env.CDK_DEPLOY_REGION
};

const app = new cdk.App();

new EcrJanitorStack(app, 'ecrjanitor-dev', {
    stackName: 'ecrjanitor-dev',
    env
});

new EcrJanitorStack(app, 'ecrjanitor-prod', {
    stackName: 'ecrjanitor-prod',
    env
});
