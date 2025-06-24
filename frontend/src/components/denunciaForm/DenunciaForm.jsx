import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/schema/DenunciaFormSchema";
import DenunciaFormFields from "./DenunciaFormFields";
import ImageUpload from "./ImageUpload";
import { useReport } from "@/hooks/useReport";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { set } from "date-fns";

const DenunciaForm = () => {
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createReport } = useReport();
  const { currentUser: user } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      categoria: "",
      local: "",
      cep: "",
      anonima: false,
    },
  });

  const onSubmit = async (values) => {
    if (!user) {
      toast({
        title: "Usuário não autenticado",
        description: "Faça login para enviar denúncias.",
        variant: "destructive",
      });
      return;
    }
  
    const report = {
      title: values.titulo,
      description: values.descricao,
      category: values.categoria,
      isAnonymous: values.anonima,
      userId: user.uid,
      location: {
        latitude: 0,
        longitude: 0,
        address: values.local,
        ...(values.cep ? { postalCode: values.cep } : {}),
      },
      ...(previewImages.length > 0 && { imagemFiles: previewImages }), // plural e array
    };
  
    setIsSubmitting(true);
  
    try {
      await createReport(report);
  
      toast({
        title: "🌳 Denúncia enviada com sucesso!",
        description: "Sua denúncia foi registrada e será analisada em breve.",
      });
  
      form.reset();
      setPreviewImages(null);
      navigate("/denuncias");
    } catch (error) {
      console.error("Erro ao enviar denúncia:", error);
      toast({
        title: "Erro ao enviar denúncia",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DenunciaFormFields form={form} />

            <ImageUpload
              previewImages={previewImages}
              setPreviewImages={setPreviewImages}
            />

            <Button
              type="submit"
              className="w-full bg-verde hover:bg-verde-escuro"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enviando...
                </>
              ) : (
                "Enviar Denúncia"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DenunciaForm;