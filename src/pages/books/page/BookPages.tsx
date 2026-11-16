import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { BookCheck, BookOpen, BookX, LibraryBig, Sparkles } from "lucide-react";
import { api } from "@convex/_generated/api";
import { useNow } from "@/hooks/use-now";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SearchInput } from "@/components/shared/SearchInput";
import { AddBooks } from "../components/AddBooks";
import { ListBooks } from "../components/ListBooks";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export function BookPages() {
  const now = useNow();
  const [search, setSearch] = useState("");
  const books = useQuery(api.model.books.query.list);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (books ?? []).filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.isbn ?? "").toLowerCase().includes(q),
    );
  }, [books, search]);

  const recent = books?.filter((b) => now - b._creationTime < THIRTY_DAYS).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={LibraryBig}
        title="Livros"
        description="Gerencie o acervo da biblioteca"
        action={<AddBooks />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total de livros" value={books?.length} icon={BookOpen} />
        <StatCard
          label="Disponíveis"
          value={books?.filter((b) => b.available).length}
          icon={BookCheck}
          tone="blue"
        />
        <StatCard
          label="Emprestados"
          value={books?.filter((b) => !b.available).length}
          icon={BookX}
          tone="amber"
        />
        <StatCard
          label="Adicionados (30 dias)"
          value={recent}
          icon={Sparkles}
          tone="violet"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por título, autor ou ISBN..."
          />
          <span className="text-xs text-muted-foreground">
            {filtered.length} de {books?.length ?? 0} livros
          </span>
        </div>
        <ListBooks books={filtered} loading={books === undefined} />
      </div>
    </div>
  );
}
