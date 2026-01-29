import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface DatabaseStackProps extends cdk.StackProps {
  appName: string;
  vpc: ec2.Vpc;
  /**
   * Enable deletion protection (recommended for production)
   */
  deletionProtection?: boolean;
  /**
   * Backup retention period in days (default: 7, production: 30+)
   */
  backupRetentionDays?: number;
}

/**
 * Database Stack - Creates a secure RDS PostgreSQL instance:
 * - Deployed in isolated subnets (no internet access)
 * - Encrypted at rest and in transit
 * - Credentials stored in Secrets Manager
 * - Automated backups enabled
 * - Security group with minimal access
 */
export class DatabaseStack extends cdk.Stack {
  public readonly databaseInstance: rds.DatabaseInstance;
  public readonly databaseSecret: secretsmanager.ISecret;
  public readonly databaseSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const {
      appName,
      vpc,
      deletionProtection = false,
      backupRetentionDays = 7,
    } = props;

    // Security group for RDS - only allows access from private subnets
    this.databaseSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc,
      securityGroupName: `${appName}-database-sg`,
      description: 'Security group for Tend RDS PostgreSQL',
      allowAllOutbound: false, // RDS doesn't need outbound access
    });

    // Allow PostgreSQL connections from private subnets (where ECS tasks run)
    // This is secure because:
    // 1. RDS is in isolated subnets with no internet access
    // 2. Only resources in the VPC can reach the database
    // 3. Private subnets contain only ECS tasks with proper IAM roles
    vpc.privateSubnets.forEach((subnet, index) => {
      this.databaseSecurityGroup.addIngressRule(
        ec2.Peer.ipv4(subnet.ipv4CidrBlock),
        ec2.Port.tcp(5432),
        `Allow PostgreSQL from private subnet ${index + 1}`
      );
    });

    // Parameter group for PostgreSQL optimizations
    const parameterGroup = new rds.ParameterGroup(this, 'ParameterGroup', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),
      description: `${appName} PostgreSQL parameter group`,
      parameters: {
        // Security: Force SSL connections
        'rds.force_ssl': '1',
        // Performance tuning
        'shared_buffers': '{DBInstanceClassMemory/4096}', // 25% of instance memory
        'effective_cache_size': '{DBInstanceClassMemory*3/4096}', // 75% of instance memory
        'maintenance_work_mem': '256000', // 256MB
        'checkpoint_completion_target': '0.9',
        'wal_buffers': '16384', // 16MB
        'default_statistics_target': '100',
        'random_page_cost': '1.1', // Optimized for SSD
        'effective_io_concurrency': '200',
        'work_mem': '16384', // 16MB per operation
        'min_wal_size': '1024', // 1GB
        'max_wal_size': '4096', // 4GB
        // Logging
        'log_statement': 'ddl',
        'log_min_duration_statement': '1000', // Log queries over 1 second
      },
    });

    // Create the database credentials secret
    // Uses AWS-managed encryption by default (aws/secretsmanager key)
    this.databaseSecret = new secretsmanager.Secret(this, 'DatabaseSecret', {
      secretName: `${appName}/database/credentials`,
      description: 'RDS PostgreSQL credentials for Tend',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'tend_admin' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        excludeCharacters: '"@/\\\'',
        passwordLength: 32,
      },
    });

    // Subnet group for isolated subnets
    const subnetGroup = new rds.SubnetGroup(this, 'SubnetGroup', {
      vpc,
      subnetGroupName: `${appName}-database-subnet-group`,
      description: 'Subnet group for Tend RDS in isolated subnets',
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    // CloudWatch log group for RDS logs
    new logs.LogGroup(this, 'DatabaseLogs', {
      logGroupName: `/${appName}/rds/postgresql`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create RDS PostgreSQL instance
    this.databaseInstance = new rds.DatabaseInstance(this, 'Database', {
      instanceIdentifier: `${appName}-database`,
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),

      // Instance configuration - t3.micro for cost optimization
      // Upgrade to t3.small or larger for production workloads
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),

      // Network configuration - isolated subnet, no public access
      vpc,
      subnetGroup,
      securityGroups: [this.databaseSecurityGroup],
      publiclyAccessible: false, // CRITICAL: No public access

      // Database configuration
      databaseName: 'tend',
      credentials: rds.Credentials.fromSecret(this.databaseSecret),
      parameterGroup,

      // Storage configuration - encrypted with AWS-managed key (AES-256)
      allocatedStorage: 20, // 20 GB minimum for gp3
      maxAllocatedStorage: 100, // Auto-scale up to 100 GB
      storageType: rds.StorageType.GP3,
      storageEncrypted: true, // Encrypt at rest with AWS-managed key

      // Backup configuration - configurable for environment
      backupRetention: cdk.Duration.days(backupRetentionDays),
      preferredBackupWindow: '03:00-04:00', // 3-4 AM UTC
      preferredMaintenanceWindow: 'sun:04:00-sun:05:00', // Sunday 4-5 AM UTC
      deleteAutomatedBackups: false,

      // High availability - single AZ for cost, enable multi-AZ for production
      multiAz: false,

      // Monitoring
      cloudwatchLogsExports: ['postgresql', 'upgrade'],
      enablePerformanceInsights: true,
      performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT, // 7 days (free tier)
      monitoringInterval: cdk.Duration.seconds(60),

      // Deletion protection - configurable per environment
      deletionProtection: deletionProtection,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT, // Create snapshot on delete

      // IAM authentication for enhanced security
      iamAuthentication: true,

      // Auto minor version upgrades
      autoMinorVersionUpgrade: true,
    });

    // Note: RDS automatically creates CloudWatch log groups with the format:
    // /aws/rds/instance/{instance-id}/{log-type}
    // The logGroup defined above is for application-level logging if needed.
    // RDS permissions for CloudWatch Logs are managed internally by AWS.

    // Outputs
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: this.databaseInstance.dbInstanceEndpointAddress,
      description: 'RDS endpoint address',
      exportName: `${appName}-database-endpoint`,
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value: this.databaseInstance.dbInstanceEndpointPort,
      description: 'RDS port',
      exportName: `${appName}-database-port`,
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: this.databaseSecret.secretArn,
      description: 'Database credentials secret ARN',
      exportName: `${appName}-database-secret-arn`,
    });

    new cdk.CfnOutput(this, 'DatabaseInstanceId', {
      value: this.databaseInstance.instanceIdentifier,
      description: 'RDS instance identifier',
      exportName: `${appName}-database-instance-id`,
    });
  }
}
