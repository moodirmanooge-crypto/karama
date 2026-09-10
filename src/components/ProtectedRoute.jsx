import { Navigate } from "react-router-dom";
import { getAdminSession } from "../lib/adminSession";

export default function ProtectedRoute({ children }) {
  const admin = getAdminSession();
  if (!admin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
