import { useState } from "react";
import { useMutation } from "convex/react";
import { Briefcase } from "lucide-react";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyTableRow } from "@/components/shared/EmptyState";
import { RowActions } from "@/components/shared/RowActions";
import { PersonCell } from "@/components/shared/PersonCell";
import { ConfirmDeleteDialog, DetailsDialog } from "@/components/shared/DetailsDialog";
import { TableSkeletonRows } from "@/pages/books/components/ListBooks";
import { TableHeadColaboradores } from "./TableHeadColaboradores";
import { AddColaborador } from "./AddColaborador";

function ColaboradorRow({ colaborador }: { colaborador: Doc<"colaboradores"> }) {
  const remove = useMutation(api.model.colaboradores.mutation.deleteColaborador);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="max-w-64">
          <PersonCell name={colaborador.nome} subtitle={colaborador.cargo || "Sem cargo"} />
        </TableCell>
        <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
          {colaborador.matricula || "-"}
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">
          {colaborador.data_nascimento || "-"}
        </TableCell>
        <TableCell
          className="hidden max-w-56 truncate text-muted-foreground lg:table-cell"
          title={colaborador.endereco}
        >
          {colaborador.endereco || "-"}
        </TableCell>
        <TableCell className="text-right">
          <RowActions
            onView={() => setViewOpen(true)}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setDeleteOpen(true)}
          />
        </TableCell>
      </TableRow>

      <AddColaborador colaborador={colaborador} open={editOpen} onOpenChange={setEditOpen} />
      <DetailsDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        title={colaborador.nome}
        subtitle={colaborador.cargo}
        fields={[
          { label: "Matrícula", value: colaborador.matricula },
          { label: "Data de nascimento", value: colaborador.data_nascimento },
          { label: "Endereço", value: colaborador.endereco },
        ]}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entity="colaborador"
        name={colaborador.nome}
        onConfirm={() => void remove({ id: colaborador._id })}
      />
    </>
  );
}

export function ListColaboradores({
  listColaboradores,
  loading,
}: {
  listColaboradores: Doc<"colaboradores">[];
  loading?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableHeadColaboradores />
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeletonRows cols={5} />
            ) : listColaboradores.length === 0 ? (
              <EmptyTableRow
                colSpan={5}
                icon={Briefcase}
                title="Nenhum colaborador encontrado"
                description="Cadastre um novo colaborador ou ajuste a busca."
              />
            ) : (
              listColaboradores.map((c) => <ColaboradorRow key={c._id} colaborador={c} />)
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
