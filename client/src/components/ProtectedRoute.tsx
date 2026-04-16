import { Navigate, Outlet } from "react-router";

{/* Protects routes by checking if jwt token exists in localStorage*/}
export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}