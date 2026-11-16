import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { BookMarked } from "lucide-react";
import { api } from "@convex/_generated/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { cn } from "@/lib/utils";
import { BooksCard } from "../components/Bookscard";

type Filter = "all" | "available" | "rented";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "available", label: "Disponíveis" },
  { value: "rented", label: "Emprestados" },
];

export function BookCatalogoPage() {
  const books = useQuery(api.books.list);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (books ?? []).filter((b) => {
      const matches =
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const status =
        filter === "all" || (filter === "available" ? b.available : !b.available);
      return matches && status;
    });
  }, [books, search, filter]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={BookMarked}
        title="Catálogo de livros"
        description="Selecione até 3 livros disponíveis e confirme o empréstimo"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por título ou autor..."
        />
        <div className="inline-flex rounded-lg border bg-card p-1 shadow-sm">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                filter === f.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <BooksCard books={filtered} loading={books === undefined} />
    </div>
  );
}
