import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, X, Eye, EyeOff, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import useAuthentication from "@/hooks/UseAuthentication";
import { z } from "zod";
import TermsModal from "@/components/ui/terms-modal";
import { useRef } from "react"; // já que você importa outros hooks



const RegisterForm = ({ resetTrigger }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { registerWithEmail } = useAuthentication();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const recaptchaRef = useRef(null);

  // Reset de registerError
  useEffect(() => {
    setRegisterError(null);
  }, [resetTrigger]);

  // Renderizar reCAPTCHA
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.grecaptcha && recaptchaRef.current) {
        window.grecaptcha.render(recaptchaRef.current, {
          sitekey: "6Lej6tgrAAAAAAQevtYjEoZdNDvCEv4K8_V1Ujel",
        });
        clearInterval(interval);
      }
    }, 500);
  }, []);



  const calculatePasswordStrength = (password) => {
    const checks = {
      length: password.length >= 6,
    }
    return { checks };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const registerSchema = z.object({
    name: z
      .string()
      .min(1, "Por favor, preencha seu nome completo."),
    email: z
      .string()
      .email("Por favor, insira um e-mail válido."),
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z
      .string()
      .min(6, "A senha de confirmação deve ter pelo menos 6 caracteres."),
  }).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError(null);

    const token = window.grecaptcha.getResponse();
    if (!token) {
      toast({
        title: "⚠️ Falta validação",
        description: "Confirme que você não é um robô antes de prosseguir.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    const name = e.target["name"].value.trim();
    const email = e.target["register-email"].value.trim();
    const password = e.target["register-password"].value;
    const confirmPassword = e.target["confirm-password"].value;

    // validando os dados com Zod
    try {
      const validatedData = registerSchema.parse({ name, email, password, confirmPassword });

      // Se a validação passar, continue com o processo de registro
      const result = await registerWithEmail(validatedData.email, validatedData.password, validatedData.name);

      if (result.success) {
        toast({
          title: "🎉 Cadastro realizado com sucesso!",
          description: "Bem-vindo! Você já pode começar a usar a plataforma.",
        });
        navigate("/");
      } else {
        const message = result.error || "Ocorreu um erro ao criar sua conta.";
        setRegisterError(message);
        toast({
          title: "❌ Falha no cadastro",
          description: `${message} Verifique os dados e tente novamente.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Se ocorrer um erro de validação, exiba a mensagem de erro para o usuário
        const errorMessage = error.errors[0].message;
        setRegisterError(errorMessage);
        toast({
          title: "❌ Falha no cadastro",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "🚨 Erro inesperado",
          description: "Não foi possível concluir o cadastro. Tente novamente mais tarde.",
          variant: "destructive",
        });
        setRegisterError("Erro inesperado. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }




  };

  return (
    <>
      <form onSubmit={handleRegister} className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" name="name" placeholder="Seu nome completo" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="register-email"
              name="register-email"
              type="email"
              placeholder="lyoto@email.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="register-password"
              name="register-password"
              type={showPassword ? "text" : "password"}
              className="pl-10"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/*Feedback visual para validação da senha*/}
          {password && (
            <div className="mt-2 space-y-2">
              <div className="space-y-1 text-sm">
                <div className={`flex items-center gap-2 ${passwordStrength.checks.length ? "text-green-600" : "text-red-600"}`}>
                  {passwordStrength.checks.length ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  <span>A senha deve ter 6 caracteres ou mais</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirme a senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              className="pl-10"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/*Feedback de confirmação da senha*/}
          {confirmPassword && (
            <div className="mt-2">
              {password === confirmPassword ? (
                <div className="text-green-600 text-sm flex items-center gap-2 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  <span>As senhas coincidem</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <X className="h-4 w-4" />
                  <span>As senhas não são iguais</span>
                </div>
              )}
            </div>
          )}

        </div >

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <Label htmlFor="terms" className="text-sm">
            Concordo com os{" "}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-verde hover:underline"
            >
              termos de uso
            </button>{" "}
            e{" "}
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="text-verde hover:underline"
            >
              política de privacidade
            </button>
          </Label>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
  <div ref={recaptchaRef}></div>
</div>



      <Button
        type="submit"
        className="w-full bg-verde hover:bg-verde-escuro"
        disabled={isLoading}
      >
        {isLoading ? "Cadastrando..." : "Cadastrar"}
      </Button>

      {
        registerError && (
          <p className="text-sm text-red-500 mt-2 text-center">{registerError}</p>
        )
      }
    </form >

      <TermsModal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        type="terms"
      />
      <TermsModal
        open={showPrivacyModal}
        onOpenChange={setShowPrivacyModal}
        type="privacy"
      />

    </>
  );
};

export default RegisterForm;
