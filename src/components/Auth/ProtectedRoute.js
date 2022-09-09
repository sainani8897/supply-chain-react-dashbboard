import { Navigate } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";
// import useAuth from "../../Auth/userAuthuseAuth";

export const ProtectedRoute = ({ children }) => {
  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
};
