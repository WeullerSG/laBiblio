import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Notifications } from "@/services/notifications";
import { ResetSenha } from "@/alunosPages/resetSenha";
import { BookMarked, BookOpen, Clock, ShieldCheck } from "lucide-react";

export function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [accountCreated, setAccountCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tela, setTela] = useState<"login" | "reset">("login");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 size-96 rounded-full bg-black/10 blur-3xl" />
        <div className="relative flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <BookOpen className="size-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">LaBiblio</span>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Sua biblioteca, organizada e a um clique.
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Consulte o acervo, alugue até 3 livros por vez e receba lembretes de devolução por e-mail.
          </p>
          <ul className="mt-8 flex flex-col gap-3 text-sm text-primary-foreground/90">
            <li className="flex items-center gap-2"><BookMarked className="size-4" /> Catálogo sempre atualizado</li>
            <li className="flex items-center gap-2"><Clock className="size-4" /> Prazos e lembretes automáticos</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4" /> Acesso seguro com Google ou senha</li>
          </ul>
        </div>
        <p className="relative text-xs text-primary-foreground/60">© {new Date().getFullYear()} LaBiblio</p>
      </aside>

      <div className="flex items-center justify-center bg-background p-4 sm:p-8">
      <Card className="w-full max-w-sm border-0 bg-transparent shadow-none ring-0 sm:border sm:bg-card sm:shadow-lg sm:ring-1">
        <div className="flex items-center justify-center gap-2 pt-2 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">LaBiblio</span>
        </div>
        {tela === "reset" ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">Redefinir senha</CardTitle>
              <CardDescription>
                Enviaremos um código para o seu email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResetSenha />
              <button
                type="button"
                onClick={() => setTela("login")}
                className="mt-6 w-full text-center text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Voltar para o login
              </button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {step === "signIn" ? "Entrar" : "Criar conta"}
              </CardTitle>
              <CardDescription>
                {step === "signIn"
                  ? "Acesse sua conta para continuar"
                  : "Preencha os dados para criar sua conta"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accountCreated && (
                <Notifications
                  title="Cadastrado"
                  description={"Cadastrado com sucesso"}
                  variant="default"
                  onClose={() => setAccountCreated(false)}
                />
              )}

              {error && (
                <Notifications
                  title="Erro"
                  description={error}
                  variant="destructive"
                  onClose={() => setError(null)}
                />
              )}

              <form
                className="flex flex-col gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const submittedStep = step;
                  setError(null);
                  void signIn("password", formData)
                    .then(() => {
                      if (submittedStep === "signUp") {
                        setAccountCreated(true);
                        setStep("signIn");
                      }
                    })
                    .catch((err) => {
                            const message = String(err?.message ?? "");
                      if (message.includes("InvalidAccountId")) {
                        setError("Email não cadastrado.");
                      } else if (message.includes("InvalidSecret")) {
                        setError("Senha incorreta.");
                      } else {
                        setError("Não foi possível concluir. Tente novamente.");
                      }
                    });
                }}
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <input name="flow" type="hidden" value={step} />
                <Button type="submit" className="mt-1 w-full">
                  {step === "signIn" ? "Entrar" : "Criar conta"}
                </Button>
              </form>

              {step === "signIn" && (
                <button
                  type="button"
                  onClick={() => setTela("reset")}
                  className="mt-3 w-full text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
                >
                  Esqueci minha senha
                </button>
              )}

              <div className="mt-4 flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">ou</span>
                <Separator className="flex-1" />
              </div>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => void signIn("google")}
              >
                <GoogleIcon className="size-4" />
                Entrar com Google
              </Button>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {step === "signIn" ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                <button
                  type="button"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                  onClick={() => {
                    setAccountCreated(false);
                    setStep(step === "signIn" ? "signUp" : "signIn");
                  }}
                >
                  {step === "signIn" ? "Criar conta" : "Entrar"}
                </button>
              </p>
            </CardContent>
          </>
        )}
      </Card>
      </div>
    </div>
  );
}

function GoogleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}