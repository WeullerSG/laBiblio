import { useState } from "react";
import { useMutation } from "convex/react";
import { GraduationCap } from "lucide-react";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyTableRow } from "@/components/shared/EmptyState";
import { RowActions } from "@/components/shared/RowActions";
import { PersonCell } from "@/components/shared/PersonCell";
import { ConfirmDeleteDialog, DetailsDialog } from "@/components/shared/DetailsDialog";
import { TableSkeletonRows } from "@/pages/books/components/ListBooks";
import { TableHeadAlunos } from "./TableHeadAlunos";
import { AddAluno } from "./AddAluno";

function AlunoRow({ aluno }: { aluno: Doc<"alunos"> }) {
  const remove = useMutation(api.model.alunos.mutation.deleteAluno);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="max-w-64">
          <PersonCell name={aluno.nome} subtitle={aluno.email} />
        </TableCell>
        <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
          {aluno.matricula || "-"}
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">
          {aluno.data_nascimento || "-"}
        </TableCell>
        <TableCell
          className="hidden max-w-56 truncate text-muted-foreground lg:table-cell"
          title={aluno.endereco}
        >
          {aluno.endereco || "-"}
        </TableCell>
        <TableCell className="text-right">
          <RowActions
            onView={() => setViewOpen(true)}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
        </TableCell>
      </TableRow>

      <AddAluno aluno={aluno} open={editOpen} onOpenChange={setEditOpen} />
      <DetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        title={aluno.nome}
        subtitle={aluno.email}
        fields={[
          { label: "Matrícula", value: aluno.matricula },
          { label: "Data de nascimento", value: aluno.data_nascimento },
          { label: "Endereço", value: aluno.endereco },
        ]}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entity="aluno"
        name={aluno.nome}
        onConfirm={() => void remove({ id: aluno._id })}
      />
    </>
  );
}

export function ListAlunos({
  listAlunos,
  loading,
}: {
  listAlunos: Doc<"alunos">[];
  loading?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableHeadAlunos />
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeletonRows cols={5} />
            ) : listAlunos.length === 0 ? (
              <EmptyTableRow
                colSpan={5}
                icon={GraduationCap}
                title="Nenhum aluno encontrado"
                description="Cadastre um novo aluno ou ajuste a busca."
              />
            ) : (
              listAlunos.map((aluno) => <AlunoRow key={aluno._id} aluno={aluno} />)
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
