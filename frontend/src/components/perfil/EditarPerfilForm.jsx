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

const EditarPerfilForm = ({
  usuario,
  isOpen,
  isPasswordAlertOpen,
  isGoogleUser,
  onOpenChange,
  onPasswordAlertOpenChange,
  onSubmit,
}) => {
  return (
    <>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
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

          {/* <div className="space-y-2">
            <Label htmlFor="bio">Sobre mim</Label>
            <Textarea id="bio" name="bio" defaultValue={usuario.bio} />
          </div> */}

          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>

            {!isGoogleUser ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="senha-atual">Senha Atual</Label>
                  <Input id="senha-atual" name="senha-atual" type="password" />
                </div>

                <div className="space-y-2 mt-2">
                  <Label htmlFor="nova-senha">Nova Senha</Label>
                  <Input id="nova-senha" name="nova-senha" type="password" />
                </div>

                <div className="space-y-2 mt-2">
                  <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmar-senha"
                    name="confirmar-senha"
                    type="password"
                  />
                </div>
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
