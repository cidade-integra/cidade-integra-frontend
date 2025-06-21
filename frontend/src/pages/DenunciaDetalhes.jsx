import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DenunciaStatusBadge from "@/components/denuncias/DenunciaStatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Calendar, ArrowLeft, MessageSquare, User, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useReport } from "@/hooks/useReport";
import { Link, useParams, useNavigate } from "react-router-dom";
import ComentarioCard from "@/components/denuncias/ComentarioCard";
import { useEffect, useState } from "react";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";

const DenunciaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getReportById, deleteReport, loading: isLoading } = useReport();
  const [denuncia, setDenuncia] = useState(null);
  const { user } = useFetchUser(denuncia?.userId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { currentUser, currentUserData, loading: loadingUserData } = useCurrentUser();
  const uid = currentUser?.uid;

  useEffect(() => {
    let isMounted = true;
    const fetchDenuncia = async () => {
      const result = await getReportById(id);
      if (isMounted) setDenuncia(result ?? null);
    };
    if (id) fetchDenuncia();
    return () => { isMounted = false; };
    // Remova getReportById das dependências
  }, [id]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteReport(id);
      toast({
        title: "Denúncia excluída com sucesso!",
        description: "A denúncia foi removida do sistema.",
        variant: "default",
      });
      setTimeout(() => {
        navigate("/denuncias")
      }, 1000);
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "❌ Erro ao excluir denúncia",
        description: "Ocorreu um erro ao tentar excluir a denúncia. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  }


  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-verde"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!denuncia) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-10">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Denúncia não encontrada</h2>
            <p className="text-muted-foreground mb-6">
              A denúncia que você está procurando não existe ou foi removida.
            </p>
            <Button asChild>
              <Link to="/denuncias" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar para Denúncias</span>
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Extrai os dados conforme o novo modelo
  const {
    title,
    description,
    category,
    createdAt,
    updatedAt,
    resolvedAt,
    status,
    imagemUrl,
    isAnonymous,
    userId,
    location,
  } = denuncia;

  const mainImage = imagemUrl || null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-azul text-white py-8">
          <div className="container mx-auto px-4">
            <Link to="/denuncias" className="flex items-center text-cinza hover:text-white mb-4 w-fit">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Voltar para Denúncias</span>
            </Link>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              <DenunciaStatusBadge status={status} className="text-sm" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={denuncia.title || "Imagem da denúncia"}
                  className="w-full max-h-96 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/images/default-image.jpg"; // Substitua pelo caminho da imagem padrão
                    e.target.alt = "Imagem não disponível";
                  }}
                />
              ) : (
                <span className="text-gray-500 text-sm">Sem imagem</span>
              )}

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Descrição</h2>
                <p className="text-muted-foreground">{description}</p>
              </div>

              <ComentarioCard />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Informações</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p className="font-medium">
                      {category
                        ? category.charAt(0).toUpperCase() + category.slice(1)
                        : "-"}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-verde-escuro shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Localização</p>
                      <p className="font-medium">
                        {location?.address || "-"}
                      </p>
                      {location?.postalCode && (
                        <span className="text-xs text-muted-foreground block font-medi mt-1">
                          CEP: {location.postalCode}
                        </span>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-verde-escuro shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Registro</p>
                      <p className="font-medium">
                        {createdAt
                          ? format(
                            createdAt.toDate ? createdAt.toDate() : createdAt,
                            "PPP",
                            { locale: ptBR }
                          )
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-verde-escuro shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Reportado por</p>
                      <p className="font-medium">
                        {isAnonymous ? "Anônimo" : user?.displayName || "Usuário não encontrado"}
                      </p>
                    </div>
                  </div>
                  {resolvedAt && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-verde-escuro shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Resolvida em</p>
                          <p className="font-medium">
                            {format(
                              resolvedAt.toDate ? resolvedAt.toDate() : resolvedAt,
                              "PPP",
                              { locale: ptBR }
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Ações</h2>
                <div className="space-y-4">
                  <Button className="w-full bg-verde hover:bg-verde-escuro">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>Adicionar Comentário</span>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Compartilhar
                  </Button>

                  {uid &&
                  denuncia && !denuncia.isAnonymous &&
                  (uid === denuncia.userId  || currentUserData?.role === "admin") &&
                   (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Excluir Denúncia</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal de confirmação de exclusão */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir Denúncia?"
        //description="Você tem certeza que deseja excluir esta denúncia?"
        itemName="denúncia"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DenunciaDetalhes;
