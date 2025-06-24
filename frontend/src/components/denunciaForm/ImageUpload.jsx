import { useEffect, useMemo, useRef } from "react";
import { FormLabel, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGES = 2;

const ImageUpload = ({ previewImages, setPreviewImages }) => {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    let validFiles = [];

    if (previewImages.length >= MAX_IMAGES) {
      toast({
        title: "Limite de imagens atingido",
        description: "Você pode adicionar no máximo 2 imagens.",
        variant: "destructive",
      });
      return;
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          title: "Formato não suportado",
          description: "Apenas arquivos JPG, PNG ou WEBP são aceitos.",
          variant: "destructive",
        });
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast({
          title: "Imagem muito grande",
          description: "Por favor, escolha uma imagem com até 5MB.",
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
    }

    // Limita o total de imagens a 2
    const newImages = [...previewImages, ...validFiles].slice(0, MAX_IMAGES);
    setPreviewImages(newImages);
    e.target.value = ""; // Permite re-selecionar o mesmo arquivo
  };

  const removeImage = (index) => {
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
  };

  const getPreviewUrl = (file) => {
    if (typeof file === "string") return file;
    if (file instanceof File) return URL.createObjectURL(file);
    return "";
  };

  return (
    <div className="space-y-2">
      <FormLabel>Fotos do problema (opcional - até 2 imagens)</FormLabel>
      {previewImages.length > 0 ? (
        <div className="space-y-4">
          {previewImages.length === 1 ? (
            <div className="relative">
              <img
                src={getPreviewUrl(previewImages[0])}
                alt="Preview"
                className="w-full h-auto rounded-lg max-h-64 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeImage(0)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Carousel className="w-full max-w-md mx-auto">
              <CarouselContent>
                {previewImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative">
                      <img
                        src={getPreviewUrl(img)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-auto rounded-lg max-h-64 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}

          {previewImages.length < MAX_IMAGES && (
            <div className="text-center">
              <label htmlFor="file-upload-additional">
                <div className="bg-verde/10 hover:bg-verde/20 text-verde border-2 border-dashed border-verde/30 font-medium py-2 px-4 rounded-md cursor-pointer flex items-center justify-center gap-2 w-fit mx-auto">
                  <Upload className="h-4 w-4" />
                  <span>Adicionar mais uma foto</span>
                </div>
                <input
                  id="file-upload-additional"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  multiple
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </label>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
          <Camera className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center mb-4">
            Arraste até 2 imagens ou clique para fazer upload.
          </p>
          <label htmlFor="file-upload">
            <div className="bg-verde hover:bg-verde-escuro text-white font-medium py-2 px-4 rounded-md cursor-pointer flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Enviar foto</span>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              multiple
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </label>
        </div>
      )}

      <FormDescription>
        Adicione até 2 fotos para ajudar na identificação do problema. Máx. 5MB cada.
      </FormDescription>
    </div>
  );
};

export default ImageUpload;