import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface AddAlunoProps {
  aluno?: Doc<"alunos">;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

const emptyForm = {
  nome: "",
  email: "",
  matricula: "",
  data_nascimento: "",
  endereco: "",
};

export function AddAluno({
  aluno,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onClose,
}: AddAlunoProps) {
  const create = useMutation(api.model.alunos.mutation.registerAluno);
  const update = useMutation(api.model.alunos.mutation.updateAluno);

  const [form, setForm] = useState(emptyForm);
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled
    ? (value: boolean) => externalOnOpenChange?.(value)
    : setInternalOpen;

  useEffect(() => {
    if (open && aluno) {
      setForm({
        nome: aluno.nome ?? "",
        email: aluno.email ?? "",
        matricula: aluno.matricula ?? "",
        data_nascimento: aluno.data_nascimento ?? "",
        endereco: aluno.endereco ?? "",
      });
    } else if (!open && !aluno) {
      setForm(emptyForm);
    }
  }, [open, aluno]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (aluno) {
        await update({
          id: aluno._id,
          nome: form.nome,
          email: form.email,
          matricula: form.matricula,
          data_nascimento: form.data_nascimento,
          endereco: form.endereco,
        });
        setOpen(false);
        onClose?.();
      } else {
        await create({
          nome: form.nome,
          email: form.email,
          matricula: form.matricula,
          data_nascimento: form.data_nascimento,
          endereco: form.endereco,
        });
        setForm(emptyForm);
        setOpen(false);
        onClose?.();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger
          render={
            <Button className="w-full gap-2 shadow-sm sm:w-auto">
              <Plus className="size-4" />
              Adicionar Aluno
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh] overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-lg font-semibold">
            {aluno ? "Editar Aluno" : "Novo Aluno"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2.5 min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                name="matricula"
                value={form.matricula}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                name="data_nascimento"
                type="date"
                value={form.data_nascimento}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : aluno ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
