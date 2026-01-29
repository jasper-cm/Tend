# Tend AWS Infrastructure

This directory contains AWS CDK infrastructure code for deploying the Tend application to AWS.

## Architecture Overview

```
                                    ┌─────────────────────────────────────────────────────────────┐
                                    │                        AWS Cloud                            │
                                    │                                                             │
    ┌─────────┐                     │  ┌─────────────────────────────────────────────────────┐   │
    │ Users   │────HTTPS────────────┼─>│              CloudFront (CDN)                       │   │
    └─────────┘                     │  │  - Global edge locations                            │   │
         │                          │  │  - HTTPS termination                                │   │
         │                          │  │  - Security headers                                 │   │
         │                          │  └─────────────────────┬───────────────────────────────┘   │
         │                          │                        │                                   │
         │                          │  ┌─────────────────────▼───────────────────────────────┐   │
         │                          │  │         S3 Bucket (Private)                         │   │
         │                          │  │  - Static web assets                                │   │
         │                          │  │  - OAC access only                                  │   │
         │                          │  └─────────────────────────────────────────────────────┘   │
         │                          │                                                             │
         │                          │  ┌─────────────────────────────────────────────────────┐   │
         │                          │  │                    VPC                              │   │
         │                          │  │                                                     │   │
         │                          │  │  ┌─────────────────────────────────────────────┐   │   │
         │                          │  │  │           Public Subnets                    │   │   │
         │                          │  │  │  ┌───────────────────────────────────────┐  │   │   │
         └──────────HTTPS───────────┼──┼──┼─>│     Application Load Balancer        │  │   │   │
                                    │  │  │  │  - Internet-facing                    │  │   │   │
                                    │  │  │  │  - HTTPS only                         │  │   │   │
                                    │  │  │  └───────────────────┬───────────────────┘  │   │   │
                                    │  │  └─────────────────────┼───────────────────────┘   │   │
                                    │  │                        │                           │   │
                                    │  │  ┌─────────────────────▼───────────────────────┐   │   │
                                    │  │  │           Private Subnets                   │   │   │
                                    │  │  │  ┌───────────────────────────────────────┐  │   │   │
                                    │  │  │  │       ECS Fargate (API)               │  │   │   │
                                    │  │  │  │  - No public IP                       │  │   │   │
                                    │  │  │  │  - Auto-scaling                       │  │   │   │
                                    │  │  │  │  - Container Insights                 │  │   │   │
                                    │  │  │  └───────────────────┬───────────────────┘  │   │   │
                                    │  │  │                      │                      │   │   │
                                    │  │  │  ┌──────────────┐    │    ┌──────────────┐  │   │   │
                                    │  │  │  │ NAT Gateway  │◄───┼────│ VPC Endpoints│  │   │   │
                                    │  │  │  └──────────────┘    │    └──────────────┘  │   │   │
                                    │  │  └──────────────────────┼──────────────────────┘   │   │
                                    │  │                         │                          │   │
                                    │  │  ┌──────────────────────▼──────────────────────┐   │   │
                                    │  │  │           Isolated Subnets                  │   │   │
                                    │  │  │  ┌───────────────────────────────────────┐  │   │   │
                                    │  │  │  │       RDS PostgreSQL                  │  │   │   │
                                    │  │  │  │  - No internet access                 │  │   │   │
                                    │  │  │  │  - Encrypted at rest                  │  │   │   │
                                    │  │  │  │  - IAM authentication                 │  │   │   │
                                    │  │  │  └───────────────────────────────────────┘  │   │   │
                                    │  │  └─────────────────────────────────────────────┘   │   │
                                    │  │                                                     │   │
                                    │  └─────────────────────────────────────────────────────┘   │
                                    │                                                             │
                                    │  ┌─────────────────────────────────────────────────────┐   │
                                    │  │         Infrastructure Control Lambda               │   │
                                    │  │  - Start/Stop ECS + RDS                             │   │
                                    │  │  - Cost optimization                                │   │
                                    │  └─────────────────────────────────────────────────────┘   │
                                    │                                                             │
                                    └─────────────────────────────────────────────────────────────┘
```

## Security Features

### Network Security
- **VPC Isolation**: Resources deployed in isolated network segments
- **Private Subnets**: API and database in private subnets without public IPs
- **Isolated Subnets**: Database has no internet access whatsoever
- **Security Groups**: Minimal ingress/egress rules with specific source restrictions
- **VPC Flow Logs**: All network traffic logged for security monitoring

### Access Control
- **IAM Least Privilege**: Each component has minimal required permissions
- **No Public Database**: RDS only accessible from within VPC
- **OAC for S3**: CloudFront uses Origin Access Control (not legacy OAI)
- **Secrets Manager**: Database credentials stored securely, rotated automatically

### Data Security
- **Encryption at Rest**: S3, RDS, and CloudWatch Logs encrypted
- **Encryption in Transit**: HTTPS enforced everywhere, TLS 1.2+ only
- **SSL Required for Database**: PostgreSQL connections require SSL

### Application Security
- **Security Headers**: CSP, HSTS, X-Frame-Options via CloudFront
- **Container Security**: ECR image scanning enabled
- **ECS Exec**: Enabled for secure debugging (audit logged)

## Stacks

