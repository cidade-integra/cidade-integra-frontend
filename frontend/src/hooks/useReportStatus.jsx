import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export const useReportStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = async (reportId, status) => {
    setLoading(true);
    setError(null);

    try {
      const update = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (status === "resolved") {
        update.resolvedAt = Timestamp.now();
      }

      await updateDoc(doc(db, "reports", reportId), update);

      toast({
        title: "Status atualizado!",
        description: `Status alterado para ${getStatusText(status)}`,
        variant: "success",
      });

      return true;
    } catch (err) {
      console.error("Erro ao atualizar o status:", err);
      setError(err.message);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o status",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Pendente",
      review: "Em Análise",
      resolved: "Resolvido",
      rejected: "Rejeitado",
    };
    return statusMap[status] || status;
  };

  return {
    updateStatus,
    markAsResolved: (id) => updateStatus(id, "resolved"),
    markAsInReview: (id) => updateStatus(id, "review"),
    markAsRejected: (id) => updateStatus(id, "rejected"),
    loading,
    error,
    statusText: getStatusText,
  };
};
