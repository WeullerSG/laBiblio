import { useState } from "react";
import { useMutation } from "convex/react";
import { History, Undo2 } from "lucide-react";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyTableRow } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeletonRows } from "@/pages/books/components/ListBooks";
import { Notifications } from "@/services/notifications";
import { cn, formatDate } from "@/lib/utils";

export type RentalRow = {
  key: string;
  rental: Doc<"alugueis">;
  book: Doc<"books">;
  open: boolean;
  late: boolean;
};

type Toast = { title: string; description: string; variant: "default" | "destructive" };

export function ListAlugueis({ rows, loading }: { rows: RentalRow[]; loading?: boolean }) {
  const [selected, setSelected] = useState<Set<Id<"books">>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const returnBook = useMutation(api.books.returnBook);

  const toggle = (id: Id<"books">) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  async function handleReturn() {
    if (selected.size === 0) return;
    setSubmitting(true);
    try {
      await Promise.all(Array.from(selected).map((id) => returnBook({ id })));
      setToast({
        title: "Devolução registrada",
        description: `${selected.size} livro(s) devolvido(s). Obrigado!`,
        variant: "default",
      });
      setSelected(new Set());
    } catch (error) {
      console.error("Erro ao devolver livros:", error);
      setToast({
        title: "Erro",
        description: "Não foi possível devolver os livros. Tente novamente.",
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
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {selected.size > 0
              ? `${selected.size} livro(s) selecionado(s)`
              : "Selecione os livros em aberto para devolver"}
          </p>
          <Button
            size="sm"
            onClick={handleReturn}
            disabled={selected.size === 0 || submitting}
            className="gap-2"
          >
            <Undo2 className="size-4" />
            {submitting ? "Devolvendo..." : "Devolver"}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-12" />
                <TableHead>Livro</TableHead>
                <TableHead className="hidden sm:table-cell">Retirada</TableHead>
                <TableHead>Devolução</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeletonRows cols={5} />
              ) : rows.length === 0 ? (
                <EmptyTableRow
                  colSpan={5}
                  icon={History}
                  title="Nenhum empréstimo"
                  description="Quando você alugar um livro no catálogo, ele aparece aqui."
                />
              ) : (
                rows.map(({ key, rental, book, open, late }) => (
                  <TableRow
                    key={key}
                    onClick={() => open && toggle(book._id)}
                    className={cn(open ? "cursor-pointer" : "text-muted-foreground")}
                  >
                    <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(book._id)}
                        disabled={!open}
                        onCheckedChange={() => toggle(book._id)}
                        aria-label={`Selecionar ${book.title}`}
                      />
                    </TableCell>
                    <TableCell className="max-w-64">
                      <p className="truncate font-medium text-foreground" title={book.title}>
                        {book.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{book.author}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(rental.data_retirada)}
                    </TableCell>
                    <TableCell className={cn(late && "font-medium text-red-600")}>
                      {formatDate(rental.data_devolucao)}
                    </TableCell>
                    <TableCell>
                      {late ? (
                        <StatusBadge variant="danger">Atrasado</StatusBadge>
                      ) : open ? (
                        <StatusBadge variant="warning">Em aberto</StatusBadge>
                      ) : (
                        <StatusBadge variant="success">Devolvido</StatusBadge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
