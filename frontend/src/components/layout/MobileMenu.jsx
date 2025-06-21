import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Bell,
  User,
  LogIn,
  Shield,
  LogOut,
  Plus,
  BookOpen,
  HelpCircle, // novo ícone
} from "lucide-react";

const MobileMenu = ({ user, onClickItem, onLogout, isLoggingOut }) => {
  return (
    <>
      <Link
        to="/"
        onClick={onClickItem}
        className="hover:text-verde transition-colors py-2 flex items-center gap-2"
      >
        <Home size={18} />
        <span>Início</span>
      </Link>

      <Link
        to="/denuncias"
        onClick={onClickItem}
        className="hover:text-verde transition-colors py-2 flex items-center gap-2"
      >
        <Bell size={18} />
        <span>Denúncias</span>
      </Link>

      <Link
        to="/sobre"
        onClick={onClickItem}
        className="hover:text-verde transition-colors py-2 flex items-center gap-2"
      >
        <User size={18} />
        <span>Sobre</span>
      </Link>

      <Link
        to="/duvidas"
        onClick={onClickItem}
        className="hover:text-verde transition-colors py-2 flex items-center gap-2"
      >
        <BookOpen size={18} />
        <span>Dúvidas</span>
      </Link>

      {/* Novo link para Dúvidas Frequentes (FAQ) */}
      <Link
        to="/duvidas-frequentes"
        onClick={onClickItem}
        className="hover:text-verde transition-colors py-2 flex items-center gap-2"
      >
        <HelpCircle size={18} />
        <span>FAQ</span>
      </Link>

      {!user && (
        <Link
          to="/login"
          onClick={onClickItem}
          className="hover:text-verde transition-colors py-2 flex items-center gap-2"
        >
          <LogIn size={18} />
          <span>Entrar</span>
        </Link>
      )}

      {user && (
        <>
          <Link
            to="/perfil"
            onClick={onClickItem}
            className="hover:text-verde transition-colors py-2 flex items-center gap-2"
          >
            <User size={18} />
            <span>Perfil</span>
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin"
              onClick={onClickItem}
              className="hover:text-verde transition-colors py-2 flex items-center gap-2"
            >
              <Shield size={18} />
              <span>Admin</span>
            </Link>
          )}
        </>
      )}

      <Button
        asChild
        className="bg-verde hover:bg-verde-escuro text-azul font-semibold duration-500"
      >
        <Link to="/nova-denuncia" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Nova Denúncia</span>
        </Link>
      </Button>

      {user && (
        <Button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="hover:text-white text-white flex items-center gap-1"
          variant="destructive"
        >
          <LogOut size={18} />
          <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
        </Button>
      )}
    </>
  );
};

export default MobileMenu;
