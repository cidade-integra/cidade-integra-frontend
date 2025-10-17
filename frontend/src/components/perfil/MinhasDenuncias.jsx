import { useEffect, useState } from "react";
import { FileText, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CardDenuncia from "@/components/denuncias/CardDenuncia";
import { useUserReports } from "@/hooks/useUserReports";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MinhasDenuncias = () => {
  const { currentUser: user, loading: authLoading } = useAuth();
  const {
    reports: denuncias,
    loading,
    error,
  } = useUserReports(user?.uid || null);
  const [savedReports, setSavedReports] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const [filter, setFilter] = useState("todas");

  const filteredDenuncias = denuncias.filter((denuncias) => {
    //Filtrando as Minhas Denuncias po Categoria
    const matchesFilter = filter === "todas" || denuncias.status === filter;

    return matchesFilter;
  });

  // Função para remover denúncia salva da interface
  const handleRemoveSavedReport = (reportId) => {
    setSavedReports((prev) => prev.filter((r) => r.reportId !== reportId));
  };

  useEffect(() => {
    const fetchSavedReports = async () => {
      if (!user) {
        setSavedReports([]);
        setLoadingSaved(false);
        return;
      }

      try {
        const colRef = collection(db, "users", user.uid, "denunciasSalvas");
        const snap = await getDocs(colRef);
        const saved = snap.docs.map((doc) => ({
          reportId: doc.id,
          ...doc.data(),
        }));
        setSavedReports(saved);
      } catch (error) {
        console.error("Erro ao buscar denúncias salvas:", error);
        setSavedReports([]);
      } finally {
        setLoadingSaved(false);
      }
    };

    fetchSavedReports();
  }, [user]);

  if (authLoading) return <p>Carregando autenticação...</p>;

  if (!user) return <p>Você precisa estar logado para ver suas denúncias.</p>;

  return (
    <>
      {/* DENÚNCIAS CRIADAS */}
      {denuncias.length === 0 && !loading ? (
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Minhas Denúncias
        </h2>
      ) : (
        <div className="mb-6 flex flex-row items-center gap-4 justify-between">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Minhas Denúncias
          </h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="review">Em Ánalise</SelectItem>
              <SelectItem value="resolved">Resolvidas</SelectItem>
              <SelectItem value="rejected">Rejeitadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {loading && <p>Carregando denúncias...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {denuncias.length === 0 && !loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10 text-muted-foreground">
              <p>Você ainda não fez nenhuma denúncia.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        filteredDenuncias.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>Nenhuma denúncia encontrada para este filtro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDenuncias.map((denuncia) => (
              <CardDenuncia key={denuncia.reportId} denuncia={denuncia} />
            ))}
          </div>
        ))}

      {/* DENÚNCIAS SALVAS */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 flex items-center gap-2">
        <Bookmark className="h-5 w-5" />
        Denúncias Salvas
      </h2>

      {loadingSaved && <p>Carregando denúncias salvas...</p>}

      {!loadingSaved && savedReports.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10 text-muted-foreground">
              <p>Você ainda não salvou nenhuma denúncia.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loadingSaved && savedReports.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savedReports.map((denuncia) => (
            <CardDenuncia
              key={denuncia.reportId}
              denuncia={denuncia}
              onRemoveSaved={handleRemoveSavedReport}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default MinhasDenuncias;
