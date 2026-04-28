import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { ArrowLeft, Save, Upload, X, Video, Image as ImageIcon, Loader2 } from "lucide-react";
import { Product, Category } from "@/types";
import { listCategories } from "@/services/categoryService";
import { createProduct, updateProduct } from "@/services/productService";
import { uploadProductImage } from "@/services/storageService";
import { useMyStore } from "@/contexts/StoreContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Props { product?: Product }

const getYouTubeEmbed = (url: string): string | null => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

export function ProductFormPage({ product }: Props) {
  const router = useRouter();
  const { store } = useMyStore();
  const isEdit = !!product;
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState<number>(product?.price ?? 0);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [videoUrl, setVideoUrl] = useState(product?.videoUrl ?? "");
  const [status, setStatus] = useState<Product["status"]>(product?.status ?? "active");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (store) listCategories(store.id).then(setCategories).catch(() => {}); }, [store]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (images.length + files.length > 8) {
      toast({ title: "Maximum 8 images", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const urls = await Promise.all(files.filter((f) => f.type.startsWith("image/")).map((f) => uploadProductImage(f)));
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "Error", variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const setMainImage = (idx: number) => {
    if (idx === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.unshift(moved);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) { toast({ title: "Store not loaded", variant: "destructive" }); return; }
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
      if (isEdit && product) await updateProduct(product.id, payload);
      else await createProduct(store.id, payload);
      toast({ title: isEdit ? "Product updated" : "Product created" });
      router.push("/products");
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const youtubeEmbed = videoUrl ? getYouTubeEmbed(videoUrl) : null;
  const formattedPrice = price > 0 ? new Intl.NumberFormat("vi-VN").format(price) + " ₫" : "";

  return (
    <>
      <Head><title>{isEdit ? "Edit" : "New"} Product · Admin</title></Head>
      <DashboardLayout title={isEdit ? "Edit Product" : "New Product"} description={isEdit ? `Editing ${product?.name}` : "Create a new product listing"}>
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Wireless Headphones Pro" required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <RichTextEditor value={description} onChange={setDescription} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold"><ImageIcon className="h-5 w-5" /> Product Images</h2>
                <span className="text-xs text-muted-foreground">{images.length} / 8</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((img, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-end justify-end gap-1 bg-gradient-to-t from-black/60 via-transparent to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {idx !== 0 && <button type="button" onClick={() => setMainImage(idx)} className="rounded bg-white/90 px-2 py-1 text-[10px] font-medium text-foreground shadow hover:bg-white">Set main</button>}
                      <button type="button" onClick={() => removeImage(idx)} className="rounded bg-red-500 p-1 text-white shadow hover:bg-red-600"><X className="h-3 w-3" /></button>
                    </div>
                    {idx === 0 && <span className="absolute left-2 top-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">Main</span>}
                  </div>
                ))}
                {images.length < 8 && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary">
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="mb-1 h-5 w-5" />}
                    <span className="text-xs font-medium">{uploading ? "Uploading..." : "Upload"}</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">First image is the main thumbnail. Hover to set main or remove. Images are stored on Supabase.</p>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Video className="h-5 w-5" /> Product Video</h2>
              <div className="space-y-3">
                <Input placeholder="https://youtube.com/watch?v=... or https://tiktok.com/@user/video/..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                <p className="text-xs text-muted-foreground">YouTube and TikTok URLs supported.</p>
                {youtubeEmbed && (
                  <div className="aspect-video overflow-hidden rounded-lg border border-border">
                    <iframe src={youtubeEmbed} className="h-full w-full" allowFullScreen title="Video preview" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Pricing</h2>
              <div className="space-y-2">
                <Label htmlFor="price">Price (VND)</Label>
                <div className="relative">
                  <Input id="price" type="number" min="0" step="1000" value={price} onChange={(e) => setPrice(parseInt(e.target.value) || 0)} className="pr-10 text-lg font-semibold tabular-nums" required />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base font-medium text-muted-foreground">₫</span>
                </div>
                {formattedPrice && <p className="text-sm font-medium text-primary">{formattedPrice}</p>}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Organization</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as Product["status"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="out_of_stock">Out of stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" size="lg" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => router.push("/products")}>Cancel</Button>
            </div>
          </div>
        </form>
      </DashboardLayout>
    </>
  );
}