import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { Briefcase, Layers, Sparkles, Users } from "lucide-react";
import { api } from "@convex/_generated/api";
import { useNow } from "@/hooks/use-now";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SearchInput } from "@/components/shared/SearchInput";
import { AddColaborador } from "../components/AddColaborador";
import { ListColaboradores } from "../components/ListColaboradores";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export function ColaboradoresPage() {
  const now = useNow();
  const [search, setSearch] = useState("");
  const colaboradores = useQuery(api.colaboradores.list);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (colaboradores ?? []).filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        (c.cargo ?? "").toLowerCase().includes(q) ||
        (c.matricula ?? "").toLowerCase().includes(q),
    );
  }, [colaboradores, search]);

  const recent = colaboradores?.filter(
    (c) => now - c._creationTime < THIRTY_DAYS,
  ).length;
  const cargos = colaboradores
    ? new Set(colaboradores.map((c) => c.cargo).filter(Boolean)).size
    : undefined;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={Briefcase}
        title="Colaboradores"
        description="Equipe com acesso ao painel administrativo"
        action={<AddColaborador />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total de colaboradores" value={colaboradores?.length} icon={Users} />
        <StatCard label="Cargos diferentes" value={cargos} icon={Layers} tone="blue" />
        <StatCard label="Novos (30 dias)" value={recent} icon={Sparkles} tone="violet" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nome, cargo ou matrícula..."
          />
          <span className="text-xs text-muted-foreground">
            {filtered.length} de {colaboradores?.length ?? 0} colaboradores
          </span>
        </div>
        <ListColaboradores
          listColaboradores={filtered}
          loading={colaboradores === undefined}
        />
      </div>
    </div>
  );
}
