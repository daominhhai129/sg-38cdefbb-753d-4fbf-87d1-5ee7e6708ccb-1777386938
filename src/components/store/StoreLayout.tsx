import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import { ShopInfo } from "@/types";
import { getShopInfo } from "@/lib/storage";
import { cartCount } from "@/lib/cart";
import { CartSheet } from "@/components/store/CartSheet";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

export function StoreLayout({ children }: Props) {
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [count, setCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setShop(getShopInfo());
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <Link href="/store" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-vibrant text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{shop?.name ?? "Shop"}</p>
              {shop?.tagline && <p className="text-xs text-muted-foreground leading-tight">{shop.tagline}</p>}
            </div>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setCartOpen(true)} className="relative">
            <ShoppingBag className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </header>
      <main>{children}</main>
      {shop && (
        <footer className="mt-16 border-t border-border bg-muted/30">
          <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3">
            <div>
              <h3 className="mb-3 text-lg font-bold">{shop.name}</h3>
              <p className="text-sm text-muted-foreground">{shop.description}</p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {shop.email && <li className="flex items-center gap-2"><Mail className="h-3 w-3" /> {shop.email}</li>}
                {shop.phone && <li className="flex items-center gap-2"><Phone className="h-3 w-3" /> {shop.phone}</li>}
                {shop.address && <li className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {shop.address}</li>}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Follow</h4>
              <div className="flex gap-3">
                {shop.facebook && <a href={shop.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>}
                {shop.instagram && <a href={shop.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>}
                {shop.twitter && <a href={shop.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>}
              </div>
            </div>
          </div>
          <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
            © 2026 {shop.name}. All rights reserved.
          </div>
        </footer>
      )}
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}