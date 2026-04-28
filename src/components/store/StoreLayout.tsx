import { ReactNode, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Store } from "@/types";
import { CartSheet } from "@/components/store/CartSheet";
import { Button } from "@/components/ui/button";

export function StoreLayout({ children, store }: { children: ReactNode; store: Store | null }) {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/store" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-vibrant text-white"><ShoppingBag className="h-5 w-5" /></div>
            <p className="text-sm font-bold">{store?.name ?? "Marketplace"}</p>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setCartOpen(true)}><ShoppingBag className="h-4 w-4" /><span className="ml-2">Cart</span></Button>
        </div>
      </header>
      <main>{children}</main>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}