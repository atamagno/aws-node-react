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