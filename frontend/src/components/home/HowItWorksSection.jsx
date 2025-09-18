import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-azul mb-4">Como Funciona?</h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Reportar problemas urbanos nunca foi tão fácil. Com apenas alguns
            passos, você pode contribuir para{" "}
            <span className="text-azul font-bold">melhorar sua cidade!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 m-6">
          <div
            className="flex flex-col items-center text-center cursor-pointer transition-transform duration-300
              hover:scale-105 hover:shadow-lg hover:bg-verde/5
              rounded-2xl p-6
"
          >
            <Link
              to="/nova-denuncia"
              aria-label="Ir para a página de Nova Denúncia"
            >
              <Badge className="bg-verde text-white mb-4 text-lg h-10 w-10 rounded-full flex items-center justify-center">
                1
              </Badge>
            </Link>

            <Link to="/nova-denuncia">
              <h3 className="text-xl font-semibold mb-3 hover:text-verde-escuro hover:underline">
                Registre o Problema
              </h3>
            </Link>

            <p className="text-muted-foreground">
              Utilize nosso aplicativo para registrar o problema. Adicione
              fotos, descrição e localização precisa.
            </p>
          </div>

          <div
            className="flex flex-col items-center text-center cursor-pointer transition-transform duration-300
              hover:scale-105 hover:shadow-lg hover:bg-verde/5
              rounded-2xl p-6"
          >
            <Link to="/perfil" aria-label="Ir para a página de Perfil">
              <Badge className="bg-verde text-white mb-4 text-lg h-10 w-10 rounded-full flex items-center justify-center">
                2
              </Badge>
            </Link>

            <Link to="/perfil">
              <h3 className="text-xl font-semibold mb-3 hover:text-verde-escuro hover:underline">
                Acompanhe o Status
              </h3>
            </Link>

            <p className="text-muted-foreground">
              Nossa equipe analisa e encaminha a denúncia para o órgão
              responsável. Você pode acompanhar todo o processo.
            </p>
          </div>

          <div
            className="flex flex-col items-center text-center cursor-pointer transition-transform duration-300
              hover:scale-105 hover:shadow-lg hover:bg-verde/5
              rounded-2xl p-6"
          >
            <Link to="/denuncias" aria-label="Ir para a página de Denúncias">
              <Badge className="bg-verde text-white mb-4 text-lg h-10 w-10 rounded-full flex items-center justify-center">
                3
              </Badge>
            </Link>

            <Link to="/denuncias">
              <h3 className="text-xl font-semibold mb-3 hover:text-verde-escuro hover:underline">
                Problema Resolvido
              </h3>
            </Link>
            <p className="text-muted-foreground">
              Após resolvido, você receberá uma notificação. Você também pode
              confirmar se o problema foi corretamente solucionado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
