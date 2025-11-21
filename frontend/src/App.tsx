import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { BrowserRouter, Route, Routes } from "react-router";

import "./App.css";
import Things from "./components/Things";
import { setAuthToken } from "./lib/axios";
import Layout from "./components/layout/Layout";
import ThingDetail from "./components/ThingDetail";
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

  if (auth.error) {
    return <div>Auth error: {auth.error.message}</div>;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThingsDataProvider>
          <Layout>
            <Routes>
              <Route index element={<Things />} />
              <Route path="/thing/:id" element={<ThingDetail />} />
            </Routes>
          </Layout>
        </ThingsDataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
