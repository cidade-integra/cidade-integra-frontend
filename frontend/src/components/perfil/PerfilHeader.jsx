import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

const PerfilHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-azul text-white py-12">
      <div className="container mx-auto px-4">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center text-cinza hover:text-white mb-4 w-fit cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para página anterior</span>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Meu Perfil</h1>
        <p className="text-lg text-cinza">
          Gerencie suas informações e acompanhe suas denúncias.
        </p>
      </div>
    </div>
  );
};

export default PerfilHeader;
