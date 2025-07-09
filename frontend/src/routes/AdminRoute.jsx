import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function AdminRoute({ children }) {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
}
