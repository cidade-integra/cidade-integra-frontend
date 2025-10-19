import { Link, useLocation } from "react-router-dom";
import logotipo from "/logotipo-sem-borda.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  return (
    <footer className="bg-azul text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-verde">Navegue</h3>
            <ul className="space-y-2">
              <li>
                {" "}
                <Link
                  to="/"
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="text-cinza hover:text-verde transition-colors"
                >
                  Início
                </Link>
              </li>

              <li>
                <Link
                  to="/denuncias"
                  className="text-cinza hover:text-verde transition-colors"
                >
                  Denúncias
                </Link>
              </li>

              <li>
                <Link
                  to="/nova-denuncia"
                  className="text-cinza hover:text-verde transition-colors"
                >
                  Reportar Problema
                </Link>
              </li>

              <li>
                <Link
                  to="/sobre"
                  className="text-cinza hover:text-verde transition-colors"
                >
                  Sobre nós
                </Link>
              </li>

              <li>
                <Link
                  to="/duvidas"
                  className="text-cinza hover:text-verde transition-colors"
                >
                  <span>Dúvidas</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-4 ">
              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <img className="h-16" src={logotipo} alt="logotipo" />
              </Link>
            </div>
            <p className="text-cinza mb-4">
              Uma plataforma para cidadãos reportarem problemas urbanos e
              contribuírem para uma cidade melhor.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              <a
                href="mailto:suporte@cidadeintegra.com"
                className="text-verde hover:text-verde-escuro transition-colors"
                aria-label="Enviar email para suporte@cidadeintegra.com"
              >
                Contato
              </a>
            </h3>
            <p className="text-cinza">
              Para suporte ou informações adicionais:
              <br />
              suporte@cidadeintegra.com
            </p>
          </div>
        </div>

        <div className="border-t border-cinza/30 mt-8 pt-6 text-center text-cinza">
          <p>
            &copy; {currentYear} Cidade Integra. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
