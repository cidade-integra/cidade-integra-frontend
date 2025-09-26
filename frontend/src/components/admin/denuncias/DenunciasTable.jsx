import { useState } from "react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useReportStatus } from "@/hooks/useReportStatus";

const DenunciasTable = ({ denuncias, setDenuncias }) => {
  const { markAsResolved, markAsRejected, markAsInReview, loading } =
    useReportStatus();
  const { toast } = useToast();

  // Estado para controlar o modal de rejeição
  const [modalRejeitar, setModalRejeitar] = useState({
    open: false,
    reportId: null,
  });

  // Estado para controlar o modal de Em Analise
  const [modalEmAnalise, setModalEmAnalise] = useState({
    open: false,
    reportId: null,
  });
  // Estado para controlar o modal de resolver
  const [modalResolver, setModalResolver] = useState({
    open: false,
    reportId: null,
  });

  // função para lidar com a atualização do status
  const handleUpdateStatus = async (id, status) => {
    if (loading) return; // impede múltiplos cliques enquanto o status está sendo atualizado

    try {
      if (status === "resolved") {
        await markAsResolved(id);
      } else if (status === "review") {
        await markAsInReview(id);
      } else if (status === "rejected") {
        await markAsRejected(id);
      }

      setDenuncias((prevDenuncias) =>
        prevDenuncias.map((denuncia) =>
          denuncia.reportId === id ? { ...denuncia, status } : denuncia
        )
      );

      toast({
        title: "Status atualizado",
        description: `Denúncia #${id} marcada como ${status}.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: `Não foi possível atualizar a denúncia #${id}. Tente novamente mais tarde.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/*<TableHead>ID</TableHead> */}
            <TableHead>Título</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
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
                {/* <TableCell className="font-medium">
                  {denuncia.reportId} 
                </TableCell> */}
                <TableCell>
                  <Link
                    to={`/denuncias/${denuncia.reportId}`}
                    className="text-black font-medium hover:underline hover:text-green-600"
                  >
                    {denuncia.title}
                  </Link>
                </TableCell>


                <TableCell>{denuncia.location?.address}</TableCell>
                <TableCell>
                  {new Date(
                    denuncia.createdAt?.seconds * 1000
                  ).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <DenunciaStatusBadge status={denuncia.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    onValueChange={async (value) => {
                      if (value === "view") {
                        window.location.href = `/denuncias/${denuncia.reportId}`;
                      } else if (value === "review") {
                        setModalEmAnalise({
                          open: true,
                          reportId: denuncia.reportId,
                        });
                      } else if (value === "resolved") {
                        setModalResolver({
                          open: true,
                          reportId: denuncia.reportId,
                        });
                      } else if (value === "rejected") {
                        setModalRejeitar({
                          open: true,
                          reportId: denuncia.reportId,
                        });
                      }
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Alterar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="review" className="text-blue-600 hover:text-blue-800">
                        <CheckCircle className="h-4 w-4 mr-1 inline" /> Em Análise
                      </SelectItem>
                      <SelectItem value="resolved" className="text-green-600 hover:text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1 inline" /> Resolver
                      </SelectItem>
                      <SelectItem value="rejected" className="text-red-600 hover:text-red-800">
                        <XCircle className="h-4 w-4 mr-1 inline" /> Rejeitar
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>



      {/* Modal de confirmação - Em Analise*/}
      <Dialog
        open={modalEmAnalise.open}
        onOpenChange={(open) =>
          setModalEmAnalise((v) => ({ ...v, open }))
        }
      >
        <DialogContent>
          <DialogTitle>Analisar denúncia - #{modalEmAnalise.reportId}</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja marcar a denúncia '<i>{
              denuncias.find(d => d.reportId === modalEmAnalise.reportId)?.title
            }</i>' como <b>Em Análise</b>?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalEmAnalise({ open: false, reportId: null })}
            >
              Cancelar
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={async () => {
                await handleUpdateStatus(modalEmAnalise.reportId, "review");
                setModalEmAnalise({ open: false, reportId: null });
              }}
              disabled={loading}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação - Resolver*/}
      <Dialog
        open={modalResolver.open}
        onOpenChange={(open) =>
          setModalResolver((v) => ({ ...v, open }))
        }
      >
        <DialogContent>
          <DialogTitle>Resolver denúncia - #{modalResolver.reportId}</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja marcar a denúncia '<i>{
              denuncias.find(d => d.reportId === modalResolver.reportId)?.title
            }</i>' como <b>Resolvida</b>?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalResolver({ open: false, reportId: null })}
            >
              Cancelar
            </Button>
            <Button
              className="bg-verde hover:bg-verde-escuro"
              onClick={async () => {
                await handleUpdateStatus(modalResolver.reportId, "resolved");
                setModalResolver({ open: false, reportId: null });
              }}
              disabled={loading}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação - Rejeitar*/}
      <Dialog
        open={modalRejeitar.open}
        onOpenChange={(open) =>
          setModalRejeitar((v) => ({ ...v, open }))
        }
      >
        <DialogContent>
          <DialogTitle>Rejeitar denúncia - #{modalRejeitar.reportId}</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja <b>rejeitar</b> a denúncia: <i>{
              denuncias.find(d => d.reportId === modalRejeitar.reportId)?.title
            }</i>?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalRejeitar({ open: false, reportId: null })}
            >
              Cancelar
            </Button>
            <Button
              className="bg-vermelho hover:bg-red-900"
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