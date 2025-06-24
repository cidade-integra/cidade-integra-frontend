import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const FAQCategory = ({ id, title, faqItems }) => {
  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <motion.h2
        className="text-2xl font-bold text-azul mb-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {title}
      </motion.h2>

      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <AccordionItem
              value={item.id}
              className="border-b border-gray-100 dark:border-gray-700 py-2"
            >
              <AccordionTrigger className="text-lg font-medium text-azul hover:text-verde transition-colors duration-200 py-3">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-2">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQCategory;
