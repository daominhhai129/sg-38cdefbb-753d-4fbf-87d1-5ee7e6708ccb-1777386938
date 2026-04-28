import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Props { open: boolean; onOpenChange: (o: boolean) => void; }

export function CartSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader><SheetTitle>Cart</SheetTitle></SheetHeader>
        <p className="mt-6 text-sm text-muted-foreground">Cart checkout flow is being migrated. Re-prompt for full implementation.</p>
      </SheetContent>
    </Sheet>
  );
}
