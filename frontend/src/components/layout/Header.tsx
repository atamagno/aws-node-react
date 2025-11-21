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
    <header>
      <div onClick={() => navigate("/")} role="button">
        <div className="display-6">Things App</div>
      </div>
      <div>
        {auth.isAuthenticated ? (
          <div className="d-flex align-items-center gap-3">
            <span>Hello, {auth.user?.profile.email}</span>
            <button className="btn btn-primary" onClick={() => signOutRedirect()}>
              Sign out
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => auth.signinRedirect()}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
