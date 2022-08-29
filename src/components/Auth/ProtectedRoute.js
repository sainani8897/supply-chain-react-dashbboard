import { Navigate } from "react-router-dom";
import { useAuth } from "../../Auth/userAuth";
// import useAuth from "../../Auth/userAuthuseAuth";

export const ProtectedRoute = ({ children }) => {
  console.log({children});
  const { user } = useAuth();
  // const user = undefined
  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
