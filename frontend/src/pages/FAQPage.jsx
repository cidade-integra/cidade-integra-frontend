import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQHeader from "@/components/faq/FAQHeader";
import FAQSection from "@/components/faq/FAQSection";
import FAQNavigation from "@/components/faq/FAQNavigation";
import ContactSection from "@/components/faq/ContactSection";
import { motion } from "framer-motion";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useMediaQuery } from "@/hooks/useMediaQuery";


import { getFaqCategories } from "@/data/faqData";
import useModalStore from "@/hooks/useModalStore";

const FAQPage = () => {
  const {openModal} = useModalStore()
  const faqCategories = getFaqCategories(openModal)

  const sectionIds = faqCategories.map((category) => category.id);
  const activeSection = useScrollSpy(sectionIds, 150);
  const isWideEnough = useMediaQuery("(min-width: 1316px)");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <FAQHeader />

      <motion.div
        className={`container mx-auto px-4 py-12 flex-grow flex gap-8 ${
          isWideEnough ? "md:flex-row" : "justify-center"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* navegação lateral apenas se tela for larga */}
        {isWideEnough && (
          <aside className="w-1/4">
            <FAQNavigation
              activeSection={activeSection}
              categories={faqCategories}
            />
          </aside>
        )}

        {/* conteúdo principal ocupa o espaço todo se não houver navegação */}
        <main className={`w-full ${isWideEnough ? "md:w-3/4" : "max-w-3xl"}`}>
          <FAQSection isWideEnough={isWideEnough}/>
          <ContactSection />
        </main>
      </motion.div>

      <Footer />
    </div>
  );
};

export default FAQPage;
