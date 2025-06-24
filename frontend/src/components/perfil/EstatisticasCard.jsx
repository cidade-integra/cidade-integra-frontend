import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Info } from "lucide-react";

const EstatisticasCard = ({ totalDenuncias, porcentagemResolvidas }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          Estatísticas
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
            <span className="text-muted-foreground flex items-center gap-1">
                Pontuação
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" aria-label="Clique para saber como funciona os critérios de pontuação"/>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs bg-azul text-white">
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">Como funciona a pontuação?</p>
                        <ul className="space-y-1 text-xs">
                          <li>+10 pontos por denúncia criada</li>
                          <li>+20 pontos por denúncia resolvida</li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2 text-white">
                          Acumule pontos para subir de nível e ganhar distintivos especiais!
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span className="font-medium flex items-center gap-1">
                {totalDenuncias*10} <Star className="h-4 w-4 text-amber-500" />
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-verde h-2.5 rounded-full" style={{ width: `${Math.min(totalDenuncias/2, 100)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Denúncias feitas</span>
              <span className="font-medium">{totalDenuncias}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Resolvidas</span>
              <span className="font-medium">{porcentagemResolvidas}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${porcentagemResolvidas}%` }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EstatisticasCard
