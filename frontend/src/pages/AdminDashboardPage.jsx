import React from "react"
import { Link } from "react-router-dom"
import { Shield, Bell, UserCog, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const AdminDashboardPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-azul text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Painel de Administração</h1>
            </div>
            <p className="text-lg text-cinza mt-2">
              Central de gerenciamento da plataforma Cidade Integra
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-blue-50 border-b">
                <div className="flex items-center gap-2">
                  <Bell className="h-6 w-6 text-verde" />
                  <CardTitle>Gerenciar Denúncias</CardTitle>
                </div>
                <CardDescription>
                  Modere e administre todas as denúncias registradas pelos usuários
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Acesse o painel de gerenciamento para visualizar, moderar e responder às denúncias submetidas pelos cidadãos. 
                  Você pode filtrar por status, categoria e localização.
                </p>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button asChild className="w-full">
                  <Link to="/admin/denuncias" className="flex items-center justify-center bg-verde hover:bg-verde-escuro">
                    Acessar Gestão de Denúncias
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-green-50 border-b">
                <div className="flex items-center gap-2">
                  <UserCog className="h-6 w-6 text-verde" />
                  <CardTitle>Gerenciar Usuários</CardTitle>
                </div>
                <CardDescription>
                  Administre contas, permissões e acesso de usuários da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Gerencie usuários do sistema, atribua funções e permissões, monitore atividades e 
                  mantenha a segurança da plataforma com ferramentas administrativas avançadas.
                </p>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button asChild className="w-full">
                  <Link to="/admin/usuarios" className="flex items-center justify-center bg-verde hover:bg-verde-escuro">
                    Acessar Gestão de Usuários
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboardPage
