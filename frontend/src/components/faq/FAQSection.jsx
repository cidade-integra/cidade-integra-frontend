import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FAQCategory from "./FAQCategory";
import { useFaq } from "../../hooks/useFaq";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const FAQSection = () => {
  const { faqs, loading, error } = useFaq();

  if (loading) return <p>Carregando FAQs...</p>;
  if (error) return <p>Erro ao carregar FAQs: {error}</p>;

  const faqCategories = Array.isArray(faqs)
    ? faqs.reduce((acc, faq) => {
        const categoria = faq.categoria || "Outros";
        const existing = acc.find((item) => item.label === categoria);
        if (existing) {
          existing.items.push(faq);
        } else {
          acc.push({
            id: categoria.toLowerCase().replace(/\s/g, "-"),
            label: categoria,
            items: [faq],
          });
        }
        return acc;
      }, [])
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="mb-8 border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-t-lg border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-xl md:text-2xl text-azul">
            Dúvidas sobre o Cidade Integra
          </CardTitle>
          <CardDescription className="text-base">
            Encontre respostas para suas perguntas nas seções abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-10">
            {faqCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="mb-4">
                  <h3 className="text-lg md:text-xl font-semibold text-azul">
                    {category.label}
                  </h3>
                  <Separator className="mt-2 bg-gray-100 dark:bg-gray-700" />
                </div>
                <div className="pl-1">
                  <FAQCategory
                    categoryId={category.id}
                    faqItems={category.items}
                  />
                </div>
                {index < faqCategories.length - 1 && (
                  <div className="pt-6"></div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FAQSection;
