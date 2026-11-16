import type { Doc } from "@convex/_generated/dataModel";
import { DetailsDialog } from "@/components/shared/DetailsDialog";
import { BookStatus } from "@/pages/books/components/ListBooks";

interface BooksDetailsProps {
  Books: Doc<"books">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BooksDetails({ Books, open, onOpenChange }: BooksDetailsProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={Books.title}
      subtitle={Books.author}
      fields={[
        { label: "ISBN", value: Books.isbn },
        { label: "Ano", value: Books.year },
        { label: "Status", value: <BookStatus available={Books.available} /> },
      ]}
    />
  );
}
