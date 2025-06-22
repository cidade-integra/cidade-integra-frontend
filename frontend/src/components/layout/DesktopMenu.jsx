import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Home,
  Bell,
  User,
  LogIn,
  Shield,
  LogOut,
  Plus,
  BookOpen,
} from "lucide-react"

const DesktopMenu = ({ user, onLogout, isLoggingOut }) => {
    const location = useLocation()

  //função para verificar se o link está ativo
  const isActive = (path) => {
    if(path === "/") {
      return location.pathname === "/"
  }
  return location.pathname.startsWith(path)
  }

  //função para adicionar classe ativa e inativa
  const getLinkClasses = (path) => {
    const baseClasses = 
    'transition-colors flex items-center gap-1 px-3 py-2 rounded-md'
    const activeClasses = 'text-verde bg-verde/15 font-semibold'
    const inactiveClasses = 'hover:text-verde hover:bg-verde/5'
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`
  }

  return (
    <>
      <Link
        to="/"
        className={getLinkClasses("/")}
      >
        <Home size={18} />
        <span>Início</span>
      </Link>

      <Link
        to="/denuncias"
        className={getLinkClasses("/denuncias")}
      >
        <Bell size={18} />
        <span>Denúncias</span>
      </Link>

      <Link
        to="/sobre"
        className={getLinkClasses("/sobre")}
      >
        <User size={18} />
        <span>Sobre</span>
      </Link>

      <Link
        to="/duvidas"
        className={getLinkClasses("/duvidas")}
      >
        <BookOpen size={18} />
        <span>Dúvidas</span>
      </Link>

      {!user && (
        <Link
          to="/login"
          className={getLinkClasses("/login")}
        >
          <LogIn size={18} />
          <span>Entrar</span>
        </Link>
      )}

      {user && (
        <>
          <Link
            to="/perfil"
            className={getLinkClasses("/perfil")}
          >
            <User size={18} />
            <span>Perfil</span>
          </Link>
          
          {user.role === "admin" && (
            <Link
              to="/admin"
              className={getLinkClasses("/admin")}
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
  )
}

export default DesktopMenu
