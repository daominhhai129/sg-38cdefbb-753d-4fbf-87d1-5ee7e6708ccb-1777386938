import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X, Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo } from "lucide-react";
import { storage } from "@/lib/storage";
import type { Product, Category } from "@/types";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { RichTextEditor } from "@/components/RichTextEditor";
import { toast } from "@/hooks/use-toast";

interface Props { product?: Product; }

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

export function ProductFormPage({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [videoUrl, setVideoUrl] = useState(product?.videoUrl ?? "");
  const [status, setStatus] = useState<Product["status"]>(product?.status ?? "active");
  const [saving, setSaving] = useState(false);

  useEffect(() => { setCategories(storage.categories.list()); }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result as string].slice(0, 8));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast({ title: "Product name is required", variant: "destructive" }); return; }
    if (!categoryId) { toast({ title: "Please select a category", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description,
        price: Number(price) || 0,
        categoryId,
        images,
        videoUrl: videoUrl.trim(),
        status,
      };
      if (isEdit && product) storage.products.update(product.id, payload);
      else storage.products.create(payload);
      toast({ title: isEdit ? "Product updated" : "Product created" });
      router.push("/products");
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const videoEmbed = (() => {
    if (!videoUrl.trim()) return null;
    const yt = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    return null;
  })();

  return (
    <>
      <Head><title>{isEdit ? "Edit Product" : "New Product"} - Admin</title></Head>
      <DashboardLayout title={isEdit ? "Edit Product" : "New Product"} description={isEdit ? `Editing: ${product.name}` : "Create a new product"}>
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
          <Card className="border-border p-6">
            <div className="mb-6 flex items-center justify-between">
              <Button type="button" variant="ghost" asChild className="gap-2">
                <Link href="/products"><ArrowLeft className="h-4 w-4" /> Back</Link>
              </Button>
              <Button type="submit" disabled={saving} className="gap-2">
                <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Product"}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Wireless Headphones Pro" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger id="category" className="border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (VND) *</Label>
                  <Input id="price" type="number" step="1000" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="5990000" required />
                  {price && <p className="text-xs text-muted-foreground">Preview: {formatVND(Number(price) || 0)}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as Product["status"])}>
                    <SelectTrigger id="status" className="border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <RichTextEditor value={description} onChange={setDescription} placeholder="Describe your product in detail..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Product Images (up to 8)</Label>
                <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-6 text-center transition-colors hover:border-primary/50">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-1 text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 10MB each</p>
                  <Input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} className="mt-3" disabled={images.length >= 8} />
                </div>
                {images.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                        <img src={img} alt={`Product ${idx + 1}`} className="h-full w-full object-cover" />
                        {idx === 0 && <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">MAIN</span>}
                        <button type="button" onClick={() => removeImage(idx)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Product Video URL (YouTube or TikTok)</Label>
                <Input id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                {videoEmbed && (
                  <div className="mt-2 aspect-video overflow-hidden rounded-lg border border-border">
                    <iframe src={videoEmbed} className="h-full w-full" allowFullScreen title="Product video" />
                  </div>
                )}
                {videoUrl && !videoEmbed && (
                  <Card className="mt-2 border-yellow-500/20 bg-yellow-500/5 p-3">
                    <p className="text-xs text-yellow-600">⚠️ Video will be shown as a link (TikTok or unrecognized format)</p>
                  </Card>
                )}
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </DashboardLayout>
    </>
  );
}