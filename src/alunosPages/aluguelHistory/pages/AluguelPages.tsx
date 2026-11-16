import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { AlertTriangle, BookCheck, BookOpen, History } from "lucide-react";
import { api } from "@convex/_generated/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SearchInput } from "@/components/shared/SearchInput";
import { ListAlugueis, type RentalRow } from "../components/ListAlugueis";

export function AluguelPages() {
  const [search, setSearch] = useState("");
  const aluno = useQuery(api.alunos.currentAluno);
  const alugueis = useQuery(api.model.alugueis.query.list);
  const books = useQuery(api.model.books.query.list);

  const loading = aluno === undefined || alugueis === undefined || books === undefined;

  // Uma linha por (empréstimo, livro). O mais recente de cada livro é o que vale.
  const rows = useMemo<RentalRow[]>(() => {
    if (!aluno || !alugueis || !books) return [];
    const bookById = new Map(books.map((b) => [b._id, b]));
    const latestRentalOfBook = new Map<string, string>();
    for (const a of [...alugueis].sort((x, y) => x._creationTime - y._creationTime)) {
      for (const id of a.id_book) latestRentalOfBook.set(id, a._id);
    }
    return alugueis
      .filter((a) => a.id_aluno === aluno._id)
      .flatMap((a) =>
        a.id_book.flatMap((id) => {
          const book = bookById.get(id);
          if (!book) return [];
          const open = !book.available && latestRentalOfBook.get(id) === a._id;
          const late =
            open && !!a.data_devolucao && new Date(a.data_devolucao).getTime() < Date.now();
          return [{ key: `${a._id}-${id}`, rental: a, book, open, late }];
        }),
      )
      .sort((x, y) => y.rental._creationTime - x.rental._creationTime);
  }, [aluno, alugueis, books]);

  const filtered = rows.filter(
    (r) =>
      r.book.title.toLowerCase().includes(search.toLowerCase()) ||
      r.book.author.toLowerCase().includes(search.toLowerCase()),
  );

  const abertos = loading ? undefined : rows.filter((r) => r.open).length;
  const atrasados = loading ? undefined : rows.filter((r) => r.late).length;
  const devolvidos = loading ? undefined : rows.filter((r) => !r.open).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={History}
        title="Meus empréstimos"
        description="Acompanhe seus livros e faça as devoluções"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Em aberto" value={abertos} icon={BookOpen} tone="amber" />
        <StatCard label="Atrasados" value={atrasados} icon={AlertTriangle} tone="red" />
        <StatCard label="Devolvidos" value={devolvidos} icon={BookCheck} />
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por título ou autor..." />

      <ListAlugueis rows={filtered} loading={loading} />
    </div>
  );
}
