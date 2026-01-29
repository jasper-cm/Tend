import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface VpcStackProps extends cdk.StackProps {
  appName: string;
}

/**
 * VPC Stack - Creates a secure VPC with:
 * - Public subnets for ALB (internet-facing)
 * - Private subnets with NAT for ECS tasks (outbound only)
 * - Isolated subnets for RDS (no internet access)
 * - VPC Flow Logs for security monitoring
 */
export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);

    const { appName } = props;

    // VPC Flow Logs for security monitoring
    const flowLogGroup = new logs.LogGroup(this, 'VpcFlowLogs', {
      logGroupName: `/${appName}/vpc/flow-logs`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create VPC with public, private, and isolated subnets
    this.vpc = new ec2.Vpc(this, 'Vpc', {
      vpcName: `${appName}-vpc`,
      maxAzs: 2, // Use 2 AZs for high availability while keeping costs down
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),

      // Subnet configuration for security isolation
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
          mapPublicIpOnLaunch: false, // Don't auto-assign public IPs
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],

      // Use single NAT Gateway for cost optimization
      // For production, consider natGateways: 2 for HA
      natGateways: 1,

      // Enable DNS support for private hosted zones
      enableDnsHostnames: true,
      enableDnsSupport: true,

      // Flow logs for security monitoring
      flowLogs: {
        cloudwatch: {
          destination: ec2.FlowLogDestination.toCloudWatchLogs(flowLogGroup),
          trafficType: ec2.FlowLogTrafficType.ALL,
        },
      },
    });

    // Add VPC endpoints for AWS services (reduces NAT costs and improves security)
    this.addVpcEndpoints();

    // Outputs
    new cdk.CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
      description: 'VPC ID',
      exportName: `${appName}-vpc-id`,
    });

    new cdk.CfnOutput(this, 'PublicSubnets', {
      value: this.vpc.publicSubnets.map(s => s.subnetId).join(','),
      description: 'Public subnet IDs',
      exportName: `${appName}-public-subnets`,
    });

    new cdk.CfnOutput(this, 'PrivateSubnets', {
      value: this.vpc.privateSubnets.map(s => s.subnetId).join(','),
      description: 'Private subnet IDs',
      exportName: `${appName}-private-subnets`,
    });

    new cdk.CfnOutput(this, 'IsolatedSubnets', {
      value: this.vpc.isolatedSubnets.map(s => s.subnetId).join(','),
      description: 'Isolated subnet IDs',
      exportName: `${appName}-isolated-subnets`,
    });
  }

  /**
   * Add VPC endpoints for AWS services to:
   * - Reduce NAT Gateway costs
   * - Improve security (traffic stays within AWS network)
   * - Reduce latency
   */
  private addVpcEndpoints(): void {
    // S3 Gateway Endpoint (free)
    this.vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [
        { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      ],
    });

    // DynamoDB Gateway Endpoint (free) - useful if we add caching later
    this.vpc.addGatewayEndpoint('DynamoDbEndpoint', {
      service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
      subnets: [
        { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      ],
    });

    // Interface endpoints security group
    const endpointSg = new ec2.SecurityGroup(this, 'VpcEndpointSg', {
      vpc: this.vpc,
      description: 'Security group for VPC interface endpoints',
      allowAllOutbound: false,
    });

    // Allow HTTPS from within VPC
    endpointSg.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(443),
      'Allow HTTPS from VPC'
    );

    // ECR API endpoint (for pulling container images)
    this.vpc.addInterfaceEndpoint('EcrApiEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [endpointSg],
      privateDnsEnabled: true,
    });

    // ECR Docker endpoint (for pulling container images)
    this.vpc.addInterfaceEndpoint('EcrDockerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [endpointSg],
      privateDnsEnabled: true,
    });

    // CloudWatch Logs endpoint (for container logging)
    this.vpc.addInterfaceEndpoint('CloudWatchLogsEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [endpointSg],
      privateDnsEnabled: true,
    });

    // Secrets Manager endpoint (for database credentials)
    this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [endpointSg],
      privateDnsEnabled: true,
    });
  }
}
