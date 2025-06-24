import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useState, useEffect } from "react";
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

const DenunciaCard = ({ denuncia, onRemoveSaved }) => {
  const { currentUser } = useAuth();
  const { user } = useFetchUser(denuncia.userId);

  const [isSaved, setIsSaved] = useState(false);
  const [checking, setChecking] = useState(true);

  // Suporte a múltiplas imagens
  const images =
    Array.isArray(denuncia.imagemUrls) && denuncia.imagemUrls.length > 0
      ? denuncia.imagemUrls
      : denuncia.imagemUrl
      ? [denuncia.imagemUrl]
      : [];

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!currentUser) {
        setIsSaved(false);
        setChecking(false);
        return;
      }
      try {
        const ref = doc(
          db,
          "users",
          currentUser.uid,
          "denunciasSalvas",
          denuncia.reportId
        );
        const snap = await getDoc(ref);
        setIsSaved(snap.exists());
      } catch (error) {
        console.error("Erro ao verificar denúncia salva:", error);
        setIsSaved(false);
      } finally {
        setChecking(false);
      }
    };

    checkIfSaved();
  }, [currentUser, denuncia.reportId]);

  const toggleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const ref = doc(
      db,
      "users",
      currentUser.uid,
      "denunciasSalvas",
      denuncia.reportId
    );

    try {
      if (isSaved) {
        await deleteDoc(ref);
        setIsSaved(false);
        if (typeof onRemoveSaved === "function") {
          onRemoveSaved(denuncia.reportId);
        }
      } else {
        await setDoc(ref, {
          ...denuncia,
          savedAt: new Date(),
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar denúncia salva:", error);
    }
  };

  const parseDate = (data) => {
    if (!data) return null;
    if (typeof data.toDate === "function") return data.toDate();
    const parsed = new Date(data);
    return isNaN(parsed) ? null : parsed;
  };

  const date = parseDate(denuncia.createdAt);

  const relativeTime = date
    ? formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
    : "Data inválida";

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "review":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "review":
        return "Em Análise";
      case "resolved":
        return "Resolvido";
      case "rejected":
        return "Rejeitado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/denuncias/${denuncia.reportId}`}>
        <div className="relative">
          <div className="h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
            {images.length > 1 ? (
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {images.map((imgUrl, idx) => (
                    <CarouselItem key={idx}>
                      <img
                        src={imgUrl}
                        alt={denuncia.title}
                        className="w-full h-48 object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : images.length === 1 ? (
              <img
                src={images[0]}
                alt={denuncia.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm">Sem imagem</span>
            )}
          </div>

          {currentUser && !checking && (
            <button
              onClick={toggleSave}
              className="absolute top-2 right-2 bg-white/90 dark:bg-black/50 p-1 rounded-full shadow hover:scale-105 transition-transform"
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-verde" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-500" />
              )}
            </button>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg line-clamp-1">
              {denuncia.title}
            </h3>
            <Badge className={`${getStatusColor(denuncia.status)} text-white`}>
              {getStatusText(denuncia.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {denuncia.description}
          </p>
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">
              {denuncia.location?.address || "Local não informado"}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{relativeTime}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-1 text-sm text-muted-foreground border-t">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>
              {denuncia.isAnonymous
                ? "Anônimo"
                : user?.displayName || "Não encontrado"}
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default DenunciaCard;