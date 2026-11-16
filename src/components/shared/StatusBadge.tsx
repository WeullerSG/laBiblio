import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "danger" | "info" | "neutral";

const variants: Record<Variant, string> = {
  success: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-700 ring-red-600/20 dark:text-red-400",
  info: "bg-sky-500/10 text-sky-700 ring-sky-600/20 dark:text-sky-400",
  neutral: "bg-muted text-muted-foreground ring-border",
};

export function StatusBadge({
  variant = "neutral",
  children,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        variants[variant],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
