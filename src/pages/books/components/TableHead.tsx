import { TableHead, TableRow } from "@/components/ui/table";

export function TableHeadBooks() {
  return (
    <TableRow>
      <TableHead className="w-12"></TableHead>
      <TableHead className="w-48">Titulo</TableHead>
      <TableHead className="w-52">Autor</TableHead>
      <TableHead className="w-36">Isbn</TableHead>
      <TableHead className="w-24">Ano</TableHead>
      <TableHead className="w-28">Disponível</TableHead>
      <TableHead className="w-16 text-center">Ações</TableHead>
    </TableRow>
  );
}
