import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { ShoppingBag, Plus } from "lucide-react";
import { Store, Product, Category } from "@/types";
import { getStoreBySlug } from "@/services/storeService";
import { listProducts } from "@/services/productService";
import { listCategories } from "@/services/categoryService";
import { addToCart } from "@/lib/cart";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " \u20AB";

export default function StorefrontPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;
    (async () => {
      try {
        const s = await getStoreBySlug(slug);
        if (!s) { setLoading(false); return; }
        setStore(s);
        const [p, c] = await Promise.all([listProducts(s.id), listCategories(s.id)]);
        setProducts(p.filter((x) => x.status === "active"));
        setCategories(c);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <StoreLayout store={null}><div className="container mx-auto px-4 py-12 text-muted-foreground">Loading...</div></StoreLayout>;

  if (!store) {
    return (
      <StoreLayout store={null}>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">Store not found</p>
          <Button asChild><Link href="/store">Browse all stores</Link></Button>
        </div>
      </StoreLayout>
    );
  }

  const handleAdd = (p: Product) => {
    addToCart(p.id, 1, store.id);
    toast({ title: "Added to cart", description: p.name });
  };

  const productsByCategory = (catId: string) => products.filter((p) => p.categoryId === catId);
  const visibleCategories = activeCategory ? categories.filter((c) => c.id === activeCategory) : categories;
  const uncategorized = products.filter((p) => !p.categoryId || !categories.find((c) => c.id === p.categoryId));

  return (
    <>
      <Head><title>{store.name}</title></Head>
      <StoreLayout store={store}>
        <section className="bg-gradient-vibrant text-white">
          <div className="container mx-auto px-4 py-16 text-center md:py-20">
            <h1 className="mb-3 text-4xl font-bold md:text-5xl">{store.name}</h1>
            {store.tagline && <p className="mx-auto max-w-2xl text-lg text-white/90">{store.tagline}</p>}
          </div>
        </section>

        {categories.length > 0 && (
          <section className="container mx-auto px-4 py-10">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">Shop by Category</h2>
                <p className="text-sm text-muted-foreground">{categories.length} categories</p>
              </div>
              {activeCategory && <Button variant="ghost" size="sm" onClick={() => setActiveCategory(null)}>Show all</Button>}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.map((c) => {
                const count = productsByCategory(c.id).length;
                const active = activeCategory === c.id;
                return (
                  <button key={c.id} type="button" onClick={() => setActiveCategory(active ? null : c.id)}
                    className={`group rounded-xl border p-4 text-left transition-all ${active ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/40 hover:shadow-md"}`}>
                    <div className="mb-2 h-10 w-10 rounded-lg" style={{ backgroundColor: c.color }} />
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{count} products</p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {visibleCategories.map((cat) => {
          const items = productsByCategory(cat.id);
          if (!items.length) return null;
          return (
            <section key={cat.id} className="container mx-auto px-4 py-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <h2 className="text-xl font-bold">{cat.name}</h2>
                <span className="text-sm text-muted-foreground">{items.length} items</span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((p) => (
                  <Card key={p.id} className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {p.images[0] ? <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><ShoppingBag className="h-10 w-10" /></div>}
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <p className="mb-1 line-clamp-2 text-sm font-medium">{p.name}</p>
                      <p className="mt-auto mb-2 text-base font-bold tabular-nums">{formatVND(p.price)}</p>
                      <Button size="sm" onClick={() => handleAdd(p)} className="w-full"><Plus className="mr-1 h-3 w-3" /> Add to Cart</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        {!activeCategory && uncategorized.length > 0 && (
          <section className="container mx-auto px-4 py-6">
            <h2 className="mb-4 text-xl font-bold">Other</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {uncategorized.map((p) => (
                <Card key={p.id} className="flex flex-col overflow-hidden">
                  <div className="aspect-square bg-muted">{p.images[0] && <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />}</div>
                  <div className="flex flex-1 flex-col p-3">
                    <p className="mb-1 line-clamp-2 text-sm font-medium">{p.name}</p>
                    <p className="mt-auto mb-2 text-base font-bold tabular-nums">{formatVND(p.price)}</p>
                    <Button size="sm" onClick={() => handleAdd(p)}><Plus className="mr-1 h-3 w-3" /> Add to Cart</Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {products.length === 0 && (
          <section className="container mx-auto px-4 py-16 text-center">
            <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">This store has no products yet</p>
          </section>
        )}
      </StoreLayout>
    </>
  );
}