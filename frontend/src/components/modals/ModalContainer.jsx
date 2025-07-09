import useModalStore from "@/hooks/useModalStore";
import GenericModal from "@/components/modals/GenericModal";
import { MapPin } from "lucide-react";

import LoginModal from "@/components/authentication/LoginModal";
import RecoverPasswordModal from "@/components/authentication/RecoverPasswordModal";
import EditProfileFormModal from "../perfil/EditProfileFormModal";

import useUserProfile from "@/hooks/useUserProfile";

export default function ModalContainer() {
  const { isOpen, modalType, closeModal, modalProps, modalOptions } = useModalStore();

  const {
    handleEditProfile,
    isGoogleUser,
    isPasswordAlertOpen,
    setIsPasswordAlertOpen,
  } = useUserProfile();

  let content = null;
  let modalTitle = null;
  let modalDescription = null;
  let modalIcon = null;

  switch (modalType) {
    case "login":
      modalIcon = <MapPin className="h-6 w-6 text-white" />
      modalTitle = "Bem-vindo ao Cidade Integra";
      modalDescription = "Faça login ou crie uma conta para reportar problemas urbanos.";
      content = <LoginModal {...modalProps} />;
      break;
    case "recuperar-senha":
      modalTitle = "Recuperar Senha";
      modalDescription = "Digite seu e-mail para receber o link de redefinição de senha.";
      content = <RecoverPasswordModal {...modalProps} />;
      break;
    case "editar-perfil":
      modalTitle = "Editar Perfil";
      modalDescription = "Atualize suas informações de conta e senha.";
      content =
        (
          <EditProfileFormModal
            {...modalProps}
            onSubmit={handleEditProfile} // ✅ injeta corretamente
            isGoogleUser={isGoogleUser} // ✅ garante presença consistente
            isPasswordAlertOpen={isPasswordAlertOpen} // ✅ garante controle do alert
            onPasswordAlertOpenChange={setIsPasswordAlertOpen}
            closeModal={closeModal}
          />
        );
      break;
    default:
      return null;
  }

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={closeModal}
      overlayColor={modalOptions?.overlayColor}
      title={{
        icon: modalIcon,
        text: modalTitle,
        className: "text-2xl font-bold text-azul",
      }}
      description={{
        text: modalDescription,
        className: "text-gray-500 mt-2 text-sm",
      }}
    >
      {content}
    </GenericModal>
  );
}
