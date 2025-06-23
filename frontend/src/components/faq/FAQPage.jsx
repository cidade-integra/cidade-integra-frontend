import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQHeader from "@/components/faq/FAQHeader";
import FAQSection from "@/components/faq/FAQSection";
import ContactSection from "@/components/faq/ContactSection";
import { motion } from "framer-motion";

const FAQPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <FAQHeader />

      <motion.div
        className="container mx-auto px-4 py-12 flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <FAQSection />
          <ContactSection />
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default FAQPage;
