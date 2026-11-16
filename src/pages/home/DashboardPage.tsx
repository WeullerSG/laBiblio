import { AppLayout } from "@/components/shared/AppLayout";
import { routes } from "@/router";

export function Dashboard() {
  return <AppLayout routes={routes} roleLabel="Painel do colaborador" />;
}
