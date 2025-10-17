import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDeactivateDialog({ onConfirm }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Desativar Conta</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja desativar sua conta?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação desativará seu acesso e suas denúncias deixarão de ser
            visíveis no sistema. Você pode reativar sua conta futuramente
            entrando em contato com o suporte.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <AlertDialogAction asChild>
              <AlertDialogAction
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogAction>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
