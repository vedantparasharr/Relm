import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
