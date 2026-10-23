import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const auth = JSON.parse(localStorage.getItem("adminAuth"));
  if (!auth?.token || auth?.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default AdminProtectedRoute;