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
  Building2,
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

//função para verificar se a rota está ativa
  const isActiveRoute = (path) => {
    if (path === "/") {
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
        role="menuitem"
        aria-label="Navegar para a página inicial"
        aria-current={isActiveRoute("/") ? "page" : undefined}
        tabIndex={0}
      >
        <Home size={18} aria-hidden="true" />
        <span>Início</span>
      </Link>

      <Link
        to="/denuncias"
        className={getLinkClasses("/denuncias")}
        role="menuitem"
        aria-label="Navegar para a página de denúncias"
        aria-current={isActiveRoute("/denuncias") ? "page" : undefined}
        tabIndex={0}

      >
        <Bell size={18} aria-hidden="true" />
        <span>Denúncias</span>
      </Link>

      <Link
        to="/sobre"
        className={getLinkClasses("/sobre")}
        role="menuitem"
        aria-label="Navegar para a página sobre o projeto"
        aria-current={isActiveRoute("/sobre") ? "page" : undefined}
        tabIndex={0}

      >
        <Building2 size={18} aria-hidden="true" />
        <span>Sobre</span>
      </Link>

      <Link
        to="/duvidas"
        className={getLinkClasses("/duvidas")}
        role="menuitem"
        aria-label="Navegar para a página de dúvidas frequentes"
        aria-current={isActiveRoute("/duvidas") ? "page" : undefined}
        tabIndex={0}
      >
        <BookOpen size={18} aria-hidden="true" />
        <span>Dúvidas</span>
      </Link>

      {!user && (
        <Link
          to="/login"
          className={getLinkClasses("/login")}
          role="menuitem"
          aria-label="Navegar para a página de login"
          aria-current={isActiveRoute("/login") ? "page" : undefined}
          tabIndex={0}
        >
          <LogIn size={18} aria-hidden="true" />
          <span>Entrar</span>
        </Link>
      )}

      {user && (
        <>
          <Link
            to="/perfil"
            className={getLinkClasses("/perfil")}
            role="menuitem"
            aria-label="Navegar para o perfil do usuário"
            aria-current={isActiveRoute("/perfil") ? "page" : undefined}
            tabIndex={0}
          >
            <User size={18} aria-hidden="true" />
            <span>Perfil</span>
          </Link>
          
          {user.role === "admin" && (
            <Link
              to="/admin"
              className={getLinkClasses("/admin")}
              role="menuitem"
              aria-label="Navegar para o painel administrativo"
              aria-current={isActiveRoute("/admin") ? "page" : undefined}
              tabIndex={0}
            >
              <Shield size={18} aria-hidden="true" />
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