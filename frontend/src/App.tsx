import { BrowserRouter, Route, Routes } from "react-router";

import "./App.css";
import ThingList from "./components/ThingList";
import Layout from "./components/layout/Layout";
import ThingDetail from "./components/ThingDetail";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<ThingList />} />
          <Route path="/thing/:id" element={<ThingDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
