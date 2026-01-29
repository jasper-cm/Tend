#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/stacks/vpc-stack';
import { DatabaseStack } from '../lib/stacks/database-stack';
import { ApiStack } from '../lib/stacks/api-stack';
import { WebStack } from '../lib/stacks/web-stack';
import { ControlStack } from '../lib/stacks/control-stack';

const app = new cdk.App();

// Environment configuration
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
  region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
};

// Application name prefix for all resources
const appName = 'tend';

// Deployment environment (development, staging, production)
const deploymentEnv = process.env.ENVIRONMENT || 'development';
const isProduction = deploymentEnv === 'production';

// Common tags for all resources
const tags: Record<string, string> = {
  Application: 'Tend',
  Environment: deploymentEnv,
  ManagedBy: 'CDK',
};

// Apply tags to all stacks
Object.entries(tags).forEach(([key, value]) => {
  cdk.Tags.of(app).add(key, value);
});

// 1. VPC Stack - Network infrastructure
const vpcStack = new VpcStack(app, 'TendVpcStack', {
  env,
  appName,
  description: 'Tend VPC with public/private subnets and NAT Gateway',
});

// 2. Database Stack - RDS PostgreSQL in private subnet
// Uses AWS-managed encryption (AES-256) for RDS and Secrets Manager
// For additional compliance requirements, a customer-managed KMS key can be added
const databaseStack = new DatabaseStack(app, 'TendDatabaseStack', {
  env,
  appName,
  vpc: vpcStack.vpc,
  // Production settings: enable deletion protection, longer backups
  deletionProtection: isProduction,
  backupRetentionDays: isProduction ? 30 : 7,
  description: 'Tend RDS PostgreSQL database in private subnet',
});
databaseStack.addDependency(vpcStack);

// 3. API Stack - ECS Fargate with ALB
const apiStack = new ApiStack(app, 'TendApiStack', {
  env,
  appName,
  vpc: vpcStack.vpc,
  databaseSecret: databaseStack.databaseSecret,
  // Production settings: disable ECS Exec, require TLS certificate
  enableEcsExec: !isProduction,
  // Uncomment and set for production:
  // domainName: 'api.tend.app',
  // certificateArn: 'arn:aws:acm:us-east-1:123456789:certificate/xxx',
  description: 'Tend API on ECS Fargate with Application Load Balancer',
});
apiStack.addDependency(databaseStack);

// 4. Web Stack - S3 + CloudFront
const webStack = new WebStack(app, 'TendWebStack', {
  env,
  appName,
  apiUrl: apiStack.apiUrl,
  description: 'Tend Web Application on S3 with CloudFront CDN',
});
webStack.addDependency(apiStack);

// 5. Control Stack - Lambda functions to start/stop infrastructure
const controlStack = new ControlStack(app, 'TendControlStack', {
  env,
  appName,
  ecsCluster: apiStack.cluster,
  ecsService: apiStack.service,
  rdsInstance: databaseStack.databaseInstance,
  description: 'Tend Infrastructure Control - Start/Stop Lambda functions',
});
controlStack.addDependency(apiStack);

app.synth();
