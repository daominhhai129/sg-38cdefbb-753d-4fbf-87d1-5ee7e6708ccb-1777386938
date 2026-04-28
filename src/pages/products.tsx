import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductForm } from "@/components/products/ProductForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { seedIfNeeded, getProducts, setProducts as saveProducts, getCategories } from "@/lib/storage";
import { Product, Category } from "@/types";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

const statusStyles: Record<Product["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  draft: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  out_of_stock: "bg-destructive/15 text-destructive ring-1 ring-destructive/30",
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
        <Card className="border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-border bg-muted pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                          {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" /> : <Package className="h-full w-full p-2 text-muted-foreground" />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{p.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{p.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{categoryName(p.categoryId)}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">${p.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.stock}</TableCell>
                    <TableCell><Badge className={`${statusStyles[p.status]} border-0 capitalize`}>{p.status.replace("_", " ")}</Badge></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No products found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
        <ProductForm open={formOpen} onOpenChange={setFormOpen} product={editing} categories={categories} onSave={handleSave} />
        <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete product?" description="This action cannot be undone." onConfirm={handleDelete} />
      </DashboardLayout>
    </>
  );
}