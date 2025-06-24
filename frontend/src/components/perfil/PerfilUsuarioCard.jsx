import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Award, User, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import BadgesDisplay from "./BadgesDisplay";

const PerfilUsuarioCard = ({ usuario, onEditClick }) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={usuario.photoURL} alt={usuario.displayName} />
            <AvatarFallback>
              <User className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2x1 font-semibold">{usuario.displayName}</h2>
          <p className="text-muted-foreground mb-2">{usuario.email}</p>
          <p className="text-sm text-center text-muted-foreground mt-2 mb-4">
            {usuario.bio}
          </p>
          <div className="flex items-center gap-2 bg-verde/10 text-verde px-3 py-1 rounded-full text-sm mt-2">
            <Award className="h-5 w-5" />
            <BadgesDisplay user={usuario} />
          </div>
          <Button
            variant="outline"
            onClick={onEditClick}
            className="text-white hover:text-white mt-6 w-full bg-gradient-to-r from-verde to-verde/80 hover:from-verde/90 hover:to-verde/70 font-medium shadow-lg hover:shadow-x1 transition-all duration-300 transform hover:scale-[1.02] border-0"
            size="lg"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerfilUsuarioCard;
