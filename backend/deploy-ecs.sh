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
ECR_REPOSITORY_NAME="${PREFIX}repository${POSTFIX}"
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_TAG="${GIT_HASH:-latest}" # TODO: add a condition to use latest if specified
IMAGE_URI="$ECR_REGISTRY/$ECR_REPOSITORY_NAME:$IMAGE_TAG"
# VPC_CIDR="${VPC_CIDR:-10.0.0.0/16}"

# VPC_CFN_TEMPLATE="cfn/vpc.yml"
# VPC_STACK="${PREFIX}vpc-stack"
ECR_CFN_TEMPLATE="cfn/ecr.yml"
ECR_STACK="${PREFIX}ecr-repository-stack"
DDB_STACK="${PREFIX}ddb-stack"
ECS_CFN_TEMPLATE="cfn/ecs.yml"
ECS_STACK="${PREFIX}ecs-stack"
ELB_STACK="${PREFIX}elb-stack"
ELB_CFN_TEMPLATE="cfn/elb.yml"
CFN_TAGS="Application=${APP_NAME} Environment=${ENVIRONMENT_NAME}"

if [ "${DEPLOY_ECR}" = "true" ]; then
  echo "*** Building code ***"
  npm install
  npm run build:prod

  echo "*** Deploying ECR Repository ***"

  aws cloudformation deploy \
    --stack-name $ECR_STACK \
    --template-file $ECR_CFN_TEMPLATE \
    --parameter-overrides \
        pRepositoryName=$ECR_REPOSITORY_NAME \
        pGitBranch=$GIT_BRANCH \
        pGitHash=$GIT_HASH \
    --capabilities CAPABILITY_NAMED_IAM \
    --no-fail-on-empty-changeset \
    --tags $CFN_TAGS \
    --region $AWS_REGION

  checkIfFailed

  echo "Logging in to ECR..."
  aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

  echo "Building Docker image..."
  docker build --provenance false -t $ECR_REPOSITORY_NAME .

  echo "Tagging image with $IMAGE_TAG..."
  docker tag $ECR_REPOSITORY_NAME:latest $ECR_REGISTRY/$ECR_REPOSITORY_NAME:$IMAGE_TAG
  docker tag $ECR_REPOSITORY_NAME:latest $ECR_REGISTRY/$ECR_REPOSITORY_NAME:latest

  echo "Pushing image to ECR..."
  docker push $ECR_REGISTRY/$ECR_REPOSITORY_NAME --all-tags

  echo "Image pushed to ECR successfully!"
  echo "Image: $ECR_REGISTRY/$ECR_REPOSITORY_NAME:$IMAGE_TAG"
fi

# echo "*** Deploying VPC stack $VPC_STACK ***"

# aws cloudformation deploy \
#   --stack-name $VPC_STACK \
#   --template-file $VPC_CFN_TEMPLATE \
#   --parameter-overrides \
#       pAppName=$APP_NAME \
#       pEnvironmentName=$ENVIRONMENT_NAME \
#       pVpcCidr=$VPC_CIDR \
#       pGitBranch=$GIT_BRANCH \
#       pGitHash=$GIT_HASH \
#   --capabilities CAPABILITY_NAMED_IAM \
#   --no-fail-on-empty-changeset \
#   --tags $CFN_TAGS \
#   --region $AWS_REGION

# checkIfFailed

# getStackOutputs $VPC_STACK

# VPC_ID=$Stack_VPC
# PUBLIC_SUBNET_IDS=$Stack_PublicSubnets
# PRIVATE_SUBNET_IDS=$Stack_PrivateSubnets

# echo "Using VPC $VPC_ID and subnets $PUBLIC_SUBNET_IDS"

# get the default VPC ID
VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[*].VpcId' --output text)
PUBLIC_SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text | tr '\t' ',')

echo "*** Deploying ELB stack $ELB_STACK ***"

aws cloudformation deploy \
  --stack-name $ELB_STACK \
  --template-file $ELB_CFN_TEMPLATE \
  --parameter-overrides \
      pAppName=$APP_NAME \
      pEnvironmentName=$ENVIRONMENT_NAME \
      pVpcId=$VPC_ID \
      pPublicSubnetIds=$PUBLIC_SUBNET_IDS \
      pGitBranch=$GIT_BRANCH \
      pGitHash=$GIT_HASH \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --tags $CFN_TAGS \
  --region $AWS_REGION

checkIfFailed

getStackOutputs $ELB_STACK

ELB_SECURITY_GROUP_ID=$Stack_ELBSecurityGroupId
ELB_TARGET_GROUP_A_ARN=$Stack_ELBTargetGroupAArn

echo "*** Deploying ECS stack $ECS_STACK ***"

aws cloudformation deploy \
  --stack-name $ECS_STACK \
  --template-file $ECS_CFN_TEMPLATE \
  --parameter-overrides \
      pAppName=$APP_NAME \
      pEnvironmentName=$ENVIRONMENT_NAME \
      pImageUri=$IMAGE_URI \
      pVpcId=$VPC_ID \
      pPrivateSubnetIds=$PUBLIC_SUBNET_IDS \
      pELBSecurityGroupId=$ELB_SECURITY_GROUP_ID \
      pTargetGroupArn=$ELB_TARGET_GROUP_A_ARN \
      pDdbStackName=$DDB_STACK \
      pGitBranch=$GIT_BRANCH \
      pGitHash=$GIT_HASH \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-fail-on-empty-changeset \
  --tags $CFN_TAGS \
  --region $AWS_REGION

checkIfFailed

END_TIME=$(date -R)

echo "Start time : ${START_TIME}"
echo "End time   : ${END_TIME}"