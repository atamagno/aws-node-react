import { BrowserRouter, Route, Routes } from "react-router";

import "./App.css";
import Things from "./components/Things";
import Layout from "./components/layout/Layout";
import ThingDetail from "./components/ThingDetail";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThingsDataProvider } from "./contexts/ThingsDataContext";

function App() {
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
