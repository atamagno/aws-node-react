#!/bin/bash

source ./utils.sh

START_TIME=$(date -R)

setVariablesFromParameters $1

if [ -z "${AWS_REGION}" ]
then
  echo "AWS_REGION environment variable is not set. Aborting."
  exit 1
fi

APP_NAME="aws-node-react"
ENVIRONMENT_NAME="${ENVIRONMENT_NAME:-dev}"
PREFIX="${APP_NAME}-${ENVIRONMENT_NAME}-"

FRONTEND_STACK="${PREFIX}frontend-stack"
getStackOutputs ${FRONTEND_STACK}

FRONTEND_BUCKET_NAME=$Stack_FrontendBucketName
FRONTEND_DISTRIBUTION_ID=$Stack_FrontendDistributionId

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