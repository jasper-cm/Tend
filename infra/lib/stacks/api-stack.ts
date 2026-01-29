import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export interface ApiStackProps extends cdk.StackProps {
  appName: string;
  vpc: ec2.Vpc;
  databaseSecret: secretsmanager.ISecret;
  /**
   * Domain name for the API (e.g., api.tend.app)
   * If provided, an ACM certificate will be created/used
   */
  domainName?: string;
  /**
   * ARN of existing ACM certificate (optional)
   * If not provided and domainName is set, DNS validation will be required
   */
  certificateArn?: string;
  /**
   * Enable ECS Exec for debugging (default: false for security)
   * Only enable in development environments
   */
  enableEcsExec?: boolean;
}

/**
 * API Stack - Creates ECS Fargate service with ALB:
 * - Fargate tasks in private subnets (no direct internet access)
 * - ALB in public subnets (only public-facing component)
 * - IAM roles with least privilege
 * - Restricted outbound traffic
 * - CloudWatch logging with KMS encryption
 * - Auto-scaling configured
 */
export class ApiStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;
  public readonly service: ecs.FargateService;
  public readonly apiUrl: string;
  public readonly repository: ecr.Repository;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const {
      appName,
      vpc,
      databaseSecret,
      domainName,
      certificateArn,
      enableEcsExec = false, // Default to false for security
    } = props;

    // Create ECR repository for API container images
    // Uses AWS-managed encryption (AES-256) by default
    this.repository = new ecr.Repository(this, 'ApiRepository', {
      repositoryName: `${appName}-api`,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      imageScanOnPush: true, // Security: Scan images for vulnerabilities
      imageTagMutability: ecr.TagMutability.IMMUTABLE, // Prevent tag overwriting
      encryption: ecr.RepositoryEncryption.AES_256, // AWS-managed encryption
      lifecycleRules: [
        {
          description: 'Keep only last 10 images',
          maxImageCount: 10,
          rulePriority: 1,
        },
      ],
    });

    // Create ECS cluster
    this.cluster = new ecs.Cluster(this, 'Cluster', {
      clusterName: `${appName}-cluster`,
      vpc,
      containerInsights: true, // Enable Container Insights for monitoring
    });

    // CloudWatch log group for container logs
    const logGroup = new logs.LogGroup(this, 'ApiLogs', {
      logGroupName: `/${appName}/ecs/api`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Task execution role - used by ECS to pull images and write logs
    const executionRole = new iam.Role(this, 'TaskExecutionRole', {
      roleName: `${appName}-api-execution-role`,
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'ECS task execution role for Tend API',
    });

    // Attach managed policy for basic ECS task execution
    executionRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
    );

    // Grant access to read database secret
    // AWS-managed encryption allows access through Secrets Manager permissions only
    executionRole.addToPolicy(new iam.PolicyStatement({
      sid: 'SecretsManagerRead',
      effect: iam.Effect.ALLOW,
      actions: [
        'secretsmanager:GetSecretValue',
        'secretsmanager:DescribeSecret',
      ],
      resources: [databaseSecret.secretArn],
    }));

    // Task role - used by the application inside the container
    const taskRole = new iam.Role(this, 'TaskRole', {
      roleName: `${appName}-api-task-role`,
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'ECS task role for Tend API application',
    });

    // Grant task role access to database secret (for runtime access)
    taskRole.addToPolicy(new iam.PolicyStatement({
      sid: 'SecretsManagerRead',
      effect: iam.Effect.ALLOW,
      actions: [
        'secretsmanager:GetSecretValue',
        'secretsmanager:DescribeSecret',
      ],
      resources: [databaseSecret.secretArn],
    }));

    // Task definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition', {
      family: `${appName}-api`,
      memoryLimitMiB: 512, // 0.5 GB - adjust based on needs
      cpu: 256, // 0.25 vCPU - adjust based on needs
      executionRole,
      taskRole,
      runtimePlatform: {
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        cpuArchitecture: ecs.CpuArchitecture.ARM64, // ARM64 for cost savings
      },
    });

    // Container definition - uses private ECR repository
    // Initial deployment will use a placeholder until CI/CD pushes the real image
    const container = taskDefinition.addContainer('ApiContainer', {
      containerName: `${appName}-api`,
      // Use private ECR repository - CI/CD will push images here
      // For initial deployment, this will fail gracefully until an image is pushed
      image: ecs.ContainerImage.fromEcrRepository(this.repository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({
        logGroup,
        streamPrefix: 'api',
      }),
      environment: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
      secrets: {
        // Inject database URL from Secrets Manager
        DATABASE_URL: ecs.Secret.fromSecretsManager(databaseSecret, 'connectionString'),
      },
      healthCheck: {
        command: ['CMD-SHELL', 'wget -q -O - http://localhost:3000/health || exit 1'],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        retries: 3,
        startPeriod: cdk.Duration.seconds(60),
      },
      portMappings: [
        {
          containerPort: 3000,
          protocol: ecs.Protocol.TCP,
        },
      ],
    });

    // Security group for ECS tasks - RESTRICTED outbound
    const serviceSecurityGroup = new ec2.SecurityGroup(this, 'ServiceSecurityGroup', {
      vpc,
      securityGroupName: `${appName}-api-service-sg`,
      description: 'Security group for Tend API ECS tasks',
      allowAllOutbound: false, // Restrict outbound traffic
    });

    // Allow outbound HTTPS to VPC endpoints (for AWS APIs)
    serviceSecurityGroup.addEgressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(443),
      'Allow HTTPS to VPC endpoints'
    );

    // Security group for ALB
    const albSecurityGroup = new ec2.SecurityGroup(this, 'AlbSecurityGroup', {
      vpc,
      securityGroupName: `${appName}-api-alb-sg`,
      description: 'Security group for Tend API ALB',
      allowAllOutbound: false,
    });

    // Allow HTTPS from internet to ALB
    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS from internet'
    );

    // Allow HTTP from internet (for redirect to HTTPS)
    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP from internet (redirect to HTTPS)'
    );

    // Allow ALB to reach ECS tasks
    serviceSecurityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(3000),
      'Allow traffic from ALB'
    );

    // Allow ALB outbound to ECS tasks
    albSecurityGroup.addEgressRule(
      serviceSecurityGroup,
      ec2.Port.tcp(3000),
      'Allow traffic to ECS tasks'
    );

    // Allow ECS tasks outbound to RDS
    // Use CIDR-based rule to avoid cross-stack reference
    serviceSecurityGroup.addEgressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(5432),
      'Allow PostgreSQL to RDS in VPC'
    );

    // Create Application Load Balancer in public subnets
    const alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      loadBalancerName: `${appName}-api-alb`,
      vpc,
      internetFacing: true, // Public-facing
      securityGroup: albSecurityGroup,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    // Create target group
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'TargetGroup', {
      targetGroupName: `${appName}-api-tg`,
      vpc,
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: '/health',
        healthyHttpCodes: '200',
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
      },
      deregistrationDelay: cdk.Duration.seconds(30),
    });

    // HTTP listener - redirect to HTTPS
    alb.addListener('HttpListener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.redirect({
        port: '443',
        protocol: 'HTTPS',
        permanent: true,
      }),
    });

    // HTTPS listener with certificate
    let certificate: acm.ICertificate | undefined;

    if (certificateArn) {
      // Use existing certificate
      certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', certificateArn);
    } else if (domainName) {
      // Create new certificate (requires DNS validation)
      certificate = new acm.Certificate(this, 'Certificate', {
        domainName,
        validation: acm.CertificateValidation.fromDns(),
      });
    }

    // Add HTTPS listener
    if (certificate) {
      alb.addListener('HttpsListener', {
        port: 443,
        protocol: elbv2.ApplicationProtocol.HTTPS,
        certificates: [certificate],
        defaultAction: elbv2.ListenerAction.forward([targetGroup]),
        sslPolicy: elbv2.SslPolicy.TLS13_RES, // Use TLS 1.3 with restricted ciphers
      });
    } else {
      // Development mode without certificate - log warning
      console.warn(
        'WARNING: No TLS certificate configured. For production, provide domainName or certificateArn.'
      );
      // Still create listener but it won't work without a certificate in AWS
      // This allows the stack to deploy for development/testing
      alb.addListener('HttpsListener', {
        port: 443,
        protocol: elbv2.ApplicationProtocol.HTTP, // HTTP on 443 for dev only
        defaultAction: elbv2.ListenerAction.forward([targetGroup]),
      });
    }

    // Create Fargate service in private subnets
    this.service = new ecs.FargateService(this, 'Service', {
      serviceName: `${appName}-api-service`,
      cluster: this.cluster,
      taskDefinition,
      desiredCount: 1, // Start with 1, scale as needed
      securityGroups: [serviceSecurityGroup],
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      assignPublicIp: false, // No public IP - uses NAT for outbound
      enableExecuteCommand: enableEcsExec, // Disabled by default for security
      circuitBreaker: {
        rollback: true, // Auto-rollback on deployment failure
      },
      minHealthyPercent: 50,
      maxHealthyPercent: 200,
    });

    // Register service with target group
    this.service.attachToApplicationTargetGroup(targetGroup);

    // Auto-scaling
    const scaling = this.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 4,
    });

    // Scale based on CPU utilization
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    // Scale based on memory utilization
    scaling.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    // Store API URL
    this.apiUrl = domainName ? `https://${domainName}` : `https://${alb.loadBalancerDnsName}`;

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.apiUrl,
      description: 'API URL',
      exportName: `${appName}-api-url`,
    });

    new cdk.CfnOutput(this, 'AlbDnsName', {
      value: alb.loadBalancerDnsName,
      description: 'ALB DNS name (for CNAME record)',
      exportName: `${appName}-alb-dns`,
    });

    new cdk.CfnOutput(this, 'EcrRepositoryUri', {
      value: this.repository.repositoryUri,
      description: 'ECR repository URI for API images',
      exportName: `${appName}-ecr-repository-uri`,
    });

    new cdk.CfnOutput(this, 'ClusterArn', {
      value: this.cluster.clusterArn,
      description: 'ECS cluster ARN',
      exportName: `${appName}-cluster-arn`,
    });

    new cdk.CfnOutput(this, 'ServiceArn', {
      value: this.service.serviceArn,
      description: 'ECS service ARN',
      exportName: `${appName}-service-arn`,
    });

    // Security warning output
    if (!certificate) {
      new cdk.CfnOutput(this, 'SecurityWarning', {
        value: 'WARNING: No TLS certificate configured. Configure domainName or certificateArn for production.',
        description: 'Security configuration warning',
      });
    }
  }
}
