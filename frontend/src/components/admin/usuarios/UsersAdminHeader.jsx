import { UserCog } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UsersAdminHeader = () => {
  return (
    <div className="bg-azul text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 mb-4">
          <Link
            to="/admin"
            className="flex items-center text-cinza hover:text-white mb-4 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Administração</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <UserCog className="h-6 w-6 text-verde" />
          <h1 className="text-3xl font-bold">Administração de Usuários</h1>
        </div>
        <p className="text-lg text-cinza mt-2">
          Gerencie usuários, seus papéis e permissões na plataforma.
        </p>
      </div>
    </div>
  );
};

export default UsersAdminHeader;
