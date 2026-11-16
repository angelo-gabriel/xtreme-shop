import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedAdminRoute() {
  const { loading, user, isAdmin } = useAuth();

  if (loading) {
    return <p>Verificando autenticação...</p>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
