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

interface AddBooksProps {
  books?: Doc<"books">;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

const emptyForm = {
  title: "",
  author: "",
  isbn: "",
  year: "",
  available: true,
};

export function AddBooks({
  books,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onClose,
}: AddBooksProps) {
  const create = useMutation(api.model.books.mutation.registerBook);
  const update = useMutation(api.model.books.mutation.updateBook);

  const [form, setForm] = useState(emptyForm);
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled
    ? (value: boolean) => externalOnOpenChange?.(value)
    : setInternalOpen;

  useEffect(() => {
    if (open && books) {
      setForm({
        title: books.title ?? "",
        author: books.author ?? "",
        isbn: books.isbn ?? "",
        year: books.year ?? "",
        available: books.available ?? true,
      });
    } else if (!open && !books) {
      setForm(emptyForm);
    }
  }, [open]);

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
      if (books) {
        await update({
          id: books._id,
          title: form.title,
          author: form.author,
          isbn: form.isbn,
          year: form.year,
          available: form.available,
        });
        setOpen(false);
        onClose?.();
      } else {
        await create({
          title: form.title,
          author: form.author,
          isbn: form.isbn,
          year: form.year,
          available: form.available,
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
              Adicionar Livro
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh] overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-lg font-semibold">
            {books ? "Editar Livro" : "Novo Livro"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2.5 min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="author">Autor</Label>
            <Input
              id="author"
              name="author"
              value={form.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                name="year"
                value={form.year}
                onChange={handleChange}
              />
            </div>
          </div>

          <label
            htmlFor="available"
            className="flex cursor-pointer items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
          >
            <span>
              <span className="block font-medium">Disponível para empréstimo</span>
              <span className="text-xs text-muted-foreground">Desmarque se o livro estiver emprestado ou indisponível</span>
            </span>
            <input
              id="available"
              name="available"
              type="checkbox"
              checked={form.available}
              onChange={handleChange}
              className="size-4 accent-primary"
            />
          </label>

          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : books ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
