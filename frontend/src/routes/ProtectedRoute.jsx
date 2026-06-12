import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  if (auth?.loading) {
    return <p>Loading...</p>;
  }
  if (!auth?.user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
