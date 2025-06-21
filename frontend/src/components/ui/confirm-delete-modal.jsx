import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar Exclusão",
    description = "Esta ação não poderá ser desfeita. Deseja continuar?",
    itemName = "denúncia",
    isLoading = false }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] rounded-lg border-gray-200">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-600">
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-5">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Trash2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-red-800">
                                    Atenção: Ação irreversível
                                </h4>
                                <p className="text-sm text-red-700 mt-1 leanding-snug">
                                    Ao confirmar, esta {itemName} será permanentemente removida do banco de dados do Cidade Integra e não poderá ser recuperada.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Excluindo...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Excluir
                            </div>
                        )}
                    </Button>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}

export default ConfirmDeleteModal;