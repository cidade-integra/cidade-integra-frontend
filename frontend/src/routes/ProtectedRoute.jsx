import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import useModalStore from "@/hooks/useModalStore";
import { useToast } from "@/hooks/use-toast";

function AdminRoute({ children }) {
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();
  const { openModal } = useModalStore();
  const { toast } = useToast();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading) {
        if (user && user.role !== "admin") {
          toast({
            title: "Acesso Negado",
            description: "Você não possui permissão para acessar esta área.",
            variant: "destructive",
          });
          navigate("/acesso-negado", { replace: true });
          return;
        }

        if (!user) {
          toast({
            title: "⚠️ Acesso Restrito",
            description: "Faça login para acessar esta página de administrador.",
          });

          const result = await openModal("login", {}, null, { overlayColor: "bg-azul" });

          if (result === "success") {
            setChecked(true);
          } else {
            navigate("/", { replace: true });
          }
        } else {
          setChecked(true);
        }
      }
    };

    checkAccess();
  }, [loading, user]);

  if (loading || !checked) {
    return <div>Carregando...</div>;
  }

  return <>{children}</>;
}

export default AdminRoute; // ✅ GARANTA ESTA LINHA
