import React from "react";
import { motion } from "framer-motion";

const FAQCategory = ({ faqItems = [] }) => {
  if (!Array.isArray(faqItems) || faqItems.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 italic">
        Nenhuma pergunta cadastrada nesta categoria.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {faqItems.map((faq, index) => (
        <motion.li
          key={faq.id || index}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {faq.pergunta}
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              {faq.resposta}
            </p>
          </div>
        </motion.li>
      ))}
    </ul>
  );
};

export default FAQCategory;
