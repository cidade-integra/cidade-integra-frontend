import React from "react";
import { useFaq } from "../hooks/useFaq";

const Faq = () => {
  const { faqData, loading, error } = useFaq();

  if (loading) return <p>Carregando FAQ...</p>;
  if (error) return <p>Erro ao carregar FAQ: {error.message}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Perguntas Frequentes</h1>
      {faqData.map((category) => (
        <div key={category.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{category.label}</h2>
          <ul className="space-y-3">
            {category.items.map((item) => (
              <li key={item.id}>
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Faq;
