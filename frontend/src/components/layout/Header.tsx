import { useNavigate } from "react-router";
import { useAuth } from "react-oidc-context";

import config from "../../config/config";

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const signOutRedirect = async () => {
    // Remove user from local OIDC session storage
    await auth.removeUser();

    // Redirect to Cognito logout to end the server-side session
    const clientId = config.cognitoAppClientId;
    const logoutUri = `${window.location.protocol}//${window.location.host}`;
    const cognitoDomain = `https://${config.cognitoClientDomain}.auth.${config.awsRegion}.amazoncognito.com`;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <h3>Things App</h3>
      </div>
      <div>
        {auth.isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>Hello, {auth.user?.profile.email}</span>
            <button onClick={() => signOutRedirect()}>Sign out</button>
          </div>
        ) : (
          <button onClick={() => auth.signinRedirect()}>Sign in</button>
        )}
      </div>
    </header>
  );
};

export default Header;
