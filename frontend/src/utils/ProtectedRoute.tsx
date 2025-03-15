import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
