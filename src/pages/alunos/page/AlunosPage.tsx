import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { BookX, GraduationCap, Sparkles, Users } from "lucide-react";
import { api } from "@convex/_generated/api";
import { useNow } from "@/hooks/use-now";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SearchInput } from "@/components/shared/SearchInput";
import { AddAluno } from "../components/AddAluno";
import { ListAlunos } from "../components/ListAlunos";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export function AlunosPage() {
  const now = useNow();
  const [search, setSearch] = useState("");
  const alunos = useQuery(api.alunos.list);
  const books = useQuery(api.model.books.query.list);
  const alugueis = useQuery(api.model.alugueis.query.list);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (alunos ?? []).filter(
      (a) =>
        a.nome.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.matricula ?? "").toLowerCase().includes(q),
    );
  }, [alunos, search]);

  const recent = alunos?.filter((a) => now - a._creationTime < THIRTY_DAYS).length;

  const unavailable = new Set(books?.filter((b) => !b.available).map((b) => b._id));
  const comEmprestimo =
    alugueis && books
      ? new Set(
          alugueis
            .filter((a) => a.id_book.some((id) => unavailable.has(id)))
            .map((a) => a.id_aluno),
        ).size
      : undefined;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={GraduationCap}
        title="Alunos"
        description="Cadastre e gerencie os alunos da biblioteca"
        action={<AddAluno />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total de alunos" value={alunos?.length} icon={Users} />
        <StatCard label="Com empréstimo ativo" value={comEmprestimo} icon={BookX} tone="amber" />
        <StatCard label="Novos (30 dias)" value={recent} icon={Sparkles} tone="violet" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nome, e-mail ou matrícula..."
          />
          <span className="text-xs text-muted-foreground">
            {filtered.length} de {alunos?.length ?? 0} alunos
          </span>
        </div>
        <ListAlunos listAlunos={filtered} loading={alunos === undefined} />
      </div>
    </div>
  );
}
