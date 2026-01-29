import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import * as path from 'path';

export interface ControlStackProps extends cdk.StackProps {
  appName: string;
  ecsCluster: ecs.Cluster;
  ecsService: ecs.FargateService;
  rdsInstance: rds.DatabaseInstance;
  /**
   * List of IAM principal ARNs allowed to invoke the control Lambda
   * If empty, only account root can invoke (requires explicit IAM permissions)
   */
  allowedInvokerArns?: string[];
}

/**
 * Control Stack - Lambda functions to start/stop infrastructure:
 * - Start: Starts RDS instance, scales ECS to desired count
 * - Stop: Scales ECS to 0, stops RDS instance
 * - Scheduled rules for automatic shutdown (cost savings)
 * - IAM roles with least privilege
 */
export class ControlStack extends cdk.Stack {
  public readonly controlFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: ControlStackProps) {
    super(scope, id, props);

    const { appName, ecsCluster, ecsService, rdsInstance, allowedInvokerArns = [] } = props;

    // CloudWatch log group for Lambda
    const logGroup = new logs.LogGroup(this, 'ControlLambdaLogs', {
      logGroupName: `/${appName}/lambda/infrastructure-control`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // IAM role for Lambda with least privilege
    const lambdaRole = new iam.Role(this, 'ControlLambdaRole', {
      roleName: `${appName}-infrastructure-control-role`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role for Tend infrastructure control Lambda',
    });

    // Basic Lambda execution (CloudWatch Logs)
    lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );

    // ECS permissions - only for specific cluster and service
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      sid: 'ECSServiceControl',
      effect: iam.Effect.ALLOW,
      actions: [
        'ecs:UpdateService',
        'ecs:DescribeServices',
      ],
      resources: [ecsService.serviceArn],
    }));

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      sid: 'ECSClusterDescribe',
      effect: iam.Effect.ALLOW,
      actions: ['ecs:DescribeClusters'],
      resources: [ecsCluster.clusterArn],
    }));

    // RDS permissions - only for specific instance
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      sid: 'RDSInstanceControl',
      effect: iam.Effect.ALLOW,
      actions: [
        'rds:StartDBInstance',
        'rds:StopDBInstance',
        'rds:DescribeDBInstances',
      ],
      resources: [
        `arn:aws:rds:${this.region}:${this.account}:db:${rdsInstance.instanceIdentifier}`,
      ],
    }));

    // Create Lambda function with reserved concurrency to prevent abuse
    this.controlFunction = new lambda.Function(this, 'ControlFunction', {
      functionName: `${appName}-infrastructure-control`,
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64, // Cost optimization
      handler: 'index.handler',
      code: lambda.Code.fromInline(this.getLambdaCode(
        ecsCluster.clusterName,
        ecsService.serviceName,
        rdsInstance.instanceIdentifier
      )),
      role: lambdaRole,
      timeout: cdk.Duration.minutes(2), // Reduced from 5 to limit resource consumption
      memorySize: 256,
      logGroup,
      environment: {
        ECS_CLUSTER: ecsCluster.clusterName,
        ECS_SERVICE: ecsService.serviceName,
        RDS_INSTANCE: rdsInstance.instanceIdentifier,
        DESIRED_TASK_COUNT: '1', // Default task count when starting
      },
      description: 'Lambda function to start/stop Tend infrastructure',
      reservedConcurrentExecutions: 1, // Limit concurrent executions
    });

    // Security: Add resource-based policy to restrict who can invoke the Lambda
    // By default, no external invocation is allowed - requires explicit IAM permissions
    // If allowedInvokerArns is provided, grant those principals explicit permission
    if (allowedInvokerArns.length > 0) {
      allowedInvokerArns.forEach((principalArn, index) => {
        this.controlFunction.addPermission(`AllowInvoker${index}`, {
          principal: new iam.ArnPrincipal(principalArn),
          action: 'lambda:InvokeFunction',
        });
      });
    }

    // Note: Lambda is NOT publicly accessible
    // Invocation requires either:
    // 1. IAM permissions to call lambda:InvokeFunction on this function
    // 2. Being listed in allowedInvokerArns (adds resource-based policy)

    // Optional: Schedule automatic shutdown at night (cost savings)
    // Uncomment to enable automatic shutdown at 10 PM UTC
    /*
    const shutdownRule = new events.Rule(this, 'ShutdownRule', {
      ruleName: `${appName}-auto-shutdown`,
      description: 'Automatically stop infrastructure at night',
      schedule: events.Schedule.cron({
        minute: '0',
        hour: '22', // 10 PM UTC
        weekDay: 'MON-FRI',
      }),
    });

    shutdownRule.addTarget(new targets.LambdaFunction(this.controlFunction, {
      event: events.RuleTargetInput.fromObject({ action: 'stop' }),
    }));

    // Optional: Schedule automatic startup in morning
    const startupRule = new events.Rule(this, 'StartupRule', {
      ruleName: `${appName}-auto-startup`,
      description: 'Automatically start infrastructure in morning',
      schedule: events.Schedule.cron({
        minute: '0',
        hour: '8', // 8 AM UTC
        weekDay: 'MON-FRI',
      }),
    });

    startupRule.addTarget(new targets.LambdaFunction(this.controlFunction, {
      event: events.RuleTargetInput.fromObject({ action: 'start' }),
    }));
    */

    // Outputs
    new cdk.CfnOutput(this, 'ControlFunctionArn', {
      value: this.controlFunction.functionArn,
      description: 'Infrastructure control Lambda ARN',
      exportName: `${appName}-control-function-arn`,
    });

    new cdk.CfnOutput(this, 'ControlFunctionName', {
      value: this.controlFunction.functionName,
      description: 'Infrastructure control Lambda name',
      exportName: `${appName}-control-function-name`,
    });

    new cdk.CfnOutput(this, 'StartCommand', {
      value: `aws lambda invoke --function-name ${this.controlFunction.functionName} --payload '{"action":"start"}' /dev/stdout`,
      description: 'Command to start infrastructure',
    });

    new cdk.CfnOutput(this, 'StopCommand', {
      value: `aws lambda invoke --function-name ${this.controlFunction.functionName} --payload '{"action":"stop"}' /dev/stdout`,
      description: 'Command to stop infrastructure',
    });

    new cdk.CfnOutput(this, 'StatusCommand', {
      value: `aws lambda invoke --function-name ${this.controlFunction.functionName} --payload '{"action":"status"}' /dev/stdout`,
      description: 'Command to check infrastructure status',
    });
  }

  /**
   * Generate inline Lambda code for infrastructure control
   */
  private getLambdaCode(clusterName: string, serviceName: string, rdsInstanceId: string): string {
    return `
const { ECSClient, UpdateServiceCommand, DescribeServicesCommand } = require('@aws-sdk/client-ecs');
const { RDSClient, StartDBInstanceCommand, StopDBInstanceCommand, DescribeDBInstancesCommand } = require('@aws-sdk/client-rds');

const ecsClient = new ECSClient();
const rdsClient = new RDSClient();

const ECS_CLUSTER = process.env.ECS_CLUSTER;
const ECS_SERVICE = process.env.ECS_SERVICE;
const RDS_INSTANCE = process.env.RDS_INSTANCE;
const DESIRED_TASK_COUNT = parseInt(process.env.DESIRED_TASK_COUNT || '1', 10);

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const action = event.action?.toLowerCase();

  if (!['start', 'stop', 'status'].includes(action)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid action. Use "start", "stop", or "status".',
      }),
    };
  }

  try {
    if (action === 'status') {
      return await getStatus();
    } else if (action === 'start') {
      return await startInfrastructure();
    } else if (action === 'stop') {
      return await stopInfrastructure();
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        action,
      }),
    };
  }
};

async function getStatus() {
  const [ecsStatus, rdsStatus] = await Promise.all([
    getEcsStatus(),
    getRdsStatus(),
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      action: 'status',
      ecs: ecsStatus,
      rds: rdsStatus,
      timestamp: new Date().toISOString(),
    }),
  };
}

async function getEcsStatus() {
  const response = await ecsClient.send(new DescribeServicesCommand({
    cluster: ECS_CLUSTER,
    services: [ECS_SERVICE],
  }));

  const service = response.services?.[0];
  return {
    desiredCount: service?.desiredCount || 0,
    runningCount: service?.runningCount || 0,
    status: service?.status || 'UNKNOWN',
  };
}

async function getRdsStatus() {
  const response = await rdsClient.send(new DescribeDBInstancesCommand({
    DBInstanceIdentifier: RDS_INSTANCE,
  }));

  const instance = response.DBInstances?.[0];
  return {
    status: instance?.DBInstanceStatus || 'UNKNOWN',
    endpoint: instance?.Endpoint?.Address || null,
  };
}

async function startInfrastructure() {
  console.log('Starting infrastructure...');

  // Start RDS first (takes longer)
  const rdsResult = await startRds();
  console.log('RDS start result:', rdsResult);

  // Scale ECS service
  const ecsResult = await scaleEcs(DESIRED_TASK_COUNT);
  console.log('ECS scale result:', ecsResult);

  return {
    statusCode: 200,
    body: JSON.stringify({
      action: 'start',
      message: 'Infrastructure start initiated',
      rds: rdsResult,
      ecs: ecsResult,
      timestamp: new Date().toISOString(),
    }),
  };
}

async function stopInfrastructure() {
  console.log('Stopping infrastructure...');

  // Scale ECS to 0 first
  const ecsResult = await scaleEcs(0);
  console.log('ECS scale result:', ecsResult);

  // Stop RDS (will fail gracefully if already stopped)
  const rdsResult = await stopRds();
  console.log('RDS stop result:', rdsResult);

  return {
    statusCode: 200,
    body: JSON.stringify({
      action: 'stop',
      message: 'Infrastructure stop initiated',
      ecs: ecsResult,
      rds: rdsResult,
      timestamp: new Date().toISOString(),
    }),
  };
}

async function startRds() {
  try {
    // Check current status
    const statusResponse = await rdsClient.send(new DescribeDBInstancesCommand({
      DBInstanceIdentifier: RDS_INSTANCE,
    }));

    const currentStatus = statusResponse.DBInstances?.[0]?.DBInstanceStatus;

    if (currentStatus === 'available') {
      return { status: 'already-running', message: 'RDS instance is already running' };
    }

    if (currentStatus !== 'stopped') {
      return { status: 'pending', message: \`RDS instance is in state: \${currentStatus}\` };
    }

    // Start the instance
    await rdsClient.send(new StartDBInstanceCommand({
      DBInstanceIdentifier: RDS_INSTANCE,
    }));

    return { status: 'starting', message: 'RDS instance start initiated' };
  } catch (error) {
    if (error.name === 'InvalidDBInstanceStateFault') {
      return { status: 'pending', message: 'RDS instance is in a transitional state' };
    }
    throw error;
  }
}

async function stopRds() {
  try {
    // Check current status
    const statusResponse = await rdsClient.send(new DescribeDBInstancesCommand({
      DBInstanceIdentifier: RDS_INSTANCE,
    }));

    const currentStatus = statusResponse.DBInstances?.[0]?.DBInstanceStatus;

    if (currentStatus === 'stopped') {
      return { status: 'already-stopped', message: 'RDS instance is already stopped' };
    }

    if (currentStatus !== 'available') {
      return { status: 'pending', message: \`RDS instance is in state: \${currentStatus}\` };
    }

    // Stop the instance
    await rdsClient.send(new StopDBInstanceCommand({
      DBInstanceIdentifier: RDS_INSTANCE,
    }));

    return { status: 'stopping', message: 'RDS instance stop initiated' };
  } catch (error) {
    if (error.name === 'InvalidDBInstanceStateFault') {
      return { status: 'pending', message: 'RDS instance is in a transitional state' };
    }
    throw error;
  }
}

async function scaleEcs(desiredCount) {
  await ecsClient.send(new UpdateServiceCommand({
    cluster: ECS_CLUSTER,
    service: ECS_SERVICE,
    desiredCount,
  }));

  return {
    status: desiredCount > 0 ? 'scaling-up' : 'scaling-down',
    desiredCount,
    message: \`ECS service scaling to \${desiredCount} tasks\`,
  };
}
`;
  }
}
