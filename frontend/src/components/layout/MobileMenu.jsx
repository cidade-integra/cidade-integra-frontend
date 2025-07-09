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

const MobileMenu = ({ user, onClickItem, onLogout, isLoggingOut, onLogin }) => {
  
  const location = useLocation()

  // Função para verificar se a rota está ativa
  const isActiveRoute = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  // Classes para link ativo e inativo com foco acessível
  const getLinkClasses = (path) => {
    const baseClasses = "transition-colors py-3 px-4 flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2 focus:ring-offset-azul"
    const activeClasses = "text-verde bg-verde/10 font-semibold border-l-4 border-verde"
    const inactiveClasses = "hover:text-verde hover:bg-verde/5"
    
    return `${baseClasses} ${isActiveRoute(path) ? activeClasses : inactiveClasses}`
  }

  return (
    <>
      <Link
        to="/"
        onClick={onClickItem}
        className={getLinkClasses("/")}
        role="menuitem"
        aria-label="Navegar para página inicial"
        aria-current={isActiveRoute("/") ? "page" : undefined}
        tabIndex={0}
      >
        <Home size={18} aria-hidden="true" />
        <span>Início</span>
      </Link>

      <Link
        to="/denuncias"
        onClick={onClickItem}
        className={getLinkClasses("/denuncias")}
        role="menuitem"
        aria-label="Navegar para página de denúncias"
        aria-current={isActiveRoute("/denuncias") ? "page" : undefined}
        tabIndex={0}
      >
        <Bell size={18} aria-hidden="true" />
        <span>Denúncias</span>
      </Link>

      <Link
        to="/sobre"
        onClick={onClickItem}
        className={getLinkClasses("/sobre")}
        role="menuitem"
        aria-label="Navegar para página sobre o projeto"
        aria-current={isActiveRoute("/sobre") ? "page" : undefined}
        tabIndex={0}
      >
        <User size={18} aria-hidden="true" />
        <span>Sobre</span>
      </Link>

      <Link
        to="/duvidas"
        onClick={onClickItem}
        className={getLinkClasses("/duvidas")}
        role="menuitem"
        aria-label="Navegar para página de dúvidas frequentes"
        aria-current={isActiveRoute("/duvidas") ? "page" : undefined}
        tabIndex={0}
      >
        <BookOpen size={18} aria-hidden="true" />
        <span>Dúvidas</span>
      </Link>

      {!user && (
        <button
          onClick={() => {
            onClickItem?.();
            onLogin();
          }}
          className={getLinkClasses("/login")}
          role="menuitem"
          aria-label="Navegar para página de login"
          aria-current={isActiveRoute("/login") ? "page" : undefined}
          tabIndex={0}
        >
          <LogIn size={18} aria-hidden="true" />
          <span>Entrar</span>
      </button>

      )}

      {user && (
        <>
          <Link
            to="/perfil"
            onClick={onClickItem}
            className={getLinkClasses("/perfil")}
            role="menuitem"
            aria-label="Navegar para página de perfil do usuário"
            aria-current={isActiveRoute("/perfil") ? "page" : undefined}
            tabIndex={0}
          >
            <User size={18} aria-hidden="true" />
            <span>Perfil</span>
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin"
              onClick={onClickItem}
              className={getLinkClasses("/admin")}
              role="menuitem"
              aria-label="Navegar para painel administrativo"
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
        className={`bg-verde hover:bg-verde-escuro text-azul font-semibold duration-500 my-2 focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2 focus:ring-offset-azul ${
          isActiveRoute("/nova-denuncia") ? "ring-2 ring-verde ring-offset-2 ring-offset-azul" : ""
        }`}
      >
        <Link 
          to="/nova-denuncia" 
          onClick={onClickItem} 
          className="flex items-center gap-1"
          role="menuitem"
          aria-label="Criar nova denúncia"
          aria-current={isActiveRoute("/nova-denuncia") ? "page" : undefined}
          tabIndex={0}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Nova Denúncia</span>
        </Link>
      </Button>

      {user && (
        <Button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="hover:text-white text-white flex items-center gap-1 mt-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-azul"
          variant="destructive"
          role="menuitem"
          aria-label={isLoggingOut ? "Saindo da conta..." : "Sair da conta"}
          tabIndex={0}
        >
          <LogOut size={18} aria-hidden="true" />
          <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
        </Button>
      )}
    </>
  )
}

export default MobileMenu