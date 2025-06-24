import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import useAuthentication from "@/hooks/UseAuthentication";
import GoogleLoginButton from "./GoogleLoginButton";

const LoginForm = ({ resetTrigger }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [googleError, setGoogleError] = useState(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const { loginWithEmail } = useAuthentication();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setLoginError(null);
    setGoogleError(null);
  }, [resetTrigger]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      const emailInput = document.getElementById("email");
      if (emailInput) emailInput.value = savedEmail;
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setIsEmailLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    // Verificar se os campos estão vazios
    if (!email || !password) {
      setLoginError("Por favor, preencha todos os campos.");
      toast({
        title: "⚠️ Campos obrigatórios",
        description: "E-mail e senha são obrigatórios.",
        variant: "destructive",
      });
      setIsEmailLoading(false);
      return;
    }

    rememberMe
      ? localStorage.setItem("rememberedEmail", email)
      : localStorage.removeItem("rememberedEmail");

    try {
      const result = await loginWithEmail(email, password);

      if (result.success) {
        toast({
          title: "✅ Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        navigate("/");
      } else {
        const message = result.error || "Não foi possível fazer login.";
        setLoginError(message);
        toast({
          title: "❌ Falha no login",
          description: `${message} Verifique suas credenciais.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setLoginError("Erro inesperado ao fazer login.");
      toast({
        title: "🚨 Erro inesperado",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };


  return (
    <form onSubmit={handleLogin}
      className="space-y-4"
      role="form"
      aria-label="Formulário de login"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="lyoto@email.com"
            className="pl-10 focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent"
            required
            aria-required="true"
            aria-describedby="email-error"
            aria-invalid={loginError ? "true" : "false"}
            autoComplete="email"
            tabIndex={1}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="pl-10 focus:outline-none focus:ring-2 focus:ring-verde focus:border-transparent"
            required
            aria-required="true"
            aria-describedby="password-error"
            aria-invalid={loginError ? "true" : "false"}
            autoComplete="current-password"
            tabIndex={2}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              className="focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2"
              aria-describedby="remember-description"
              tabIndex={3}
            />
            <Label htmlFor="remember" className="text-sm"
            id="remember-description">
              Lembrar de mim
            </Label>
          </div>
          <Link
            to="/recuperar-senha"
            className="text-sm text-verde hover:underline focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2 rounded-sm"
            aria-label="Ir para página de recuperação de senha"
            tabIndex={4}
          >
            Esqueceu a senha?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-verde hover:bg-verde-escuro focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2"
        disabled={isEmailLoading}
        aria-describedby="login-error"
        tabIndex={5}
      >
        {isEmailLoading ? "Entrando..." : "Entrar"}
      </Button>

      <GoogleLoginButton setGoogleError={setGoogleError} />

      {(loginError || googleError) && (
        <div
          id="login-error"
          role="alert"
          aria-live="polite"
          className="text-sm text-red-500 mt-2 text-center p-2 bg-red-50 border border-red-200 rounded-md">
          {loginError || googleError}
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {isEmailLoading && "Processando login, aguarde..."}
      </div>
    </form>
  );
};

export default LoginForm;