import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import DataLoad from "./pages/DataLoad/DataLoad.jsx";

import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import VerifySession from "./VerifySession.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
<Routes>
  {/* Rutas públicas */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Rutas protegidas */}
  <Route
    path="/"
    element={
      <VerifySession>
        <DataLoad />
      </VerifySession>
    }
  />

  <Route
    path="/app/*"
    element={
      <VerifySession>
        <App />
      </VerifySession>
    }
  />

  {/* Rutas inválidas */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>

  </BrowserRouter>
);
