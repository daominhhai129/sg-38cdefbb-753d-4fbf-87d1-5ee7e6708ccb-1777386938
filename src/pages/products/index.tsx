import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { Plus, Search, Pencil, Trash2, Package2, Video } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { storage } from "@/lib/storage";
import type { Product, Category } from "@/types";
import { toast } from "@/hooks/use-toast";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

const statusStyles = {
  active: "bg-green-500/10 text-green-600",
  draft: "bg-gray-500/10 text-gray-600",
  out_of_stock: "bg-red-500/10 text-red-600",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => {
    setProducts(storage.products.list());
    setCategories(storage.categories.list());
  };

  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    let result = products;
    if (search.trim()) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter !== "all") result = result.filter((p) => p.categoryId === categoryFilter);
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [products, search, categoryFilter]);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "Uncategorized";

  const handleDelete = () => {
    if (!deleteId) return;
    try {
      storage.products.delete(deleteId);
      toast({ title: "Product deleted" });
      refresh();
    } catch (err) {
      toast({ title: "Delete failed", description: err instanceof Error ? err.message : "Error", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <Head><title>Products - Admin</title></Head>
      <DashboardLayout
        title="Products"
        description={`${products.length} total products`}
        action={
          <Button asChild className="gap-2">
            <Link href="/products/new"><Plus className="h-4 w-4" /> Add Product</Link>
          </Button>
        }
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-border pl-9" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full border-border sm:w-[200px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border-border py-16">
            <Package2 className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">{search || categoryFilter !== "all" ? "No products found" : "No products yet"}</p>
            <Button asChild><Link href="/products/new"><Plus className="mr-2 h-4 w-4" /> Create Product</Link></Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <Card key={p.id} className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                <Link href={`/products/${p.id}`} className="relative block aspect-square overflow-hidden bg-muted">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <Package2 className="h-10 w-10" />
                    </div>
                  )}
                  <span className={`absolute right-2 top-2 rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[p.status]}`}>
                    {p.status.replace("_", " ")}
                  </span>
                  {p.videoUrl && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                      <Video className="h-3 w-3" /> Video
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">{categoryName(p.categoryId)}</p>
                  <Link href={`/products/${p.id}`} className="mb-1 line-clamp-1 font-semibold hover:text-primary">{p.name}</Link>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{stripHtml(p.description)}</p>
                  <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-lg font-bold tabular-nums">{formatVND(p.price)}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/products/${p.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete product?" description="This action cannot be undone." onConfirm={handleDelete} />
      </DashboardLayout>
    </>
  );
}