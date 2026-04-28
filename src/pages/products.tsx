import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductForm } from "@/components/products/ProductForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { seedIfNeeded, getProducts, setProducts as saveProducts, getCategories } from "@/lib/storage";
import { Product, Category } from "@/types";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

const statusStyles: Record<Product["status"], string> = {
  active: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  draft: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  out_of_stock: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    seedIfNeeded();
    setProducts(getProducts());
    setCategories(getCategories());
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "Uncategorized";

  const handleSave = (p: Product) => {
    const exists = products.some((x) => x.id === p.id);
    const next = exists ? products.map((x) => (x.id === p.id ? p : x)) : [p, ...products];
    setProducts(next);
    saveProducts(next);
    toast({ title: exists ? "Product updated" : "Product created", description: p.name });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const next = products.filter((p) => p.id !== deleteId);
    setProducts(next);
    saveProducts(next);
    setDeleteId(null);
    toast({ title: "Product deleted" });
  };

  return (
    <>
      <SEO title="Products | Voltaic Admin" description="Manage product catalog" />
      <DashboardLayout
        title="Products"
        description={`${products.length} products in catalog`}
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-border bg-card pl-9" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <Card key={p.id} className="group flex flex-col overflow-hidden border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute right-2 top-2">
                  <Badge className={`${statusStyles[p.status]} border-0 capitalize shadow-sm`}>{p.status.replace("_", " ")}</Badge>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">{categoryName(p.categoryId)}</p>
                <h3 className="mt-1 line-clamp-1 font-semibold leading-snug">{p.name}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">{p.description || "No description"}</p>
                <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-lg font-bold tabular-nums">${p.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="text-lg font-semibold tabular-nums">{p.stock}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditing(p); setFormOpen(true); }}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(p.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="col-span-full border-border bg-card p-12 text-center text-muted-foreground">
              <Package className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p>No products found</p>
            </Card>
          )}
        </div>

        <ProductForm open={formOpen} onOpenChange={setFormOpen} product={editing} categories={categories} onSave={handleSave} />
        <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete product?" description="This action cannot be undone." onConfirm={handleDelete} />
      </DashboardLayout>
    </>
  );
}