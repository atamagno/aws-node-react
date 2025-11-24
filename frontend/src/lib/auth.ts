import { WebStorageStateStore } from "oidc-client-ts";
import type { AuthProviderProps } from "react-oidc-context";

import config from "../config";

export const cognitoAuthConfig: AuthProviderProps = {
  authority: `https://cognito-idp.${config.awsRegion}.amazonaws.com/${config.cognitoUserPoolId}`,
  client_id: config.cognitoAppClientId,
  redirect_uri: `${window.location.protocol}//${window.location.host}`,
  response_type: "code",
  scope: "email openid profile things-api/read things-api/write",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export const signOutRedirect = async (removeUser: () => Promise<void>) => {
  // Remove user from local OIDC session storage
  await removeUser();

  // Redirect to Cognito logout to end the server-side session
  const clientId = config.cognitoAppClientId;
  const logoutUri = `${window.location.protocol}//${window.location.host}`;
  const cognitoDomain = `https://${config.cognitoClientDomain}.auth.${config.awsRegion}.amazoncognito.com`;
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};
