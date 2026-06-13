import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  if (auth?.loading) {
    return <LoadingSpinner />;
  }
  if (!auth?.user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
