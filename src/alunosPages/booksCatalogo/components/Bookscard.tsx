import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { BookOpen, Eye, ShoppingBag, X } from "lucide-react";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { TableHeadBooks } from "@/pages/books/components/TableHead";
import { BookStatus, TableSkeletonRows } from "@/pages/books/components/ListBooks";
import { EmptyTableRow } from "@/components/shared/EmptyState";
import { Notifications } from "@/services/notifications";
import { cn } from "@/lib/utils";
import { BooksDetails } from "./BookDetails";

const MAX_BOOKS = 3;

type Toast = { title: string; description: string; variant: "default" | "destructive" };

interface BookProps {
  books: Doc<"books">[];
  loading?: boolean;
}

export function BooksCard({ books, loading }: BookProps) {
  const rentBooks = useMutation(api.alugueis.RentBooks);
  const aluno = useQuery(api.alunos.currentAluno);

  const [selectedBook, setSelectedBook] = useState<Doc<"books"> | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<Id<"books">>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const toggleRow = (book: Doc<"books">) => {
    if (!book.available) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(book._id)) {
        next.delete(book._id);
      } else if (next.size >= MAX_BOOKS) {
        setToast({
          title: "Limite atingido",
          description: `Você pode selecionar até ${MAX_BOOKS} livros por vez.`,
          variant: "destructive",
        });
        return prev;
      } else {
        next.add(book._id);
      }
      return next;
    });
  };

  async function handleRentBooks() {
    if (!aluno || selected.size === 0) return;
    setSubmitting(true);
    try {
      await rentBooks({ id_book: Array.from(selected), id_aluno: aluno._id });
      setToast({
        title: "Empréstimo confirmado!",
        description: "Você tem 7 dias para devolver. Enviamos os detalhes por e-mail.",
        variant: "default",
      });
      setSelected(new Set());
    } catch (error) {
      console.error("Erro ao alugar livros:", error);
      setToast({
        title: "Erro",
        description: "Não foi possível concluir o empréstimo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {toast && <Notifications {...toast} onClose={() => setToast(null)} />}

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableHeadBooks selectable />
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeletonRows cols={7} />
              ) : books.length === 0 ? (
                <EmptyTableRow
                  colSpan={7}
                  icon={BookOpen}
                  title="Nenhum livro encontrado"
                  description="Tente buscar por outro título ou autor."
                />
              ) : (
                books.map((book) => {
                  const isSelected = selected.has(book._id);
                  return (
                    <TableRow
                      key={book._id}
                      onClick={() => toggleRow(book)}
                      data-state={isSelected ? "selected" : undefined}
                      className={cn(
                        book.available ? "cursor-pointer" : "opacity-60",
                        isSelected && "bg-primary/5 hover:bg-primary/10",
                      )}
                    >
                      <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          disabled={!book.available}
                          onCheckedChange={() => toggleRow(book)}
                          aria-label={`Selecionar ${book.title}`}
                        />
                      </TableCell>
                      <TableCell className="max-w-56 truncate font-medium" title={book.title}>
                        {book.title}
                      </TableCell>
                      <TableCell className="max-w-48 truncate text-muted-foreground" title={book.author}>
                        {book.author}
                      </TableCell>
                      <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                        {book.isbn || "-"}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {book.year || "-"}
                      </TableCell>
                      <TableCell>
                        <BookStatus available={book.available} />
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="Ver detalhes"
                          onClick={() => {
                            setSelectedBook(book);
                            setOpen(true);
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Barra flutuante de seleção */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-4 z-40 mx-auto w-[calc(100%-2rem)] max-w-xl transition-all duration-300",
          selected.size > 0
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <div className="flex items-center gap-3 rounded-2xl border bg-card/95 p-3 pl-4 shadow-xl backdrop-blur">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {selected.size}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              {selected.size} de {MAX_BOOKS} livros selecionados
            </p>
            <p className="text-xs text-muted-foreground">Devolução em 7 dias</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSelected(new Set())} aria-label="Limpar seleção">
            <X className="size-4" />
          </Button>
          <Button onClick={handleRentBooks} disabled={submitting || !aluno} className="gap-2">
            <ShoppingBag className="size-4" />
            {submitting ? "Confirmando..." : "Alugar"}
          </Button>
        </div>
      </div>

      {selectedBook && (
        <BooksDetails Books={selectedBook} open={open} onOpenChange={setOpen} />
      )}
    </>
  );
}
