import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/firebase/config";

const ContactSection = () => {
  return (
    <section id="contato" className="scroll-mt-24">
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-verde/10 to-verde/5 border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-xl md:text-2xl text-azul flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-verde text-white rounded-full">
              ?
            </span>
            Ainda tem dúvidas?
          </CardTitle>
          <CardDescription className="text-base">
            Entre em contato com nossa equipe de suporte.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-6 text-base">
            Se você não encontrou a resposta para sua dúvida, entre em contato
            conosco:
          </p>
          <div className="flex justify-center">
            <motion.div
              className="bg-muted/50 p-4 sm:p-5 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start gap-3"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 bg-verde/10 text-verde rounded-full flex-shrink-0 mb-2 sm:mb-0">
                <Mail className="h-5 w-5" />
              </span>
              <div className="w-full">
                <h3 className="font-medium text-lg mb-2 text-azul">Email</h3>
                <p className="text-sm text-muted-foreground mb-3 break-words">
                  suporte@cidadeintegra.com
                </p>
                <a href="mailto:suporte@cidadeintegra.com?subject=Atendimento%20Cidade%20Integra&body=Olá,%20gostaria%20de%20falar%20sobre..." target="_blank"
                  rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-verde border-verde hover:bg-verde hover:text-white w-full sm:w-auto"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar email
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ContactSection;
