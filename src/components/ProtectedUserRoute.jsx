import { Navigate } from "react-router-dom";
import { getUserSession } from "../lib/userSession";

export default function ProtectedUserRoute({ children }) {
  const user = getUserSession();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}