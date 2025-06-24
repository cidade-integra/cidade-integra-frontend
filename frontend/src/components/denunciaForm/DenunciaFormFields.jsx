import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";

const DenunciaFormFields = ({ form }) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleCepBlur = async (cep) => {
    if (!cep || cep.length < 8) return;

    setIsFetching(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado.");

        return;
      }

      form.setValue(
        "local", 
        `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`
      );
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="titulo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Buraco na calçada" {...field} />
            </FormControl>
            <FormDescription>
              Um título conciso que descreva o problema.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="descricao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva o problema em detalhes..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Descreva os detalhes do problema, incluindo há quanto tempo ele 
              existe e como está afetando a área.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categoria"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="buracos">Buracos</SelectItem>
                <SelectItem value="iluminacao">Iluminação</SelectItem>
                <SelectItem value="lixo">Lixo</SelectItem>
                <SelectItem value="vazamentos">Vazamentos</SelectItem>
                <SelectItem value="areas-verdes">Áreas Verdes</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Selecione a categoria que melhor descreve o problema.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cep">CEP (opcional)</FormLabel>
              <FormControl>
                <Input
                  id="cep"
                  placeholder="Ex: 00000-000"
                  {...field}
                  onBlur={(e) => handleCepBlur(e.target.value.replace("-", ""))}
                />
              </FormControl>
              <FormDescription>Informe o CEP da localidade.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="local"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="local">Endereço</FormLabel>
              <FormControl>
                <Input
                  id="local"
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                  {...field}
                  disabled={isFetching}
                />
              </FormControl>
              <FormDescription>
                Informe o endereço onde o problema está localizado.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="anonima"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg:bg-blue-950">
                <Shield className="h-5 w-5 text-verde dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <FormLabel className="text-base font-medium">
                  Denúncia Anônima
                </FormLabel>
                <FormDescription className="text-sm text-muted-foreground">
                  Sua identidade será mantida em sigilo. Apenas os dados da denúncia serão compartilhados com as autoridades competentes.
                </FormDescription>
              </div>
            </div>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="h-6 w-6 rounded border-gray-300 bg-white text-verde focus:ring-2 focus:ring-verde"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default DenunciaFormFields;