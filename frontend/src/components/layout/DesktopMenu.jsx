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
  HelpCircle,
} from "lucide-react";

const DesktopMenu = ({ user, onLogout, isLoggingOut }) => {
  return (
    <>
      <Link
        to="/"
        className="hover:text-verde transition-colors flex items-center gap-1"
      >
        <Home size={18} />
        <span>Início</span>
      </Link>

      <Link
        to="/denuncias"
        className="hover:text-verde transition-colors flex items-center gap-1"
      >
        <Bell size={18} />
        <span>Denúncias</span>
      </Link>

      <Link
        to="/sobre"
        className="hover:text-verde transition-colors flex items-center gap-1"
      >
        <User size={18} />
        <span>Sobre</span>
      </Link>

      <Link
        to="/duvidas"
        className="hover:text-verde transition-colors flex items-center gap-1"
      >
        <BookOpen size={18} />
        <span>Dúvidas</span>
      </Link>

      {/* Novo link para Dúvidas Frequentes (FAQ) */}
      <Link
        to="/duvidas-frequentes"
        className="hover:text-verde transition-colors flex items-center gap-1"
      >
        <HelpCircle size={18} />
        <span>FAQ</span>
      </Link>

      {!user && (
        <Link
          to="/login"
          className="hover:text-verde transition-colors flex items-center gap-1"
        >
          <LogIn size={18} />
          <span>Entrar</span>
        </Link>
      )}

      {user && (
        <>
          <Link
            to="/perfil"
            className="hover:text-verde transition-colors flex items-center gap-1"
          >
            <User size={18} />
            <span>Perfil</span>
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin"
              className="hover:text-verde transition-colors flex items-center gap-1"
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

export default DesktopMenu;
