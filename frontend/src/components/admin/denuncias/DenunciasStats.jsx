import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useMemo } from "react";

const STATUS = [
  { key: "pending", label: "Pendentes", color: "hsl(var(--chart-2))", bar: "bg-yellow-500" },
  { key: "review", label: "Em Análise", color: "hsl(var(--chart-3))", bar: "bg-blue-500" },
  { key: "resolved", label: "Resolvidas", color: "hsl(var(--chart-4))", bar: "bg-verde" },
  { key: "rejected", label: "Rejeitadas", color: "hsl(var(--chart-5))", bar: "bg-vermelho" },
];

const DenunciasStats = ({ denuncias }) => {
  const estatisticas = useMemo(() => {
    const stats = { total: denuncias.length };
    STATUS.forEach(s => {
      stats[s.key] = denuncias.filter(d => d.status === s.key).length;
    });
    return stats;
  }, [denuncias]);

  const pieData = STATUS.map(s => ({
    name: s.label,
    value: estatisticas[s.key],
    fill: s.color,
  }));

  const lineData = useMemo(() => {
    const denunciasPorMes = denuncias.reduce((acc, denuncia) => {
      let date;
      if (denuncia.createdAt?.toDate) {
        // Firebase Timestamp
        date = denuncia.createdAt.toDate();
      } else if (typeof denuncia.createdAt === "string" || typeof denuncia.createdAt === "number") {
        date = new Date(denuncia.createdAt);
      } else {
        return acc; // pula se não conseguir converter
      }
      if (isNaN(date)) return acc; // pula datas inválidas
      const mesAno = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      acc[mesAno] = (acc[mesAno] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(denunciasPorMes)
      .sort(([a], [b]) => {
        const [mesA, anoA] = a.split('/');
        const [mesB, anoB] = b.split('/');
        return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
      })
      .map(([mes, count]) => ({
        mes,
        denuncias: count,
      }));
  }, [denuncias]);

  const chartConfig = {
    denuncias: { label: "Denúncias" },
    ...Object.fromEntries(STATUS.map(s => [s.key, { label: s.label }])),
  };

  return (
    <div className="space-y-6">
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Linha */}
        <Card>
          <CardHeader>
            <CardTitle>Denúncias por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={lineData}>
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="denuncias"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Distribuição por Status</h3>
              <div className="space-y-2">
                {STATUS.map(s => (
                  <div key={s.key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-medium">
                        {estatisticas[s.key]} (
                          {estatisticas.total > 0
                            ? Math.round((estatisticas[s.key] / estatisticas.total) * 100)
                            : 0
                          }%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className={`${s.bar} h-2.5 rounded-full`}
                        style={{
                          width: estatisticas.total > 0
                            ? `${(estatisticas[s.key] / estatisticas.total) * 100}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DenunciasStats;