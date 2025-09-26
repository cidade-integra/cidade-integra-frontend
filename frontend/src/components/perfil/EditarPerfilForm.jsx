import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Mail, Lock, X, Eye, EyeOff, Check } from "lucide-react";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const EditarPerfilForm = ({
  usuario,
  isPasswordAlertOpen,
  isGoogleUser,
  onOpenChange,
  onPasswordAlertOpenChange,
  onSubmit,
}) => {

  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formError, setFormError] = useState("");

  const { toast } = useToast();

  const calculatePasswordStrength = (password) => {
    const checks = {
      length: password.length >= 6,
    }
    return { checks };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const firebaseErrorMessages = {
    "auth/invalid-credential": "Senha atual incorreta.",
    "auth/weak-password": "A nova senha é muito fraca. Escolha uma senha mais forte.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
    "auth/requires-recent-login": "Por segurança, faça login novamente para alterar sua senha.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/network-request-failed": "Falha de conexão. Verifique sua internet.",
    // Adicione outros erros relevantes conforme necessário
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Limpa os campos de senha ao iniciar a operação
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");

    if (isGoogleUser) {
      onSubmit(e);
      toast({
        title: "✅ Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
        status: "success",
      });
      return;
    }

    if (password !== confirmPassword) {
      setFormError("As senhas não coincidem.");
      onPasswordAlertOpenChange(true);
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        usuario.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, password);
      onSubmit(e);
      onOpenChange(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
        status: "success",
      });
    } catch (err) {
      const msg =
        firebaseErrorMessages[err.code] ||
        err.message ||
        "Erro ao atualizar senha. Tente novamente.";
      setFormError(msg);
    } finally {
      // Limpa os campos de senha ao finalizar a operação
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" name="nome" defaultValue={usuario.displayName} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={usuario.email}
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>

            {!isGoogleUser ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="senha-atual">Senha Atual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="senha-atual"
                      name="senha-atual"
                      type={showCurrentPassword ? "text" : "password"}
                      className="pl-10"
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <Label htmlFor="nova-senha">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      name="register-password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/*Feedback visual para validação da senha*/}
                  {password && (
                    <div className="mt-2 space-y-2">
                      <div className="space-y-1 text-sm">
                        <div className={`flex items-center gap-2 ${passwordStrength.checks.length ? "text-green-600" : "text-red-600"}`}>
                          {passwordStrength.checks.length ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          <span>A senha deve ter 6 caracteres ou mais</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mt-2">
                  <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pl-10"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {confirmPassword && (
                    <div className="mt-2">
                      {password === confirmPassword ? (
                        <div className="text-green-600 text-sm flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          <span>As senhas coincidem</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <X className="h-4 w-4" />
                          <span>As senhas não são iguais</span>
                        </div>
                      )}
                    </div>
                  )}
                </div >

              </>
            ) : (
              <Alert variant="info">
                <AlertTitle>Conta Google</AlertTitle>
                <AlertDescription>
                  Você está logado com uma conta do Google. Para alterar sua
                  senha, acesse as configurações da sua conta Google.
                </AlertDescription>
              </Alert>
            )}

          </div>

          {formError && (
            <div className="text-red-600 text-sm">{formError}</div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-verde hover:bg-verde-escuro text-white"
            >
              Salvar alterações
            </Button>
          </div>
        </form>
      </DialogContent>

      <AlertDialog
        open={isPasswordAlertOpen}
        onOpenChange={onPasswordAlertOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>❌ Erro na alteração de senha</AlertDialogTitle>
            <AlertDialogDescription>
              As senhas não correspondem. Por favor, verifique se a nova senha e
              a confirmação são idênticas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditarPerfilForm;
