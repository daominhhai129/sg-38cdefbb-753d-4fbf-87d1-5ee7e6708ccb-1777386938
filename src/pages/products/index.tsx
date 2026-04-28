import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { Plus, Search, Pencil, Trash2, Package2, Video } from "lucide-react";
import { Product, Category } from "@/types";
import { getProducts, setProducts, getCategories } from "@/lib/storage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "@/hooks/use-toast";

const statusStyles: Record<Product["status"], string> = {
  active: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  draft: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  out_of_stock: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";
const stripHtml = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export default function ProductsPage() {
  const [products, setProductsState] = useState<Product[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setProductsState(getProducts());
    setCategoriesState(getCategories());
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter]);

  const handleDelete = () => {
    if (!deleteId) return;
    const next = products.filter((p) => p.id !== deleteId);
    setProducts(next);
    setProductsState(next);
    toast({ title: "Product deleted" });
    setDeleteId(null);
  };

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <>
      <Head><title>Products · Admin</title></Head>
      <DashboardLayout title="Products" description={`${products.length} total products`}>
        <Card className="mb-6 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button asChild>
              <Link href="/products/new"><Plus className="mr-2 h-4 w-4" /> Add Product</Link>
            </Button>
          </div>
        </Card>

        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <Package2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No products found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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