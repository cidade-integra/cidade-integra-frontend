import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DenunciaStatusBadge from "@/components/denuncias/DenunciaStatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  MessageSquare,
  User,
  Bookmark,
  BookmarkCheck,
  Images,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useReport } from "@/hooks/useReport";
import { Link, useParams } from "react-router-dom";
import ComentarioCard from "@/components/denuncias/ComentarioCard";
import { useEffect, useState } from "react";
import { useFetchUser } from "@/hooks/useFetchUser";
import MapaEstatico from "@/components/denuncias/MapaEstatico";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";

const DenunciaDetalhes = () => {
  const { id } = useParams();
  const { getReportById, loading: isLoading } = useReport();
  const [denuncia, setDenuncia] = useState(null);
  const { user } = useFetchUser(denuncia?.userId);
  const { currentUser } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchDenuncia = async () => {
      const result = await getReportById(id);
      if (isMounted) setDenuncia(result ?? null);
    };

    if (id) fetchDenuncia();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!currentUser?.uid || !id) return;

    const checkSaved = async () => {
      const docRef = doc(
        db,
        "users",
        currentUser.uid,
        "denunciasSalvas",
        id
      );
      const docSnap = await getDoc(docRef);
      setIsSaved(docSnap.exists());
    };

    checkSaved();
  }, [currentUser?.uid, id]);

  // Substitua handleToggleSave por toggleSave
  const toggleSave = async (e) => {
    e.preventDefault();
    if (!currentUser || !denuncia) return;

    const ref = doc(
      db,
      "users",
      currentUser.uid,
      "denunciasSalvas",
      denuncia.reportId || id
    );

    try {
      if (isSaved) {
        await deleteDoc(ref);
        setIsSaved(false);
        // Se desejar, chame onRemoveSaved se existir
        // if (typeof onRemoveSaved === "function") {
        //   onRemoveSaved(denuncia.reportId || id);
        // }
      } else {
        await setDoc(ref, {
          ...denuncia,
          savedAt: new Date(),
        });
        setIsSaved(true);
        toast({
          title: "Denúncia salva!",
          description: "Confira suas denúncias salvas no seu perfil.",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar denúncia salva:", error);
    }
  };

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

  const {
    title,
    description,
    category,
    createdAt,
    resolvedAt,
    status,
    imagemUrl,
    imagemUrls, // array de imagens
    isAnonymous,
    location,
  } = denuncia || {};

  // junta imagem única e array para compatibilidade
  const allImages = [
    ...(imagemUrls || []),
    ...(imagemUrl ? [imagemUrl] : []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-azul text-white py-8">
          <div className="container mx-auto px-4">
            <Link
              to="/denuncias"
              className="flex items-center text-cinza hover:text-white mb-4 w-fit"
            >
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
              {/* Imagens com suporte a múltiplas imagens */}
              {allImages.length > 0 ? (
                <div className="relative mb-6">
                  {allImages.length === 1 ? (
                    <img
                      src={allImages[0]}
                      alt={title}
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <Carousel className="w-full">
                        <CarouselContent>
                          {allImages.map((img, idx) => (
                            <CarouselItem key={idx}>
                              <img
                                src={img}
                                alt={`${title} - Imagem ${idx + 1}`}
                                className="w-full max-h-96 object-cover rounded-lg"
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </Carousel>
                      <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Images className="h-3 w-3" />
                        <span>{allImages.length}</span>
                      </div>
                    </>
                  )}
                </div>
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
                    <p className="font-medium">{category}</p>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-verde-escuro shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Localização
                      </p>
                      <p className="font-medium">{location?.address || "-"}</p>
                      <div className="mt-4">
                      <MapaEstatico local={location.address} />
                    </div>
                    </div>
                    
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-verde-escuro shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Data de Registro
                      </p>
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
                      <p className="text-sm text-muted-foreground">
                        Reportado por
                      </p>
                      <p className="font-medium">
                        {isAnonymous
                          ? "Anônimo"
                          : user?.displayName || "Usuário não encontrado"}
                      </p>
                    </div>
                  </div>
                  {resolvedAt && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-verde-escuro shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Resolvida em
                          </p>
                          <p className="font-medium">
                            {format(
                              resolvedAt.toDate
                                ? resolvedAt.toDate()
                                : resolvedAt,
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
                  {currentUser && (
                    <Button
                      variant={isSaved ? "default" : "outline"}
                      className={isSaved ? "hover:bg-verde-escuro bg-verde w-full" : "w-full"}
                      onClick={toggleSave}
                      disabled={isLoadingSave}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-2" />
                          Salva
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Salvar denúncia
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DenunciaDetalhes;