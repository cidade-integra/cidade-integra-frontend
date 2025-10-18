import React, { useState, useRef, useEffect } from "react";
import { X, BotMessageSquare } from "lucide-react";

const predefinedResponses = {
  "como reportar":
    'Para reportar um problema, clique no botão "Reportar Problema" no topo da página ou acesse /nova-denuncia. Você precisará descrever o problema, adicionar fotos e informar a localização.',
  "como funciona":
    "O Cidade Integra funciona em 3 passos: 1) Registre o problema com fotos e localização, 2) Nossa equipe analisa e encaminha para o órgão responsável, 3) Você acompanha o status até a resolução.",
  "tipos de problema":
    "Você pode reportar: vazamentos, problemas de iluminação, buracos nas ruas, lixo, manutenção de áreas verdes, poluição sonora, entulho, problemas em praças e outros.",
  "acompanhar denuncia":
    'Para acompanhar suas denúncias, acesse a página "Denúncias" no menu ou faça login em sua conta para ver o histórico completo.',
  contato:
    "Para suporte adicional, entre em contato pelo email: suporte@cidadeintegra.com ou utilize o formulário de contato no site.",
  sobre:
    "O Cidade Integra é uma plataforma cidadã para reportar problemas urbanos e contribuir para uma cidade melhor.",
  ajuda:
    "Você pode perguntar sobre:\n- Como reportar um problema\n- Como funciona o sistema\n- Tipos de problema que posso reportar\n- Como acompanhar minha denúncia\n- Contato\n- Sobre a plataforma",
};

const keywords = [
  { label: "Como reportar?", value: "como reportar" },
  { label: "Como funciona?", value: "como funciona" },
  { label: "Tipos de problema?", value: "tipos de problema" },
  { label: "Acompanhar denúncia", value: "acompanhar denuncia" },
  { label: "Contato", value: "contato" },
  { label: "Sobre", value: "sobre" },
  { label: "Ajuda", value: "ajuda" },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Olá! Sou o assistente virtual do Cidade Integra. Escolha uma opção abaixo.",
      isBot: true,
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeywordClick = (value) => {
    const botMsg = {
      text: predefinedResponses[value] || "Desculpe, não entendi.",
      isBot: true,
    };
    setMessages((msgs) => [...msgs, botMsg]);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
          style={{
            background: "#5BC561",
            borderRadius: "9999px",
            width: 56,
            height: 56,
            boxShadow: "0 4px 24px #0003",
          }}
          aria-label="Abrir chat"
        >
          <BotMessageSquare className="h-6 w-6" color="#fff" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 shadow-xl flex flex-col"
          style={{
            width: "400px",
            height: "560px",
            borderRadius: 18,
            boxShadow: "0 4px 24px #0003",
            background: "#F8FAFC",
            border: "1.5px solid #5BC561",
            maxWidth: "96vw",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center px-4 py-3"
            style={{
              background: "linear-gradient(90deg, #5BC561 70%, #3B8C4B 100%)",
              color: "#fff",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
            }}
          >
            <div className="flex items-center gap-2">
              <BotMessageSquare />
              <span className="text-lg font-semibold">Assistente Virtual</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1"
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
              aria-label="Fechar chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              flex: 1,
              padding: "22px 20px",
              background: "#F8FAFC",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.isBot ? "justify-start" : "justify-end"
                } mb-2`}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 16px",
                    borderRadius: 14,
                    background: msg.isBot ? "#E9F7EF" : "#5BC561",
                    color: msg.isBot ? "#222" : "#fff",
                    fontSize: 15,
                    wordBreak: "break-word",
                    boxShadow: msg.isBot
                      ? "0 1px 4px #5BC56122"
                      : "0 1px 4px #3B8C4B22",
                    borderBottomLeftRadius: msg.isBot ? 4 : 14,
                    borderBottomRightRadius: msg.isBot ? 14 : 4,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Keywords - agora abaixo das mensagens */}
          <div
            style={{
              padding: "12px 20px",
              background: "#F8FAFC",
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              borderTop: "1px solid #E5E7EB",
            }}
          >
            {keywords.map((k) => (
              <button
                key={k.value}
                onClick={() => handleKeywordClick(k.value)}
                style={{
                  background: "#fff",
                  border: "1px solid #5BC561",
                  color: "#3B8C4B",
                  borderRadius: 16,
                  padding: "6px 14px",
                  fontSize: 14,
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#5BC561";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#3B8C4B";
                }}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Responsividade */}
      <style>
        {`
          @media (max-width: 600px) {
            .fixed.bottom-6.right-6.z-50.shadow-xl.flex.flex-col {
              width: 98vw !important;
              height: 98vh !important;
              left: 0 !important;
              bottom: 0 !important;
              border-radius: 0 !important;
            }
            .fixed.bottom-6.right-6.z-50.flex.items-center.justify-center {
              right: 16px !important;
              bottom: 16px !important;
              width: 48px !important;
              height: 48px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
