import React from "react";
import { BookOpen } from "lucide-react";
import { db } from "@/firebase/config";

const FAQHeader = () => {
  return (
    <header className="bg-azul text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          Perguntas Frequentes
        </h1>
        <p className="text-lg text-cinza">
          Encontre respostas para as dúvidas mais comuns sobre a plataforma.
        </p>
      </div>
    </header>
  );
};

export default FAQHeader;
