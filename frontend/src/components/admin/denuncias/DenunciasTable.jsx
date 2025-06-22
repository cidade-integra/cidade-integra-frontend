import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DenunciaStatusBadge from "@/components/denuncias/DenunciaStatusBadge";
import { useReport } from "@/hooks/useReport";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const DenunciasTable = ({ denuncias, setDenuncias }) => {
  const { markAsResolved, markAsRejected, markAsInReview, loading } =
    useReport();
  const { toast } = useToast();

  // Estado para controlar o modal
  const [modalRejeitar, setModalRejeitar] = useState({
    open: false,
    reportId: null,
  });

  // função para lidar com a atualização do status
  const handleUpdateStatus = async (id, status) => {
    if (loading) return; // impede múltiplos cliques enquanto o status está sendo atualizado

    try {
      // Atualiza o status no banco de dados
      if (status === "resolved") {
        await markAsResolved(id);
      } else if (status === "review") {
        await markAsInReview(id);
      } else if (status === "rejected") {
        await markAsRejected(id);
      }

      // Atualiza o estado local para refletir a mudança imediatamente
      setDenuncias((prevDenuncias) =>
        prevDenuncias.map((denuncia) =>
          denuncia.reportId === id ? { ...denuncia, status } : denuncia
        )
      );

      // Exibe mensagem de sucesso
      toast({
        title: "Status atualizado",
        description: `Denúncia #${id} marcada como ${status}.`,
        variant: "default",
      });
    } catch (error) {
      // Exibe mensagem de erro se algo der errado
      toast({
        title: "Erro",
        description: `Não foi possível atualizar a denúncia #${id}. Tente novamente mais tarde.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {denuncias.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  Nenhuma denúncia encontrada.
                </TableCell>
              </TableRow>
            ) : (
              denuncias.map((denuncia) => (
                <TableRow key={denuncia.reportId}>
                  {" "}
                  {/* Alterado para 'reportId' */}
                  <TableCell className="font-medium">
                    {denuncia.reportId}
                  </TableCell>
                  <TableCell>{denuncia.title}</TableCell>
                  <TableCell>{denuncia.location?.address}</TableCell>
                  <TableCell>
                    {new Date(
                      denuncia.createdAt?.seconds * 1000
                    ).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <DenunciaStatusBadge status={denuncia.status} />
                  </TableCell>
                  <TableCell className="text-right flex flex-col space-y-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/denuncias/${denuncia.reportId}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:bg-blue-500/10 hover:text-blue-500"
                      onClick={() =>
                        handleUpdateStatus(denuncia.reportId, "review")
                      }
                      disabled={loading} // desabilita o botão enquanto o status está sendo atualizado
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      Em Análise
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-verde hover:text-verde hover:bg-verde/10"
                      onClick={() =>
                        handleUpdateStatus(denuncia.reportId, "resolved")
                      }
                      disabled={loading} // desabilita o botão enquanto o status está sendo atualizado
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Resolver
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-vermelho hover:text-vermelho hover:bg-vermelho/10"
                      onClick={() =>
                        setModalRejeitar({
                          open: true,
                          reportId: denuncia.reportId,
                        })
                      }
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      Rejeitar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de confirmação */}
      <Dialog
        open={modalRejeitar.open}
        onOpenChange={(open) => setModalRejeitar((v) => ({ ...v, open }))}
      >
        <DialogContent>
          <DialogTitle>Confirmar rejeição</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja marcar esta denúncia como <b>rejeitada</b>?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalRejeitar({ open: false, reportId: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await handleUpdateStatus(modalRejeitar.reportId, "rejected");
                setModalRejeitar({ open: false, reportId: null });
              }}
              disabled={loading}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DenunciasTable;