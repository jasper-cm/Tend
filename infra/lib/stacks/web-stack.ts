import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import { Construct } from 'constructs';

export interface WebStackProps extends cdk.StackProps {
  appName: string;
  apiUrl: string;
}

/**
 * Web Stack - Creates S3 + CloudFront for static web hosting:
 * - S3 bucket is private (not publicly accessible)
 * - CloudFront Origin Access Control for secure S3 access
 * - HTTPS only with modern TLS
 * - Security headers via response headers policy
 * - Caching optimized for SPA
 */
export class WebStack extends cdk.Stack {
  public readonly distributionUrl: string;
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);

    const { appName, apiUrl } = props;

    // S3 bucket for web assets - PRIVATE, no public access
    this.bucket = new s3.Bucket(this, 'WebBucket', {
      bucketName: `${appName}-web-${this.account}-${this.region}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // Clean up on stack delete

      // Security: Block all public access
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,

      // Security: Enforce SSL
      enforceSSL: true,

      // Security: Enable versioning for rollback capability
      versioned: true,

      // Security: Server-side encryption
      encryption: s3.BucketEncryption.S3_MANAGED,

      // Lifecycle rules to manage old versions
      lifecycleRules: [
        {
          id: 'DeleteOldVersions',
          noncurrentVersionExpiration: cdk.Duration.days(30),
          enabled: true,
        },
      ],
    });

    // S3 bucket for CloudFront access logs
    const logBucket = new s3.Bucket(this, 'LogBucket', {
      bucketName: `${appName}-web-logs-${this.account}-${this.region}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      lifecycleRules: [
        {
          id: 'DeleteOldLogs',
          expiration: cdk.Duration.days(90),
          enabled: true,
        },
      ],
      objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
    });

    // Origin Access Control for secure S3 access
    const oac = new cloudfront.CfnOriginAccessControl(this, 'OAC', {
      originAccessControlConfig: {
        name: `${appName}-web-oac`,
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
        description: 'OAC for Tend web bucket',
      },
    });

    // Security headers policy
    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(this, 'SecurityHeaders', {
      responseHeadersPolicyName: `${appName}-security-headers`,
      comment: 'Security headers for Tend web application',
      securityHeadersBehavior: {
        // Prevent clickjacking
        frameOptions: {
          frameOption: cloudfront.HeadersFrameOption.DENY,
          override: true,
        },
        // Prevent MIME type sniffing
        contentTypeOptions: {
          override: true,
        },
        // Enable XSS protection
        xssProtection: {
          protection: true,
          modeBlock: true,
          override: true,
        },
        // Referrer policy
        referrerPolicy: {
          referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
          override: true,
        },
        // Strict Transport Security
        strictTransportSecurity: {
          accessControlMaxAge: cdk.Duration.days(365),
          includeSubdomains: true,
          preload: true,
          override: true,
        },
        // Content Security Policy
        // Note: Angular requires 'unsafe-inline' for styles. For scripts, modern Angular
        // builds may work without 'unsafe-eval' but some features require it.
        // For production, consider using nonce-based CSP with server-side injection.
        contentSecurityPolicy: {
          contentSecurityPolicy: [
            "default-src 'self'",
            // Angular 18+ can work with stricter CSP in production builds
            // 'wasm-unsafe-eval' allows WebAssembly compilation
            "script-src 'self' 'wasm-unsafe-eval'",
            // 'unsafe-inline' for styles is still needed for Angular components
            "style-src 'self' 'unsafe-inline'",
            `connect-src 'self' ${apiUrl} wss://${apiUrl.replace('https://', '')}`,
            "img-src 'self' data: https: blob:",
            "font-src 'self' data:",
            "object-src 'none'",
            "frame-src 'none'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
            "block-all-mixed-content",
          ].join('; '),
          override: true,
        },
      },
      customHeadersBehavior: {
        customHeaders: [
          {
            header: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
            override: true,
          },
        ],
      },
    });

    // WAF WebACL for CloudFront protection
    // Note: For CloudFront, WAF must be in us-east-1
    const webAcl = new wafv2.CfnWebACL(this, 'WebWaf', {
      name: `${appName}-web-waf`,
      scope: 'CLOUDFRONT', // Required for CloudFront
      defaultAction: { allow: {} },
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: `${appName}-web-waf`,
        sampledRequestsEnabled: true,
      },
      rules: [
        // AWS Managed Rules - Common Rule Set
        {
          name: 'AWS-AWSManagedRulesCommonRuleSet',
          priority: 1,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet',
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'CommonRuleSet',
            sampledRequestsEnabled: true,
          },
        },
        // Rate limiting for static content
        {
          name: 'RateLimitRule',
          priority: 2,
          action: { block: {} },
          statement: {
            rateBasedStatement: {
              limit: 5000, // Higher limit for static content
              aggregateKeyType: 'IP',
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'RateLimit',
            sampledRequestsEnabled: true,
          },
        },
      ],
    });

    // Cache policy for static assets
    const cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      cachePolicyName: `${appName}-cache-policy`,
      comment: 'Cache policy for Tend web application',
      defaultTtl: cdk.Duration.days(1),
      minTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.days(365),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      comment: `${appName} web application`,
      defaultRootObject: 'index.html',

      // WAF protection
      webAclId: webAcl.attrArn,

      // HTTPS only
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,

      // HTTP/2 and HTTP/3 for performance
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,

      // Price class - use all edge locations for best performance
      // Use PRICE_CLASS_100 for lower cost (US, Europe only)
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,

      // Enable IPv6
      enableIpv6: true,

      // Access logging
      enableLogging: true,
      logBucket: logBucket,
      logFilePrefix: 'cloudfront/',

      // Default behavior
      defaultBehavior: {
        origin: new origins.S3Origin(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy,
        responseHeadersPolicy,
        compress: true,
      },

      // SPA routing - return index.html for 404s
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    // Get the underlying CfnDistribution to set OAC
    const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution;

    // Update origin to use OAC instead of OAI
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.OriginAccessControlId',
      oac.attrId
    );
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity',
      ''
    );

    // Update bucket policy to allow CloudFront OAC access
    this.bucket.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AllowCloudFrontServicePrincipal',
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
      actions: ['s3:GetObject'],
      resources: [this.bucket.arnForObjects('*')],
      conditions: {
        StringEquals: {
          'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
        },
      },
    }));

    // Store distribution URL
    this.distributionUrl = `https://${distribution.distributionDomainName}`;

    // Outputs
    new cdk.CfnOutput(this, 'WebUrl', {
      value: this.distributionUrl,
      description: 'Web application URL',
      exportName: `${appName}-web-url`,
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 bucket name for web assets',
      exportName: `${appName}-web-bucket`,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID',
      exportName: `${appName}-distribution-id`,
    });

    new cdk.CfnOutput(this, 'ApiUrlConfig', {
      value: apiUrl,
      description: 'API URL for frontend configuration',
      exportName: `${appName}-api-url-config`,
    });
  }
}
