#!/bin/bash
START_TIME=$(date -R)
GLOBAL_OVERRIDES=$1

set -e  # Exit on any error

export PERMISSIONS_BOUNDARY="none"
######## Get script parameters separated by ; and set them as global variables #########
OLD_IFS=$IFS # backup original separator (new line usually) so we can revert it as other code might rely on it
export IFS=";"
ALLOWED_KEYS=("AWS_REGION" "ACCOUNT_ID" "ENVIRONMENT_NAME" "IMAGE_TAG")
for keyVal in $GLOBAL_OVERRIDES; do
  KEY=${keyVal%=*}
  VALUE=${keyVal#*=}
  # Check if KEY is in the whitelist
  for allowed in "${ALLOWED_KEYS[@]}"; do
    if [[ "$KEY" == "$allowed" ]]; then
      export ${KEY}="${VALUE}"
      break
    fi
  done
done
export IFS=$OLD_IFS # put separator back to normal

if [ -z "${AWS_REGION}" ]
then
  echo "AWS_REGION environment variable is not set. Aborting."
  exit 1
fi

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

getStackOutputs () {
  stackOutputs=$(aws cloudformation describe-stacks --region ${AWS_REGION} --stack-name ${1} | jq -r '.Stacks[0].Outputs | map({key:.OutputKey,value:.OutputValue})| .[] | "Stack_" + .key + "=" + .value' | tr -d '\r')
  if [[ -z "$stackOutputs" ]]; then
    if [ "${2}" = "noexit" ]; then
      return
    fi
      echo "Failed to retrieve stack outputs from stack (${1})"
      echo "Aborting pipeline"
      exit 255
  else
    echo "Successfully retrieved values from ${1}"
    for key in ${stackOutputs}; do
      export ${key}
    done
  fi
}

APP_NAME="aws-node-react"
ENVIRONMENT_NAME="${ENVIRONMENT_NAME:-dev}"
PREFIX="${APP_NAME}-${ENVIRONMENT_NAME}-"
POSTFIX="-${ACCOUNT_ID}-${AWS_REGION}"
IMAGE_TAG="${GIT_HASH:-latest}"

DDB_CFN_TEMPLATE="cfn/ddb.yaml"
DDB_STACK="${PREFIX}ddb-stack"
LAMBDA_CFN_TEMPLATE="cfn/lambda.yaml"
LAMBDA_STACK="${PREFIX}lambda-stack"
API_CFN_TEMPLATE="cfn/api.yaml"
API_STACK="${PREFIX}api-stack"
CFN_TAGS="Application=${APP_NAME} Environment=${ENVIRONMENT_NAME}"

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
  --region $AWS_REGION

echo "*** Deploying Lambda Function ***"

aws cloudformation deploy \
  --stack-name $LAMBDA_STACK \
  --template-file $LAMBDA_CFN_TEMPLATE \
  --parameter-overrides \
      pAppName=$APP_NAME \
      pEnvironmentName=$ENVIRONMENT_NAME \
      pGitBranch=$GIT_BRANCH \
      pGitHash=$GIT_HASH \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --tags $CFN_TAGS \
  --region $AWS_REGION

# Retrieve Lambda ARN from Lambda stack outputs
getStackOutputs $LAMBDA_STACK
LAMBDA_ARN=$Stack_ApiFunctionArn

echo "*** Deploying API Gateway ***"

aws cloudformation deploy \
  --stack-name $API_STACK \
  --template-file $API_CFN_TEMPLATE \
  --parameter-overrides \
      pAppName=$APP_NAME \
      pEnvironmentName=$ENVIRONMENT_NAME \
      pLambdaArn=$LAMBDA_ARN \
      pGitBranch=$GIT_BRANCH \
      pGitHash=$GIT_HASH \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --tags $CFN_TAGS \
  --region $AWS_REGION

END_TIME=$(date -R)

echo "Start time : ${START_TIME}"
echo "End time   : ${END_TIME}"