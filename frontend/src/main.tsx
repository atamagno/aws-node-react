import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";

import App from "./App.tsx";
import config from "./config/config.ts";

const cognitoAuthConfig = {
  authority: `https://cognito-idp.ap-southeast-2.amazonaws.com/${config.cognitoUserPoolId}`,
  client_id: config.cognitoAppClientId,
  redirect_uri: encodeURI(`${window.location.protocol}//${window.location.host}`),
  response_type: "code",
  scope: "email openid profile things-api/read things-api/write",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);
