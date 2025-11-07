import { BrowserRouter, Route, Routes } from "react-router";

import "./App.css";
import Things from "./components/Things";
import Layout from "./components/layout/Layout";
import ThingDetail from "./components/ThingDetail";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<Things />} />
          <Route path="/thing/:id" element={<ThingDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
