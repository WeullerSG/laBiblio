import { TableHead, TableRow } from "@/components/ui/table";

export function TableHeadAlunos() {
  return (
    <TableRow className="bg-muted/50 hover:bg-muted/50">
      <TableHead>Aluno</TableHead>
      <TableHead className="hidden sm:table-cell">Matrícula</TableHead>
      <TableHead className="hidden md:table-cell">Data de Nasc.</TableHead>
      <TableHead className="hidden lg:table-cell">Endereço</TableHead>
      <TableHead className="w-16 text-right">Ações</TableHead>
    </TableRow>
  );
}
