import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import UsersAdminHeader from "@/components/admin/usuarios/UsersAdminHeader";
import UsersSearch from "@/components/admin/usuarios/UsersSearch";
import UsersStats from "@/components/admin/usuarios/UsersStats";
import UsersTable from "@/components/admin/usuarios/UsersTable";

import {useAllUsers} from "@/hooks/useAllUsers";

const UsersAdminPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("todos");
  const { toast } = useToast();
  const { users, loading, error } = useAllUsers();


  const atualizarStatus = async (id, novoStatus) => {
    try {
      await updateStatus(id, novoStatus);
      toast({
        title: "Status atualizado",
        description: `Usuário #${id} teve seu status alterado para ${novoStatus}.`,
        variant: "default",
      });
    } catch {
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const atualizarFuncao = async (id, novaFuncao) => {
    try {
      await updateRole(id, novaFuncao);
      toast({
        title: "Função atualizada",
        description: `Usuário #${id} teve sua função alterada para ${novaFuncao}.`,
        variant: "default",
      });
    } catch {
      toast({
        title: "Erro ao atualizar função",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "todos" || user.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <UsersAdminHeader />

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <p>Carregando usuários...</p>
          ) : error ? (
            <p className="text-red-500">Erro ao carregar usuários.</p>
          ) : (
            <>
              <UsersStats users={users} />

              <UsersSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={filter}
                setFilter={setFilter}
              />

              <UsersTable
                users={filteredUsers}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UsersAdminPage;
