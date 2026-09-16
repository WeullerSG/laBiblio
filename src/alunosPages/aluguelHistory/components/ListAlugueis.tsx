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
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";

function formatDate(value: string): string {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface RentedBooksProps {
  books: Doc<"books">[];
  rented: Doc<"alugueis">[];
}

export function ListAlugueis({ books, rented }: RentedBooksProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const returnBook = useMutation(api.books.returnBook);

  const livrosRented = books.filter((book) =>
    rented.some((aluguel) => aluguel.id_book.includes(book._id)),
  );

  const toggleRow = (bookId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  async function handleBooksReturnd() {
    if (selectedRows.size === 0) {
      alert("Selecione pelo menos um livro para devolver.");
      return;
    }
    try {
      await Promise.all(
        Array.from(selectedRows).map((bookId) => returnBook({ id: bookId as any})),
      );
      alert("Livros devolvidos com sucesso!");
      setSelectedRows(new Set());
    } catch (error) {
      console.error("Erro ao devolver livros:", error);
      alert("Ocorreu um erro ao devovler os livros. Tente novamente.");
    }
  }

  return (
    <>
      <div>
        <Button onClick={handleBooksReturnd}>Devolver Livros</Button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-36">Retirada</TableHead>
              <TableHead className="w-52">Titulo</TableHead>
              <TableHead className="w-52">Autor</TableHead>
              <TableHead className="w-36">Devolução</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {livrosRented.map((book) => {
              const rentalData = rented.find((aluguel) =>
                aluguel.id_book.includes(book._id),
              );

              if (!rentalData) return null;

              return (
                <TableRow key={book._id} className="cursor-pointer">
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selectedRows.has(book._id)}
                      onCheckedChange={() => toggleRow(book._id)}
                    />
                  </TableCell>
                  <TableCell className="w-36 truncate max-w-36" title={formatDate(rentalData.data_retirada)}>
                    {formatDate(rentalData.data_retirada)}
                  </TableCell>
                  <TableCell className="w-52 truncate max-w-52" title={book.title}>
                    {book.title}
                  </TableCell>
                  <TableCell className="w-52 truncate max-w-52" title={book.author}>
                    {book.author}
                  </TableCell>
                  <TableCell
                    className={`w-36 truncate max-w-36 ${
                      new Date(rentalData.data_devolucao as any).getTime() > Date.now()
                        ? ""
                        : book.available === true ? "text-green-600" : "text-red-600"
                    }`}
                    title={formatDate(rentalData.data_devolucao)}
                  >
                    {formatDate(rentalData.data_devolucao)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
