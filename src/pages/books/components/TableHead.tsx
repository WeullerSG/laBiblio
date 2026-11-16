import { TableHead, TableRow } from "@/components/ui/table";

export function TableHeadBooks({ selectable = false }: { selectable?: boolean }) {
  return (
    <TableRow className="bg-muted/50 hover:bg-muted/50">
      {selectable && <TableHead className="w-12" />}
      <TableHead>Título</TableHead>
      <TableHead>Autor</TableHead>
      <TableHead className="hidden md:table-cell">ISBN</TableHead>
      <TableHead className="hidden sm:table-cell">Ano</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="w-16 text-right">Ações</TableHead>
    </TableRow>
  );
}
