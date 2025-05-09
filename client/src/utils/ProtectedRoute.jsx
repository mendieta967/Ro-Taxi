import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.accountStatus === "Pending")
    return <Navigate to="/complete-account" replace />;

  return children;
};
export default ProtectedRoute;

// {userId: '3', userName: 'Nicolás Abramovich', email: 'abranico011@gmail.com', accountStatus: 'Pending'}
