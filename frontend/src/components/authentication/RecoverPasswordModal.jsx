import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import useAuthentication from "@/hooks/UseAuthentication";
import useModalStore from '@/hooks/useModalStore';

const RecoverPasswordModal = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuthentication();
  const closeModal = useModalStore((s) => s.closeModal);
  const openModal = useModalStore((s) => s.openModal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await resetPassword(email);
    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      toast({
        title: "Email enviado com sucesso!",
        description: "Verifique sua caixa de entrada.",
      });
    } else {
      toast({
        title: "Erro",
        description: result.error || "Não foi possível enviar o email.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!isSubmitted ? (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-verde hover:bg-verde-escuro"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Recuperar senha"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => openModal("login")}
              className="w-full inline-flex items-center justify-center gap-1 text-verde"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-4">
          <CheckCircle className="text-verde mx-auto h-12 w-12" />
          <h2 className="text-lg font-medium text-azul">Verifique seu email</h2>
          <p className="text-gray-500 text-sm">
            Enviamos instruções para <strong>{email}</strong>.<br />
            Verifique sua caixa de entrada e spam.
          </p>
          <Button
            onClick={closeModal}
            className="w-full bg-verde hover:bg-verde-escuro"
          >
            Fechar
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecoverPasswordModal;
