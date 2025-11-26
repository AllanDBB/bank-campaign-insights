import { Navigate } from "react-router-dom";

export default function VerifySession({ pantalla }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return pantalla;
}
