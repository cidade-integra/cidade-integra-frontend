import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/UseAuthentication";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { mapAuthError } from "@/utils/mapAuthError";
import { useUserReports } from "@/hooks/useUserReports";

export default function useUserProfile() {
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    user: usuarioData,
    loading: userLoading,
    error,
  } = useFetchUser(user?.uid);

  const { updateUser, loading: updateLoading } = useUpdateUser();
  const { reports: minhasDenuncias, loading: denunciasLoading } =
    useUserReports(user?.uid);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordAlertOpen, setIsPasswordAlertOpen] = useState(false);

  // detecta se o usuário usou Google para login
  const isGoogleUser = useMemo(() => {
    return user?.providerData?.some(
      (provider) => provider.providerId === "google.com"
    );
  }, [user]);

  const calcularPorcentagemResolvidas = () => {
    
    const resolvidas = minhasDenuncias.filter(
      (d) => d.status === "resolved"
    ).length;

    return minhasDenuncias.length > 0
      ? Math.round((resolvidas / minhasDenuncias.length) * 100)
      : 0;
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nome = formData.get("nome");
    const email = formData.get("email");
    const bio = formData.get("bio");
    const senhaAtual = formData.get("senha-atual");
    const novaSenha = formData.get("nova-senha");
    const confirmarNovaSenha = formData.get("confirmar-senha");

    const currentUser = auth.currentUser;

    if (!currentUser) return;

    try {
      // atualiza senha (se não for login Google)
      if (!isGoogleUser && senhaAtual && novaSenha && confirmarNovaSenha) {
        if (novaSenha !== confirmarNovaSenha) {
          setIsPasswordAlertOpen(true);
          return;
        }

        const credential = EmailAuthProvider.credential(
          currentUser.email,
          senhaAtual
        );
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, novaSenha);
        toast({
          title: "Senha atualizada",
          description: "Sua senha foi atualizada com sucesso.",
        });
      }

      // atualiza e-mail (se mudou)
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      // atualiza displayName no Auth
      if (nome !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: nome });
      }

      // atualiza dados no Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        displayName: nome,
        email: email,
        bio: bio,
      });

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });

      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      const msg = mapAuthError(err);
      toast({
        title: "Erro ao atualizar perfil",
        description: msg || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return {
    usuarioData,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isPasswordAlertOpen,
    setIsPasswordAlertOpen,
    minhasDenuncias,
    calcularPorcentagemResolvidas,
    handleEditProfile,
    loading: userLoading || updateLoading || denunciasLoading,
    updateLoading,
    error,
    isGoogleUser, // retorna essa flag para uso no componente
  };
}
