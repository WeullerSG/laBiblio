import { useQuery } from "convex/react";
import {
  AlertTriangle,
  BookCheck,
  BookOpen,
  BookX,
  Clock,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { api } from "@convex/_generated/api";
import { useNow } from "@/hooks/use-now";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

export function HomePage() {
  const now = useNow();
  const books = useQuery(api.model.books.query.list);
  const alunos = useQuery(api.alunos.list);
  const alugueis = useQuery(api.model.alugueis.query.list);

  const total = books?.length;
  const disponiveis = books?.filter((b) => b.available).length;
  const emprestados = books?.filter((b) => !b.available).length;

  const bookById = new Map(books?.map((b) => [b._id, b]));
  const alunoById = new Map(alunos?.map((a) => [a._id, a]));

  // Empréstimo "em aberto" = ainda tem pelo menos um livro indisponível
  const abertos = (alugueis ?? []).filter((a) =>
    a.id_book.some((id) => bookById.get(id)?.available === false),
  );
  const atrasados = abertos.filter(
    (a) => a.data_devolucao && new Date(a.data_devolucao).getTime() < now,
  );
  const recentes = [...(alugueis ?? [])]
    .sort((a, b) => b._creationTime - a._creationTime)
    .slice(0, 6);

  const ocupacao = total ? Math.round(((emprestados ?? 0) / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="Visão geral do acervo e dos empréstimos"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Livros no acervo" value={total} icon={BookOpen} />
        <StatCard label="Disponíveis" value={disponiveis} icon={BookCheck} tone="blue" />
        <StatCard
          label="Emprestados"
          value={emprestados}
          icon={BookX}
          tone="amber"
          hint={total ? `${ocupacao}% do acervo em uso` : undefined}
        />
        <StatCard label="Alunos" value={alunos?.length} icon={Users} tone="violet" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-xl border bg-card shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold">Empréstimos recentes</h2>
              <p className="text-xs text-muted-foreground">Últimas retiradas registradas</p>
            </div>
            <Clock className="size-4 text-muted-foreground" />
          </div>
          {alugueis && recentes.length === 0 ? (
            <EmptyState
              title="Nenhum empréstimo"
              description="Os empréstimos feitos pelos alunos aparecem aqui."
            />
          ) : (
            <ul className="divide-y">
              {recentes.map((a) => {
                const titles = a.id_book.map(
                  (id) => bookById.get(id)?.title ?? "Livro removido",
                );
                const aluno = alunoById.get(a.id_aluno);
                return (
                  <li key={a._id} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {aluno?.nome?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{titles.join(", ")}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {aluno?.nome ?? "Aluno"} · retirado em {formatDate(a.data_retirada)}
                      </p>
                    </div>
                    {atrasados.includes(a) ? (
                      <StatusBadge variant="danger">Atrasado</StatusBadge>
                    ) : abertos.includes(a) ? (
                      <StatusBadge variant="warning">
                        Até {formatDate(a.data_devolucao)}
                      </StatusBadge>
                    ) : (
                      <StatusBadge variant="success">Devolvido</StatusBadge>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Ocupação do acervo</h2>
            <p className="text-xs text-muted-foreground">Livros emprestados vs. disponíveis</p>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${ocupacao}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{emprestados ?? 0} emprestados</span>
              <span>{disponiveis ?? 0} disponíveis</span>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-red-500" />
              <h2 className="font-semibold">Devoluções atrasadas</h2>
            </div>
            {atrasados.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Nenhum atraso no momento.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {atrasados.slice(0, 5).map((a) => (
                  <li key={a._id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">
                      {alunoById.get(a.id_aluno)?.nome ?? "Aluno"}
                    </span>
                    <span className="shrink-0 text-xs text-red-600">
                      {formatDate(a.data_devolucao)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
