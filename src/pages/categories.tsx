import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { seedIfNeeded, getCategories, setCategories as saveCategories, getProducts } from "@/lib/storage";
import { Category, Product } from "@/types";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

const empty: Omit<Category, "id"> = { name: "", slug: "", description: "", color: "#4F46E5" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    seedIfNeeded();
    setCategories(getCategories());
    setProducts(getProducts());
  }, []);

  const openNew = () => { setEditing(null); setForm({ ...empty }); setFormOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); const { id: _id, ...rest } = c; setForm(rest); setFormOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const saved: Category = { id: editing?.id ?? `c-${Date.now()}`, ...form, slug };
    const next = editing ? categories.map((x) => (x.id === editing.id ? saved : x)) : [...categories, saved];
    setCategories(next);
    saveCategories(next);
    setFormOpen(false);
    toast({ title: editing ? "Category updated" : "Category created", description: saved.name });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const next = categories.filter((c) => c.id !== deleteId);
    setCategories(next);
    saveCategories(next);
    setDeleteId(null);
    toast({ title: "Category deleted" });
  };

  const productCount = (id: string) => products.filter((p) => p.categoryId === id).length;

  return (
    <>
      <SEO title="Categories | Voltaic Admin" description="Organize product categories" />
      <DashboardLayout
        title="Categories"
        description={`${categories.length} categories organizing your catalog`}
        action={<Button onClick={openNew} className="bg-primary hover:bg-primary/90"><Plus className="mr-2 h-4 w-4" /> New Category</Button>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Card key={c.id} className="group relative overflow-hidden border-border bg-card p-5 transition-all hover:border-primary/40">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl" style={{ backgroundColor: c.color }} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg" style={{ backgroundColor: `${c.color}25`, color: c.color }}>
                    <Tags className="h-5 w-5" />
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                <h3 className="mt-4 font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.description || "No description"}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">/{c.slug}</span>
                  <span className="font-medium">{productCount(c.id)} products</span>
                </div>
              </div>
            </Card>
          ))}
          {categories.length === 0 && (
            <Card className="col-span-full border-border bg-card p-12 text-center text-muted-foreground">No categories yet</Card>
          )}
        </div>

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="border-border bg-card sm:max-w-md">
            <DialogHeader><DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cname">Name</Label>
                <Input id="cname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cslug">Slug (auto from name if empty)</Label>
                <Input id="cslug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="category-slug" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cdesc">Description</Label>
                <Textarea id="cdesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccolor">Color</Label>
                <div className="flex gap-2">
                  <input id="ccolor" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-10 w-16 cursor-pointer rounded-md border border-border bg-muted" />
                  <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="flex-1 font-mono" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">{editing ? "Save" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete category?" description="Products in this category will become uncategorized." onConfirm={handleDelete} />
      </DashboardLayout>
    </>
  );
}