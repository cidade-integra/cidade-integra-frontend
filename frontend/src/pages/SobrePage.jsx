import StudentCard from "@/components/sobre/StudentCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { students } from "@/data/equipe";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, HeartHandshake, Zap, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SobrePage = () => {

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-verde/10 to-transparent pt-16 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-azul mb-6">Sobre o Projeto</h1>
                <div className="flex justify-center mb-8">
                  <div className="h-1 w-24 bg-verde rounded-full"></div>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  O <span className="font-bold text-verde">Cidade Integra</span> é um projeto desenvolvido por estudantes de Desenvolvimento de Software Multiplataforma pela Faculdade de Tecnologia de São Paulo - Matão (FATEC-SP),
                  com o objetivo de conectar cidadãos e autoridades para a solução de problemas urbanos.
                  Nossa plataforma facilita o registro, acompanhamento e resolução de denúncias relacionadas
                  a infraestrutura, meio ambiente e serviços públicos.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Team section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-azul mb-2">Nossa Equipe</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Conheça os profissionais dedicados ao desenvolvimento e manutenção da plataforma Cidade Integra.
              </p>
              <div className="flex justify-center mt-4">
                <div className="h-1 w-16 bg-verde rounded-full"></div>
              </div>
            </motion.div>

            <section className="px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {students.map((student, index) => (
                  <StudentCard key={index} {...student} />
                ))}
              </div>
            </section>

          </div>
        </section>

        {/* Mission section */}
        <section className="py-16 bg-azul text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
              >
                <h2 className="text-3xl font-bold mb-2">Nossa Missão</h2>
                <div className="flex justify-center mt-4 mb-8">
                  <div className="h-1 w-16 bg-verde rounded-full"></div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-azul/40 p-6 rounded-lg backdrop-blur-sm"
                >
                  <div className="bg-verde/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Link className="h-7 w-7 text-verde" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-verde">Conectar</h3>
                  <p className="text-cinza">Criar uma ponte eficiente entre cidadãos e órgãos responsáveis.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-azul/40 p-6 rounded-lg backdrop-blur-sm"
                >
                  <div className="bg-verde/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeartHandshake className="h-7 w-7 text-verde" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-verde">Facilitar</h3>
                  <p className="text-cinza">Simplificar o processo de denúncia e acompanhamento de problemas urbanos.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-azul/40 p-6 rounded-lg backdrop-blur-sm"
                >
                  <div className="bg-verde/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-7 w-7 text-verde" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-verde">Transformar</h3>
                  <p className="text-cinza">Impactar positivamente a qualidade de vida nas cidades através da tecnologia.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-verde/20 to-verde/5 p-8 rounded-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDIwMGMtNTUuMiAwLTEwMC00NC44LTEwMC0xMDBzNDQuOC0xMDAgMTAwLTEwMCAxMDAgNDQuOCAxMDAgMTAwLTQ0LjggMTAwLTEwMCAxMDB6IiBmaWxsPSIjM0I4QzRCIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9Ii41Ii8+PC9zdmc+')]"></div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <h2 className="text-2xl font-bold text-azul mb-4 text-center">Nosso Compromisso</h2>
                <p className="text-center text-muted-foreground max-w-3xl mx-auto">
                  Estamos comprometidos com a transparência, acessibilidade e eficiência na resolução de problemas urbanos.
                  O Cidade Integra é mais que um projeto acadêmico - é uma iniciativa que busca melhorar a qualidade
                  de vida nas cidades através da tecnologia e participação cidadã.
                </p>
                <div className="flex justify-center mt-8">
                  <a href="/article-cidade-integra.pdf" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-verde hover:bg-verde-escuro">Saiba mais sobre nossa iniciativa</Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* botão de rolar para cima */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8}}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className="bg-verde hover:bg-verde-escuro shadow-lg rounded-full h-12 w-12"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SobrePage;
