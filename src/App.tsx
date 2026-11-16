// src/App.tsx
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { BookOpen, UserX } from "lucide-react";
import { api } from "../convex/_generated/api";
import { SignIn } from "./pages/login/SignIn";
import { Dashboard } from "./pages/home/DashboardPage";
import { AlunoApp } from "./alunosPages/aluno/AlunoApp";
import { Button } from "./components/ui/button";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="flex size-12 animate-pulse items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
        <BookOpen className="size-6" />
      </div>
      <p className="text-sm text-muted-foreground">Carregando LaBiblio...</p>
    </div>
  );
}

function AreaLogada() {
  const { signOut } = useAuthActions();
  const colaborador = useQuery(api.model.colaboradores.query.currentColaborador);
  const aluno = useQuery(api.model.alunos.query.currentAluno);

  if (colaborador === undefined || aluno === undefined) {
    return <FullScreenLoader />;
  }

  if (colaborador) return <Dashboard />;
  if (aluno) return <AlunoApp />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
          <UserX className="size-6" />
        </div>
        <h1 className="text-lg font-semibold">Cadastro não encontrado</h1>
        <p className="text-sm text-muted-foreground">
          Sua conta ainda não está vinculada a um aluno ou colaborador. Procure a
          equipe da biblioteca para concluir o cadastro.
        </p>
        <Button className="mt-2 w-full" variant="outline" onClick={() => void signOut()}>
          Voltar para o login
        </Button>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <AuthLoading>
        <FullScreenLoader />
      </AuthLoading>
      <Authenticated>
        <AreaLogada />
      </Authenticated>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
    </>
  );
}

export default App;
