#!/bin/bash

source ./utils.sh

START_TIME=$(date -R)

setVariablesFromParameters $1

if [ -z "${ACCOUNT_ID}" ]
then
  export ACCOUNT_ID=$(aws sts get-caller-identity | jq -r '.Account')
fi

export GIT_HASH=`git rev-parse --short HEAD`
if [ -z "${GIT_HASH}" ]; then
  export GIT_HASH="unknown"
  echo "Using default git hash of unknown"
fi

export GIT_BRANCH=`git symbolic-ref --short HEAD`
if [ -z "${GIT_BRANCH}" ]; then
  export GIT_BRANCH="hash"
  echo "Using default git branch of hash"
fi

APP_NAME="aws-node-react"
AWS_REGION="${AWS_REGION:-ap-southeast-2}"
ENVIRONMENT_NAME="${ENVIRONMENT_NAME:-dev}"
PREFIX="${APP_NAME}-${ENVIRONMENT_NAME}-"
POSTFIX="-${ACCOUNT_ID}-${AWS_REGION}"
IMAGE_TAG="${GIT_HASH:-latest}"

S3_DEPLOYMENT_BUCKET_NAME="${PREFIX}deployment${POSTFIX}"

DDB_CFN_TEMPLATE="cfn/ddb.yaml"
DDB_STACK="${PREFIX}ddb-stack"
API_CFN_TEMPLATE="cfn/api.yaml"
API_STACK="${PREFIX}api-stack"
FRONTEND_STACK="${PREFIX}frontend-stack"
FRONTEND_CFN_TEMPLATE="cfn/frontend.yaml"
CFN_TAGS="Application=${APP_NAME} Environment=${ENVIRONMENT_NAME}"

echo "*** Starting build and deployment ***"

echo "AWS_REGION       : ${AWS_REGION}"
echo "ENVIRONMENT_NAME : ${ENVIRONMENT_NAME}"
echo "S3_BUCKET_NAME   : ${S3_DEPLOYMENT_BUCKET_NAME}"
echo "GIT BRANCH       : ${GIT_BRANCH}"
echo "GIT HASH         : ${GIT_HASH}"

if [ -z "${DEPLOY_SPECIFIC}" ] || [ "${DEPLOY_DDB}" = "true" ]; then
  echo "*** Deploying DynamoDB Table ***"

  aws cloudformation deploy \
    --stack-name $DDB_STACK \
    --template-file $DDB_CFN_TEMPLATE \
    --parameter-overrides \
        pAppName=$APP_NAME \
        pEnvironmentName=$ENVIRONMENT_NAME \
        pGitBranch=$GIT_BRANCH \
        pGitHash=$GIT_HASH \
    --capabilities CAPABILITY_NAMED_IAM \
    --no-fail-on-empty-changeset \
    --tags $CFN_TAGS \
    --region ${AWS_REGION}

  checkIfFailed
fi

if [ -z "${DEPLOY_SPECIFIC}" ] || [ "${DEPLOY_FE}" = "true" ]; then
  echo "*** Deploying Frontend Stack ***"

  aws cloudformation deploy \
    --stack-name $FRONTEND_STACK \
    --template-file $FRONTEND_CFN_TEMPLATE \
    --parameter-overrides \
        pAppName=$APP_NAME \
        pEnvironmentName=$ENVIRONMENT_NAME \
        pGitBranch=$GIT_BRANCH \
        pGitHash=$GIT_HASH \
    --capabilities CAPABILITY_NAMED_IAM \
    --no-fail-on-empty-changeset \
    --tags $CFN_TAGS \
    --region ${AWS_REGION}

  checkIfFailed
fi

if [ -z "${DEPLOY_SPECIFIC}" ] || [ "${DEPLOY_API}" = "true" ]; then
  echo "*** Deploying API Gateway and Lambda Functions ***"

  getStackOutputs ${FRONTEND_STACK}
  export FRONTEND_DISTRIBUTION_DOMAIN_NAME=$Stack_FrontendDistributionDomainName

  echo "*** Building code ***"
  npm install
  npm run build

  # Create S3 Bucket to store code
  echo "*** Creating S3 Bucket ***"
  aws s3api head-bucket --bucket "${S3_DEPLOYMENT_BUCKET_NAME}" 2>/dev/null || aws s3 mb s3://${S3_DEPLOYMENT_BUCKET_NAME}

  sam package \
    --template-file ${API_CFN_TEMPLATE} \
    --output-template-file cfn/api-packaged.yaml \
    --s3-bucket ${S3_DEPLOYMENT_BUCKET_NAME} \
    --s3-prefix api \
    --region ${AWS_REGION}

  checkIfFailed

  sam deploy --template-file cfn/api-packaged.yaml \
    --s3-bucket ${S3_DEPLOYMENT_BUCKET_NAME} \
    --s3-prefix api \
    --stack-name ${API_STACK} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${AWS_REGION}  \
    --no-fail-on-empty-changeset \
    --parameter-overrides \
      ParameterKey=pAppName,ParameterValue=${APP_NAME} \
      ParameterKey=pEnvironmentName,ParameterValue=${ENVIRONMENT_NAME} \
      ParameterKey=pDdbStackName,ParameterValue=${DDB_STACK} \
      ParameterKey=pGitBranch,ParameterValue=${GIT_BRANCH} \
      ParameterKey=pGitHash,ParameterValue=${GIT_HASH}

  checkIfFailed
fi

END_TIME=$(date -R)

echo "Start time : ${START_TIME}"
echo "End time   : ${END_TIME}"