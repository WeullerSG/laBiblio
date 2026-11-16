import { useState } from "react";
import { useMutation } from "convex/react";
import { BookOpen } from "lucide-react";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyTableRow } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RowActions } from "@/components/shared/RowActions";
import { ConfirmDeleteDialog, DetailsDialog } from "@/components/shared/DetailsDialog";
import { TableHeadBooks } from "./TableHead";
import { AddBooks } from "./AddBooks";

export function BookStatus({ available }: { available: boolean }) {
  return available ? (
    <StatusBadge variant="success">Disponível</StatusBadge>
  ) : (
    <StatusBadge variant="warning">Emprestado</StatusBadge>
  );
}

function BookRow({ book }: { book: Doc<"books"> }) {
  const remove = useMutation(api.model.books.mutation.delet);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <TableRow>
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
        <TableCell className="text-right">
          <RowActions
            onView={() => setViewOpen(true)}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
        </TableCell>
      </TableRow>

      <AddBooks books={book} open={editOpen} onOpenChange={setEditOpen} />
      <DetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        title={book.title}
        subtitle={book.author}
        fields={[
          { label: "ISBN", value: book.isbn },
          { label: "Ano", value: book.year },
          { label: "Status", value: <BookStatus available={book.available} /> },
        ]}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entity="livro"
        name={book.title}
        onConfirm={() => void remove({ id: book._id })}
      />
    </>
  );
}

export function TableSkeletonRows({ cols, rows = 4 }: { cols: number; rows?: number }) {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i} className="hover:bg-transparent">
      {Array.from({ length: cols }).map((_, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full max-w-32" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function ListBooks({ books, loading }: { books: Doc<"books">[]; loading?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableHeadBooks />
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeletonRows cols={6} />
            ) : books.length === 0 ? (
              <EmptyTableRow
                colSpan={6}
                icon={BookOpen}
                title="Nenhum livro encontrado"
                description="Cadastre um novo livro ou ajuste a busca."
              />
            ) : (
              books.map((book) => <BookRow key={book._id} book={book} />)
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
