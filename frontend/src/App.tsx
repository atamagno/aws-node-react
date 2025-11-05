import { BrowserRouter, Route, Routes } from "react-router";

import "./App.css";
import Thing from "./components/Thing";
import ThingList from "./components/ThingList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ThingList />} />
        <Route path="thing/" element={<Thing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
