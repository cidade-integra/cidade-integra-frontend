import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GenericModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  overlayColor,
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        overlayColor={overlayColor}
        className="
          w-11/12 max-w-md sm:max-w-md
          rounded-xl
          shadow-xl border border-gray-200
          bg-white
          p-0
          max-h-[calc(100vh-32px)]
        "
      >
        <ScrollArea className="p-4 sm:p-4 max-h-[calc(100vh-32px)]">
          
          {title && (          
            <DialogHeader>
              <div className="text-center mb-8">
              {title.icon && (
                <div className="inline-flex items-center justify-center p-3 bg-verde rounded-full mb-4">
                  {title.icon}
                </div>
              )}
              <DialogTitle className={`${title.className || "text-2xl font-bold text-azul"}`}>
                {title.text}
              </DialogTitle>
              {description && (
                <DialogDescription className={`${description.className || "text-gray-500 mt-2 text-sm"}`}>
                  {description.text}
                </DialogDescription>
              )}
            </div>
            </DialogHeader>
          )}
          <div className=" m-1">
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}