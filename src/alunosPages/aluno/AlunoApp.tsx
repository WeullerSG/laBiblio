import { AppLayout } from "@/components/shared/AppLayout";
import { alunoRoutes } from "@/routerAluno";

export function AlunoApp() {
  return <AppLayout routes={alunoRoutes} roleLabel="Área do aluno" />;
}
