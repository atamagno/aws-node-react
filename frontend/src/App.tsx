import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router";

import "./App.css";
import Things from "./components/Things";
import Welcome from "./components/Welcome";
import { setAuthToken } from "./lib/axios";
import Layout from "./components/layout/Layout";
import ThingDetail from "./components/ThingDetail";
import PageNotFound from "./components/PageNotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThingsDataProvider } from "./contexts/ThingsDataContext";

function App() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.user?.access_token) {
      setAuthToken(auth.user.access_token);
    } else {
      setAuthToken(null);
    }
  }, [auth.user]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <Layout>
            <Welcome />
          </Layout>
        </BrowserRouter>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThingsDataProvider>
          <Layout>
            <Routes>
              <Route index element={<Things />} />
              <Route path="/thing/:id" element={<ThingDetail />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Layout>
        </ThingsDataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
