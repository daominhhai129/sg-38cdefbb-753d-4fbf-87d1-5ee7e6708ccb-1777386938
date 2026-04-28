import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { ShoppingBag, Plus } from "lucide-react";
import { Product, Category, ShopInfo } from "@/types";
import { getProducts, getCategories, getShopInfo } from "@/lib/storage";
import { addToCart } from "@/lib/cart";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const formatVND = (n: number): string => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getProducts().filter((p) => p.status === "active"));
    setCategories(getCategories());
    setShop(getShopInfo());
  }, []);

  const handleAdd = (p: Product) => {
    addToCart(p.id);
    toast({ title: "Added to cart", description: p.name });
  };

  const productsByCategory = (catId: string) => products.filter((p) => p.categoryId === catId);
  const visibleCategories = activeCategory ? categories.filter((c) => c.id === activeCategory) : categories;

  return (
    <>
      <Head>
        <title>{shop?.name ?? "Shop"} - Online Store</title>
      </Head>
      <StoreLayout>
        <section className="bg-gradient-vibrant text-white">
          <div className="container mx-auto px-4 py-16 text-center md:py-24">
            <h1 className="mb-3 text-4xl font-bold md:text-5xl">{shop?.name ?? "Welcome"}</h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90">{shop?.tagline ?? shop?.description}</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Shop by Category</h2>
              <p className="text-sm text-muted-foreground">Browse our collections</p>
            </div>
            {activeCategory && (
              <Button variant="ghost" size="sm" onClick={() => setActiveCategory(null)}>Show all</Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((c) => {
              const count = productsByCategory(c.id).length;
              const active = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(active ? null : c.id)}
                  className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${active ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/40 hover:shadow-md"}`}
                >
                  <div className="mb-2 h-10 w-10 rounded-lg" style={{ backgroundColor: c.color }} />
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{count} products</p>
                </button>
              );
            })}
          </div>
        </section>

        {visibleCategories.map((cat) => {
          const items = productsByCategory(cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="container mx-auto px-4 py-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <h2 className="text-xl font-bold">{cat.name}</h2>
                <span className="text-sm text-muted-foreground">{items.length} items</span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((p) => (
                  <Card key={p.id} className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                    <Link href={`/store/${p.id}`} className="relative block aspect-square overflow-hidden bg-muted">
                      {p.images[0] ? (
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-10 w-10" />
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col p-3">
                      <Link href={`/store/${p.id}`} className="mb-1 line-clamp-2 text-sm font-medium hover:text-primary">
                        {p.name}
                      </Link>
                      <p className="mb-2 mt-auto text-base font-bold tabular-nums">{formatVND(p.price)}</p>
                      <Button size="sm" onClick={() => handleAdd(p)} className="w-full">
                        <Plus className="mr-1 h-3 w-3" /> Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        {products.length === 0 && (
          <section className="container mx-auto px-4 py-16 text-center">
            <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No products available yet</p>
          </section>
        )}
      </StoreLayout>
    </>
  );
}