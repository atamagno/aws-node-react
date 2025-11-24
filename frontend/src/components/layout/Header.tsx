import { useNavigate } from "react-router";
import { useAuth } from "react-oidc-context";

import { signOutRedirect } from "../../lib/auth";

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOutRedirect(auth.removeUser);
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
            <button className="btn btn-primary" onClick={handleSignOut}>
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
