export default {
  awsRegion: import.meta.env.VITE_AWS_REGION || "ap-southeast-2",
  restApiUrl: import.meta.env.VITE_REST_API_URL || "http://localhost:4000",
  cognitoUserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  cognitoClientDomain: import.meta.env.VITE_COGNITO_APP_CLIENT_DOMAIN,
  cognitoAppClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
};
