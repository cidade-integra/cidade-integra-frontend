import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const DenunciaStatusBadge = ({
  status,
  denunciaId,
  className = "",
  isAdmin = false,
  onStatusChange,
  loading,
}) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-500",
      text: "Pendente",
    },
    review: {
      color: "bg-blue-500",
      text: "Em Análise",
    },
    resolved: {
      color: "bg-verde",
      text: "Resolvido",
    },
    rejected: {
      color: "bg-vermelho",
      text: "Rejeitado",
    },
  };

  const config = statusConfig[status];

  if (!isAdmin) {
    return (
      <Badge className={`${config.color} text-white ${className}`}>
        {config.text}
      </Badge>
    );
  }

  return (
    <Select
      value={status}
      onValueChange={(newStatus) => onStatusChange(denunciaId, newStatus)}
      disabled={loading}
    >
      <SelectTrigger
        className={`w-auto ${config.color} text-white ${className}`}
      >
        <SelectValue placeholder={config.text} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([key, { text, color }]) => (
          <SelectItem
            key={key}
            value={key}
            className={`hover:${color} hover:text-white focus:${color} focus:text-white`}
          >
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DenunciaStatusBadge;
