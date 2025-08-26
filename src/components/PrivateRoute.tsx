// components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  isAuthenticated: Boolean;
  redirectTo?: string;
}

export const PrivateRoute = ({
  isAuthenticated,
  redirectTo = "/login",
}: PrivateRouteProps) => {
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
};