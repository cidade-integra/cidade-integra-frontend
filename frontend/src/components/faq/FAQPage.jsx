import React from "react";
import FAQHeader from "./FAQHeader";
import FAQSection from "./FAQSection";
import ContactSection from "./ContactSection";

const FAQPage = () => {
  return (
    <div className="scroll-smooth">
      {/* Cabeçalho da página */}
      <FAQHeader />

      {/* Conteúdo principal: perguntas + contato */}
      <main className="container mx-auto px-4 py-12 space-y-16">
        <FAQSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default FAQPage;
