import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Dialog } from "@/components/ui/dialog";
import PerfilHeader from "@/components/perfil/PerfilHeader";
import PerfilUsuarioCard from "@/components/perfil/PerfilUsuarioCard";
import EstatisticasCard from "@/components/perfil/EstatisticasCard";
import MinhasDenuncias from "@/components/perfil/MinhasDenuncias";
import EditarPerfilForm from "@/components/perfil/EditarPerfilForm";
import useUserProfile from "@/hooks/useUserProfile";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { ConfirmDeactivateDialog } from "@/components/perfil/ConfirmDeactivateDialog";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";


const PerfilUsuarioPage = () => {

  const [showScrollTop, setShowScrollTop] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        setShowScrollTop(window.scrollY > 300);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

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

      {/* diálogo de edição de perfil */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <EditarPerfilForm
          usuario={usuarioData}
          isOpen={isEditDialogOpen}
          isPasswordAlertOpen={isPasswordAlertOpen}
          onOpenChange={setIsEditDialogOpen}
          onPasswordAlertOpenChange={setIsPasswordAlertOpen}
          onSubmit={handleEditProfile}
          isGoogleUser={isGoogleUser}
        />
      </Dialog>

      {/* botão de rolar para cima */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8}}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className="bg-verde hover:bg-verde-escuro shadow-lg rounded-full h-12 w-12"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>



    </div>

    
  );
};

export default PerfilUsuarioPage;
