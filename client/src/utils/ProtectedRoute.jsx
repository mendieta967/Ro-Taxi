import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const ProtectedRoute = ({ children, role = [] }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.accountStatus === "Pending")
    return <Navigate to="/complete-account" replace />;

  if (role.length > 0 && !role?.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
};
export default ProtectedRoute;