| Stack | Resources | Purpose |
|-------|-----------|---------|
| `TendVpcStack` | VPC, Subnets, NAT, VPC Endpoints | Network infrastructure |
| `TendDatabaseStack` | RDS PostgreSQL, Secrets Manager | Database layer |
| `TendApiStack` | ECS Cluster, Fargate Service, ALB, ECR | API backend |
| `TendWebStack` | S3, CloudFront, OAC | Web frontend |
| `TendControlStack` | Lambda function | Infrastructure start/stop |

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Node.js 20+**
3. **AWS CDK CLI**: `npm install -g aws-cdk`
4. **Docker** (for building container images)

## Deployment

### First-Time Setup

```bash
# Navigate to infrastructure directory
cd infra

# Install dependencies
npm install

# Bootstrap CDK (first time only, per account/region)
cdk bootstrap aws://ACCOUNT_ID/REGION

# Synthesize CloudFormation templates
npm run synth
```

### Deploy All Stacks

```bash
# Deploy everything (recommended order handled automatically)
npm run deploy

# Or deploy individually
npm run deploy:vpc
npm run deploy:database
npm run deploy:api
npm run deploy:web
npm run deploy:control
```

### Deploy API Container

After deploying infrastructure, push your API container:

```bash
# Login to ECR
aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com

# Build and push
docker build -t tend-api -f apps/api/Dockerfile .
docker tag tend-api:latest ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/tend-api:latest
docker push ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/tend-api:latest

# Update ECS service to use new image
aws ecs update-service --cluster tend-cluster --service tend-api-service --force-new-deployment
```

### Deploy Web Assets

```bash
# Build web application
npm run build:web

# Sync to S3
aws s3 sync dist/apps/web s3://BUCKET_NAME --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```

## Infrastructure Control (Cost Optimization)

### Stop Infrastructure (Save Costs)

```bash
# Using npm script
npm run stop-infra

# Or using AWS CLI directly
aws lambda invoke \
  --function-name tend-infrastructure-control \
  --payload '{"action":"stop"}' \
  /dev/stdout
```

This will:
1. Scale ECS service to 0 tasks
2. Stop the RDS instance

### Start Infrastructure

```bash
# Using npm script
npm run start-infra

# Or using AWS CLI directly
aws lambda invoke \
  --function-name tend-infrastructure-control \
  --payload '{"action":"start"}' \
  /dev/stdout
```

This will:
1. Start the RDS instance
2. Scale ECS service to desired count

### Check Status

```bash
aws lambda invoke \
  --function-name tend-infrastructure-control \
  --payload '{"action":"status"}' \
  /dev/stdout
```

### Automatic Scheduling (Optional)

To enable automatic shutdown/startup, uncomment the EventBridge rules in `control-stack.ts`:
- Auto-shutdown at 10 PM UTC (Mon-Fri)
- Auto-startup at 8 AM UTC (Mon-Fri)

## Cost Optimization

### Current Configuration (Development/Low-Traffic)

| Resource | Configuration | Estimated Monthly Cost |
|----------|---------------|----------------------|
| NAT Gateway | 1x (single AZ) | ~$32 |
| RDS | db.t3.micro | ~$15 |
| ECS Fargate | 0.25 vCPU, 0.5GB | ~$10 (when running) |
| ALB | 1x | ~$16 |
| CloudFront | Price Class 100 | ~$1-5 |
| S3 | Standard | ~$1-2 |
| VPC Endpoints | 4x Interface | ~$28 |

**Total: ~$100-110/month** (when running)

### Cost Saving Tips

1. **Stop when not in use**: Use the control Lambda to stop overnight
2. **VPC Endpoints**: Consider removing if NAT costs are acceptable
3. **Reserved Instances**: For production, reserve RDS for 1-3 years
4. **Spot Fargate**: Use Spot capacity for non-critical workloads
5. **Single AZ**: Current config uses single AZ (not HA) for cost

### Production Configuration

For production workloads, consider:
- Multi-AZ RDS deployment
- Multiple NAT Gateways
- Larger instance types
- Reserved capacity
- WAF for API protection

## Monitoring

### CloudWatch Dashboards

Access via AWS Console:
- VPC Flow Logs: `/tend/vpc/flow-logs`
- API Logs: `/tend/ecs/api`
- RDS Logs: `/tend/rds/postgresql`
- Lambda Logs: `/tend/lambda/infrastructure-control`

### Alarms (Recommended)

Set up CloudWatch alarms for:
- RDS CPU > 80%
- ECS CPU > 70%
- ALB 5xx errors > threshold
- RDS storage > 80%

## Troubleshooting

### ECS Tasks Not Starting

1. Check ECS service events:
   ```bash
   aws ecs describe-services --cluster tend-cluster --services tend-api-service
   ```

2. Check task definition and container logs

3. Verify security groups allow traffic

### Database Connection Issues

1. Verify RDS is running:
   ```bash
   aws rds describe-db-instances --db-instance-identifier tend-database
   ```

2. Check security group rules

3. Verify secret contains correct connection string

### CloudFront 403 Errors

1. Check S3 bucket policy includes CloudFront OAC
2. Verify OAC is attached to distribution
3. Check file exists in S3 bucket

## Cleanup

To destroy all infrastructure:

```bash
# WARNING: This will delete all resources including data
npm run destroy
```

Note: RDS snapshots are created on deletion by default.
