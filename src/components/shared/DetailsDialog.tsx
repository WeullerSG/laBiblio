import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  fields: { label: string; value: ReactNode }[];
}

export function DetailsDialog({ open, onOpenChange, title, subtitle, fields }: DetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>
        <dl className="divide-y rounded-lg border">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center justify-between gap-4 px-3 py-2.5 text-sm">
              <dt className="text-muted-foreground">{f.label}</dt>
              <dd className="text-right font-medium">{f.value || "-"}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: string;
  name: string;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({ open, onOpenChange, entity, name, onConfirm }: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir {entity}</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir <strong className="text-foreground">"{name}"</strong>?
            Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
