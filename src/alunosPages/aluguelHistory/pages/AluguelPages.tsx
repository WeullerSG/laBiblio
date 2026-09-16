import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { ListAlugueis } from "../components/ListAlugueis";

export function AluguelPages() {
  const [search, setSearch] = useState("");
  const alugados = useQuery(api.model.alugueis.query.list) || [];

  const listBooks = useQuery(api.model.books.query.list) || [];

  const livrosRented = listBooks.filter((book) => alugados.some((aluguel)=> aluguel.id_book.includes(book._id)))  


  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Livros alugados
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie os livros alugados e devolvidos
          </p>
        </div>
        {/* <AddBooks /> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meus livros em aberto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{livrosRented.length}</span>
          </CardContent>
        </Card>
      </div>
      <Input
        placeholder="Buscar por título..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs"
      />
      <Separator />
      <ListAlugueis books={listBooks} rented={alugados} />
    </div>
  );
}
