import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUpdateUserStatus } from "@/hooks/useUpdateUserStatus";
import { useUpdateUserRole } from "@/hooks/useUpdateUserRole";
import { useAuth } from "@/context/AuthContext";

const UsersTable = ({ users }) => {
  const { toast } = useToast();
  const { updateStatusToActive, updateStatusToBanned, updateStatusToInactive } = useUpdateUserStatus();
  const { updateToAdmin, updateToUser, loading: roleLoading } = useUpdateUserRole();
  const { currentUser } = useAuth();

  const UserStatusBadge = ({ status }) => {
    const statusMap = {
      active: <Badge className="bg-verde">Ativo</Badge>,
      inactive: <Badge variant="outline" className="text-gray-500">Inativo</Badge>,
      banned: <Badge className="bg-vermelho">Bloqueado</Badge>,
    };
    return statusMap[status] || <Badge variant="outline">Desconhecido</Badge>;
  };

  const UserRoleBadge = ({ role }) => {
    const roleMap = {
      admin: <Badge className="bg-azul">Administrador</Badge>,
      user: <Badge variant="outline">Usuário</Badge>,
    };
    return roleMap[role] || <Badge variant="outline">Desconhecido</Badge>;
  };

  const handleStatusChange = async (uid, value) => {
    try {
      if (value === "active") await updateStatusToActive(uid);
      else if (value === "inactive") await updateStatusToInactive(uid);
      else if (value === "banned") await updateStatusToBanned(uid);

      toast({
        title: "Status atualizado",
        description: `O status do usuário foi alterado para "${value}".`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: error.message || "Tente novamente mais tarde.",
      });
    }
  };

  const handleRoleChange = async (uid, value) => {
    try {
      if (value === "admin") await updateToAdmin(uid);
      else if (value === "user") await updateToUser(uid);

      toast({
        title: "Função atualizada",
        description: `A função do usuário foi alterada para "${value}".`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar função",
        description: error.message || "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.uid === currentUser?.uid && "(Você)" || user.displayName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><UserRoleBadge role={user.role} /></TableCell>
                <TableCell><UserStatusBadge status={user.status} /></TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col space-y-2">
                    {user.uid !== currentUser?.uid && (
                      <>
                        <Select
                          value={user.status}
                          onValueChange={(value) => handleStatusChange(user.uid, value)}
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativar</SelectItem>
                            <SelectItem value="inactive">Inativar</SelectItem>
                            <SelectItem value="banned">Bloquear</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.uid, value)}
                          disabled={roleLoading}
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue placeholder="Função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Usuário</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
