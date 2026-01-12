import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Mail, Lock, User, ArrowLeft, IdCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().email("Email inválido");
const passwordSchema = z.string().min(6, "A senha deve ter pelo menos 6 caracteres");
const crefSchema = z.string().min(6, "CREF inválido").regex(/^CREF\s?\d+/, "CREF deve seguir o formato: CREF XXXXX/UF");

type UserRole = "student" | "trainer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [cref, setCref] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string; cref?: string; confirmEmail?: string }>({});
  
  const { signIn, signUp, user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      if (userRole === "trainer") {
        navigate("/trainer/profile");
      } else if (userRole === "student") {
        navigate("/");
      }
      // if userRole is null we wait for it to be fetched in AuthContext
    }
  }, [user, loading, navigate, userRole]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; fullName?: string; cref?: string; confirmEmail?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    if (!isLogin && !fullName.trim()) {
      newErrors.fullName = "Nome completo é obrigatório";
    }

    // Trainer-specific validations
    if (!isLogin && selectedRole === "trainer") {
      if (email !== confirmEmail) {
        newErrors.confirmEmail = "Os emails não coincidem";
      }
      
      try {
        crefSchema.parse(cref.trim());
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.cref = e.errors[0].message;
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          let message = "Erro ao fazer login";
          if (error.message?.includes("Invalid login credentials")) {
            message = "Email ou senha incorretos";
          } else if (error.message?.includes("Email not confirmed")) {
            message = "Verifique seu email para confirmar a conta";
          } else if (error.message?.includes("400")) {
            message = "Erro na autenticação. Verifique suas credenciais e tente novamente ou crie uma nova conta.";
          }
          console.error("Login error:", error);
          toast({
            variant: "destructive",
            title: "Erro",
            description: message,
          });
        } else {
          toast({
            title: "Bem-vindo!",
            description: "Login realizado com sucesso.",
          });
          // Navigation handled by useEffect after userRole is available
        }
      } else {
        // Check if CREF is already registered for trainers
        if (selectedRole === "trainer") {
          const { data: existingCref } = await supabase
            .from("profiles")
            .select("cref")
            .eq("cref", cref.trim())
            .maybeSingle();

          if (existingCref) {
            toast({
              variant: "destructive",
              title: "CREF Já Cadastrado",
              description: "Este CREF já está vinculado a outra conta. Verifique o número ou entre em contato com o suporte.",
            });
            setIsSubmitting(false);
            return;
          }
        }

        const { error } = await signUp(email, password, fullName, selectedRole, selectedRole === "trainer" ? cref.trim() : undefined);
        if (error) {
          let message = "Erro ao criar conta";
          let title = "Erro";
          if (error.message.includes("already registered") || error.message.includes("User already registered")) {
            title = "Email Já Cadastrado";
            message = "Este email já está vinculado a uma conta existente. Tente fazer login ou use outro email.";
          } else if (error.message.includes("profiles_cref_unique")) {
            title = "CREF Já Cadastrado";
            message = "Este CREF já está vinculado a outra conta.";
          }
          toast({
            variant: "destructive",
            title,
            description: message,
          });
        } else {
          toast({
            title: "Conta criada!",
            description: "Verifique seu email para confirmar a conta antes de fazer login.",
          });
          // Show login form after signup
          setIsLogin(true);
          setEmail("");
          setPassword("");
          setFullName("");
          setCref("");
          setConfirmEmail("");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Digite seu email para recuperar a senha.",
      });
      return;
    }

    try {
      emailSchema.parse(forgotPasswordEmail);
    } catch {
      toast({
        variant: "destructive",
        title: "Email inválido",
        description: "Digite um email válido.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível enviar o email de recuperação. Tente novamente.",
        });
      } else {
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back button */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow mb-4">
              <Dumbbell className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">
              My<span className="text-gradient">Personal</span>Trainer
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "Entre na sua conta" : "Crie sua conta"}
            </p>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Seu nome completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Conta</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole("student")}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          selectedRole === "student"
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <User className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">Aluno</span>
                        <p className="text-xs text-muted-foreground mt-1">Buscar trainers</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole("trainer")}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          selectedRole === "trainer"
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <Dumbbell className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">Trainer</span>
                        <p className="text-xs text-muted-foreground mt-1">Oferecer serviços</p>
                      </button>
                    </div>
                  </div>

                  {/* CREF field for trainers */}
                  {selectedRole === "trainer" && (
                    <div className="space-y-2">
                      <Label htmlFor="cref">CREF (Registro Profissional)</Label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="cref"
                          type="text"
                          placeholder="CREF 012345-G/SP"
                          value={cref}
                          onChange={(e) => setCref(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {errors.cref && (
                        <p className="text-sm text-destructive">{errors.cref}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Obrigatório para trainers. Exemplo: CREF 012345-G/SP
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Confirm email for trainers */}
              {!isLogin && selectedRole === "trainer" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmEmail">Confirmar Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmEmail"
                      type="email"
                      placeholder="Confirme seu email"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.confirmEmail && (
                    <p className="text-sm text-destructive">{errors.confirmEmail}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-primary hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                ) : isLogin ? (
                  "Entrar"
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin ? (
                  <>
                    Não tem conta? <span className="text-primary font-medium">Cadastre-se</span>
                  </>
                ) : (
                  <>
                    Já tem conta? <span className="text-primary font-medium">Entrar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Esqueci minha senha</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Digite seu email para receber um link de recuperação de senha.
            </p>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgotEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="forgotEmail"
                    type="email"
                    placeholder="seu@email.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
