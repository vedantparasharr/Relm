import { Navigate } from "react-router-dom";

const GuestRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

export default GuestRoute;
