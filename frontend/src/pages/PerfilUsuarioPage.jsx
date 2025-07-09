import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PerfilHeader from "@/components/perfil/PerfilHeader";
import PerfilUsuarioCard from "@/components/perfil/PerfilUsuarioCard";
import EstatisticasCard from "@/components/perfil/EstatisticasCard";
import MinhasDenuncias from "@/components/perfil/MinhasDenuncias";
import useUserProfile from "@/hooks/useUserProfile";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { ConfirmDeactivateDialog } from "@/components/perfil/ConfirmDeactivateDialog";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";

import GenericModal from "@/components/modals/GenericModal";
import EditProfileFormModal from "@/components/perfil/EditProfileFormModal";

const PerfilUsuarioPage = () => {
  const {
    usuarioData,
    setUsuarioData,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isPasswordAlertOpen,
    setIsPasswordAlertOpen,
    minhasDenuncias,
    calcularPorcentagemResolvidas,
    handleEditProfile,
    loading,
    isGoogleUser,
  } = useUserProfile();

  const { user } = useAuth();
  const userId = user?.uid;
  const { deactivateAccount } = useDeleteAccount();

  if (loading || !usuarioData)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingScreen mensagem="Carregando perfil..." />
        <Footer />
      </div>
    );

  const { reportCount } = usuarioData;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <PerfilHeader />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* coluna de informações do usuário */}
            <div className="md:col-span-1 space-y-4">
              <PerfilUsuarioCard
                usuario={usuarioData}
                onEditClick={() => setIsEditDialogOpen(true)}
              />
              <EstatisticasCard
                totalDenuncias={reportCount}
                porcentagemResolvidas={calcularPorcentagemResolvidas()}
              />
              <div className="flex justify-center mt-4">
                <ConfirmDeactivateDialog onConfirm={deactivateAccount} />
              </div>
            </div>

            {/* coluna de conteúdo principal - "minhas denúncias" */}
            <div className="md:col-span-2">
              <MinhasDenuncias userId={userId} />
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <GenericModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title={{
          text: "Editar Perfil",
          className: "text-2xl font-bold text-azul",
        }}
        description={{
          text: "Atualize suas informações de conta e senha.",
          className: "text-gray-500 mt-2 text-sm",
        }}
      >
        <EditProfileFormModal
          usuario={usuarioData}
          isGoogleUser={isGoogleUser}
          isPasswordAlertOpen={isPasswordAlertOpen}
          onPasswordAlertOpenChange={setIsPasswordAlertOpen}
          onSubmit={handleEditProfile}
          closeModal={() => setIsEditDialogOpen(false)}
        />
      </GenericModal>
    </div>
  );
};

export default PerfilUsuarioPage;
