import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "/logotipo-sem-borda.svg";
import useAuthentication from "@/hooks/UseAuthentication";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
      }, 1000)
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

  //função para lidar com navegação por teclado
  const handleKeyDown = (event) => {
    if (event.key === "Escape" && isOpen) {
      setIsOpen(false);
    }
  };

  // evita rolagem do fundo com menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  //adiciona evento de teclado para tecla escape
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Menu mobile animado */}
            <div
              className={`fixed top-20 left-0 w-full bg-azul z-40 transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                }`}
            >
              <div className="flex flex-col px-6 py-4 space-y-4">
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
          <div className="hidden md:flex items-center space-x-4">
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
