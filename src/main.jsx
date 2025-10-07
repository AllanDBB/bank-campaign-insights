import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import DataLoad from "./pages/DataLoad/DataLoad.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DataLoad/>}/>
      <Route path="/app" element={<App/>}/>
    </Routes>
  </BrowserRouter>
);

