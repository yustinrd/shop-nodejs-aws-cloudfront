import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';

export const region = 'eu-west-1';
const tableProduct = 'product';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region,
    stage: "dev",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TABLE_PRODUCT: tableProduct
    },
    logs: {
      frameworkLambda: true,
      httpApi: true,
      restApi: true,
      websocket: true
    },
    httpApi: {
      cors: {
        allowedHeaders: ['*'],
        allowedMethods: ['*']
      }
    },
    iam: {
      role: {
            managedPolicies: ['arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess']
        },
    },

  },
  functions: {
    getProductsList,
    getProductsById,
    createProduct
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    logForwarding: {
        destinationARN: "arn:aws:lambda:eu-west-1:584448160243:function:product-service-dev-createProduct"
    }
  },
    resources: {
      Resources: {
          ProductsTable: {
              Type: 'AWS::DynamoDB::Table',
              Properties: {
                  AttributeDefinitions: [{
                      AttributeName: 'id',
                      AttributeType: 'S'
                  }],
                  KeySchema:  [{
                      AttributeName: 'id',
                      KeyType: 'HASH'
                  }],
                  TableName: tableProduct,
                  ProvisionedThroughput: {
                      ReadCapacityUnits: 5,
                      WriteCapacityUnits: 5
                  }
              }
          },
          StocksTable: {
              Type: 'AWS::DynamoDB::Table',
              Properties: {
                  TableName: 'Stocks',
                  AttributeDefinitions: [
                      {
                          AttributeName: 'ProductId',
                          AttributeType: 'S'
                      }
                  ],
                  KeySchema: [
                      {
                          AttributeName: 'ProductId',
                          KeyType: 'HASH'
                      }
                  ],
                  ProvisionedThroughput: {
                      ReadCapacityUnits: 5,
                      WriteCapacityUnits: 5
                  }
              }
          }
      }
    }
};

module.exports = serverlessConfiguration;
