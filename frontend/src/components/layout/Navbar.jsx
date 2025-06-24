import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "/logotipo-sem-borda.svg";
import useAuthentication from "@/hooks/UseAuthentication";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useFetchUser } from "@/hooks/useFetchUser";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuthentication();

  const { currentUser } = useAuth();
  const { user } = useFetchUser(currentUser?.uid);

  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();

      toast({
        title: "👋 Você saiu da conta.",
        description: "Esperamos vê-lo em breve!",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Erro ao sair:", error);

      toast({
        title: "🚨 Erro ao sair",
        description: "Ocorreu um problema ao encerrar sua sessão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // função para lidar com navegação por teclado
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  // evita rolagem do fundo com menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // adiciona evento de teclado para tecla escape
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <nav className="bg-azul text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img className="h-14" src={Logo} alt="Logo" />
        </Link>

        {/* Menu Responsivo */}
        {isMobile ? (
          <>
            {/* Botão menu mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none z-50"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Menu mobile animado */}
            <div
              id="mobile-menu"
              className={`fixed top-20 left-0 w-full bg-azul z-40 transition-all duration-300 ease-in-out ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-full pointer-events-none"
              }`}
            >
              <div className="flex flex-col px-6 py-4 space-y-2">
                {/* space-y-2 diminui o espaço entre os itens */}
                <MobileMenu
                  onClickItem={() => setIsOpen(false)}
                  user={user}
                  onLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            {/* space-x-2 diminui o espaço entre os itens do menu desktop */}
            <DesktopMenu
              user={user}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
