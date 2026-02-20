import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const isAuthenticated = !!localStorage.getItem("auth_token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
