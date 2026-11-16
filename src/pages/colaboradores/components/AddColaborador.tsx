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

interface AddColaboradorProps {
  colaborador?: Doc<"colaboradores">;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

const emptyForm = {
  nome: "",
  matricula: "",
  data_nascimento: "",
  endereco: "",
  cargo: "",
};

export function AddColaborador({
  colaborador,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onClose,
}: AddColaboradorProps) {
  const create = useMutation(api.colaboradores.registerColaborador);
  const update = useMutation(api.colaboradores.updateColaborador);

  const [form, setForm] = useState(emptyForm);
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled
    ? (value: boolean) => externalOnOpenChange?.(value)
    : setInternalOpen;

  useEffect(() => {
    if (open && colaborador) {
      setForm({
        nome: colaborador.nome ?? "",
        matricula: colaborador.matricula ?? "",
        data_nascimento: colaborador.data_nascimento ?? "",
        endereco: colaborador.endereco ?? "",
        cargo: colaborador.cargo ?? "",
      });
    } else if (!open && !colaborador) {
      setForm(emptyForm);
    }
  }, [open, colaborador]);

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
      if (colaborador) {
        await update({
          id: colaborador._id,
          nome: form.nome,
          matricula: form.matricula,
          data_nascimento: form.data_nascimento,
          endereco: form.endereco,
          cargo: form.cargo,
        });
        setOpen(false);
        onClose?.();
      } else {
        await create({
          nome: form.nome,
          matricula: form.matricula,
          data_nascimento: form.data_nascimento,
          endereco: form.endereco,
          cargo: form.cargo,
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
              Adicionar Colaborador
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh] overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-lg font-semibold">
            {colaborador ? "Editar Colaborador" : "Novo Colaborador"}
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
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              name="cargo"
              value={form.cargo}
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
              {loading ? "Salvando..." : colaborador ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}