#!/bin/bash

source ./utils.sh

START_TIME=$(date -R)

setVariablesFromParameters $1

APP_NAME="aws-node-react"
AWS_REGION="${AWS_REGION:-ap-southeast-2}"
ENVIRONMENT_NAME="${ENVIRONMENT_NAME:-dev}"
PREFIX="${APP_NAME}-${ENVIRONMENT_NAME}-"

COGNITO_STACK="${PREFIX}cognito-stack"
FRONTEND_STACK="${PREFIX}frontend-stack"
getStackOutputs ${FRONTEND_STACK}

FRONTEND_BUCKET_NAME=$Stack_FrontendBucketName
FRONTEND_DISTRIBUTION_ID=$Stack_FrontendDistributionId

if [ "${BACKEND}" = "ecs" ]; then
  API_STACK="${PREFIX}api-ecs-stack"
  getStackOutputs ${API_STACK}
  export VITE_REST_API_URL=$Stack_HttpApiStageUrl
else
  API_STACK="${PREFIX}api-lambda-stack"
  getStackOutputs ${API_STACK}
  export VITE_REST_API_URL=$Stack_RestApiUrl
fi

getStackOutputs ${COGNITO_STACK}
export VITE_COGNITO_USER_POOL_ID=$Stack_UserPoolId
export VITE_COGNITO_APP_CLIENT_DOMAIN=$Stack_UserPoolDomain
export VITE_COGNITO_APP_CLIENT_ID=$Stack_UserPoolClientId

export VITE_AWS_REGION=${AWS_REGION}

echo "*** Building code ***"
npm install
checkIfFailed

npm run build
checkIfFailed

echo "*** Cleaning S3 bucket ${FRONTEND_BUCKET_NAME} ***"
aws s3 rm s3://${FRONTEND_BUCKET_NAME} --recursive
checkIfFailed

echo "*** Uploading to S3 bucket ${FRONTEND_BUCKET_NAME} ***"
aws s3 cp ./dist s3://${FRONTEND_BUCKET_NAME}/ --recursive
checkIfFailed

echo "*** Create Cloudfront invalidation ***"
aws cloudfront create-invalidation --distribution-id ${FRONTEND_DISTRIBUTION_ID} --paths "/*"
checkIfFailed

END_TIME=$(date -R)

echo "Start time : ${START_TIME}"
echo "End time   : ${END_TIME}"