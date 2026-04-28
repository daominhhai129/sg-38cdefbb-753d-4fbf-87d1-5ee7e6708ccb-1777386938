import { useEffect, useState } from "react";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { getProducts } from "@/lib/storage";
import { CartItem, getCart, updateQuantity, removeFromCart, clearCart } from "@/lib/cart";
import { toast } from "@/hooks/use-toast";

const formatVND = (n: number): string => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const refresh = () => {
      setItems(getCart());
      setProducts(getProducts());
    };
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, [open]);

  const lines = items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((s, l) => s + (l.product?.price ?? 0) * l.quantity, 0);

  const handleCheckout = () => {
    if (!lines.length) return;
    clearCart();
    onOpenChange(false);
    toast({ title: "Order placed!", description: "Thank you for your purchase. (Demo - no real checkout)" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart ({lines.length})</SheetTitle>
        </SheetHeader>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-3">
                {lines.map((l) => l.product && (
                  <li key={l.productId} className="flex gap-3 rounded-lg border border-border p-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      {l.product.images[0] && (
                        <img src={l.product.images[0]} alt={l.product.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-medium">{l.product.name}</p>
                        <button type="button" onClick={() => removeFromCart(l.productId)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-bold">{formatVND(l.product.price)}</p>
                      <div className="mt-auto flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(l.productId, l.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm tabular-nums">{l.quantity}</span>
                        <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(l.productId, l.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold">{formatVND(subtotal)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full" size="lg">Checkout</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}