setVariablesFromParameters() {
  GLOBAL_OVERRIDES=$1
  export PERMISSIONS_BOUNDARY="none"
  ######## Get script parameters separated by ; and set them as global variables #########
  OLD_IFS=$IFS # backup original separator (new line usually) so we can revert it as other code might rely on it
  export IFS=";"
  ALLOWED_KEYS=("AWS_REGION" "ACCOUNT_ID" "ENVIRONMENT_NAME" "IMAGE_TAG" "BACKEND")
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
}

checkIfFailed() {
  latestReturnCode=$?
  if [ $latestReturnCode -ne 0 ]
  then
    echo "Fail code found ($latestReturnCode)...exiting pipeline"
    exit 255
  fi
}

getStackOutputs() {
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