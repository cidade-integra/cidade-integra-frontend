import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useReport } from "@/hooks/useReport";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const StatsSection = () => {
  const { getAllReports } = useReport();
  const [totalDenuncias, setTotalDenuncias] = useState(0);
  const [denunciasResolvidas, setDenunciasResolvidas] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reports = await getAllReports();

        let resolvidas = 0;

        for (const r of reports) {
          if (r.status === "resolved") resolvidas++;
        }

        setTotalDenuncias(reports.length);
        setDenunciasResolvidas(resolvidas);
      } catch (error) {
        console.error("Erro ao buscar denúncias:", error);
      }
    };

    fetchReports();
  }, [getAllReports]);

  const stats = [
    {
      icon: <Bell className="h-8 w-8 text-verde-escuro" />,
      value: totalDenuncias,
      label: "Denúncias Registradas",
      link: "/denuncias",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-verde-escuro" />,
      value: denunciasResolvidas,
      label: "Problemas Resolvidos",
      link: "/denuncias?status=resolved",
    },
    {
      icon: <Clock className="h-8 w-8 text-verde-escuro" />,
      value: 5,
      label: "Dias em Média para Solução",
      link: null,
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-azul">
          Nossa Atuação em Números
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {stats.map(({ icon, value, label, link }, index) => {
            const CardWrapper = ({ children }) =>
              link ? (
                <Link to={link} className="w-full sm:max-w-xs">
                  {children}
                </Link>
              ) : (
                <div className="w-full sm:max-w-xs">{children}</div>
              );

            return (
              <CardWrapper key={index}>
                <Card
                  className="
                    shadow-md transition-transform duration-300
                    cursor-pointer hover:scale-105 hover:shadow-xl hover:bg-verde/5
                  "
                >
                  <CardContent className="pt-6 pb-8 px-6 flex flex-col items-center">
                    <div className="bg-verde/20 p-3 rounded-full mb-4">
                      {icon}
                    </div>
                    <h3
                      className={`${
                        typeof value === "string" ? "text-xl" : "text-4xl"
                      } font-bold mb-2 text-azul`}
                    >
                      {value}
                    </h3>
                    <p className="text-muted-foreground text-center">{label}</p>
                  </CardContent>
                </Card>
              </CardWrapper>
            )
          })}
          
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
