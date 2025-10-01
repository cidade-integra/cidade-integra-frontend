import { Check, Clock, FileCheck, X } from "lucide-react";

const statusConfig = {
  pending:  { label: "Pendente",   icon: Clock,     color: "yellow-500" },
  review:   { label: "Em Análise", icon: FileCheck, color: "blue-500"   },
  resolved: { label: "Resolvido",  icon: Check,     color: "green-500"  },
  rejected: { label: "Rejeitado",  icon: X,         color: "red-500"    },
};

const StatusFlow = ({ status }) => {
  const flowSteps = ["pending", "review", "resolved"]; // fluxo principal
  const steps = status === "rejected" ? ["rejected"] : flowSteps;

  const getStepStatus = (stepId) => {
    if (status === "rejected") return stepId === "rejected" ? "current" : "upcoming";

    const currentIndex = flowSteps.indexOf(status);
    const stepIndex = flowSteps.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-6 text-foreground">
        Status da Denúncia
      </h3>

      <div className="relative">
        {/* Linha de conexão só aparece se não for rejeitado */}
        {status !== "rejected" && (
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
        )}

        <div className="space-y-6 relative">
          {steps.map((stepId) => {
            const { label, icon: Icon, color } = statusConfig[stepId];
            const stepStatus = getStepStatus(stepId);

            const baseClass =
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all z-10 relative";

            const statusClass =
              stepStatus === "completed"
                ? `bg-${color} text-white shadow-md`
                : stepStatus === "current"
                ? `border-2 border-${color} bg-background text-${color} shadow-md`
                : "bg-muted text-muted-foreground border border-border";

            return (
              <div key={stepId} className="flex items-start gap-4 relative">
                <div className={`${baseClass} ${statusClass}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <p
                    className={`font-medium ${
                      stepStatus === "upcoming"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {label}
                  </p>
                  {stepStatus === "current" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {status === "rejected" ? "Denúncia rejeitada" : "Status atual"}
                    </p>
                  )}
                  {stepStatus === "completed" && (
                    <p className="text-xs text-muted-foreground mt-1">Concluído</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusFlow;
    