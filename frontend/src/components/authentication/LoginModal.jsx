import { useState } from "react";
import LoginForm from "@/components/authentication/LoginForm";
import RegisterForm from "@/components/authentication/RegisterForm";
import AuthNotice from "@/components/authentication/shared/AuthNotice";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function LoginModal() {
  const { currentUser: user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = (value) => setActiveTab(value);

  if (loading) return <LoadingScreen mensagem="Carregando..." />;

  return (
    <>
      <Tabs defaultValue="login" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="register">Cadastrar</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm resetTrigger={activeTab} />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm resetTrigger={activeTab} />
        </TabsContent>
      </Tabs>

      {!user && <AuthNotice />}
    </>
  );
}
