import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { ArrowLeft, Pencil, Package } from "lucide-react";
import { storage } from "@/lib/storage";
import type { Product, Category } from "@/types";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const found = storage.products.get(id);
    if (!found) { router.replace("/products"); return; }
    setProduct(found);
    const cats = storage.categories.list();
    setCategory(cats.find((c) => c.id === found.categoryId) ?? null);
  }, [id, router]);

  if (!product) {
    return (
      <DashboardLayout title="Product" description="Loading...">
        <p className="text-muted-foreground">Loading...</p>
      </DashboardLayout>
    );
  }

  const videoEmbed = (() => {
    if (!product.videoUrl) return null;
    const yt = product.videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    return null;
  })();

  const statusColors = {
    active: "bg-green-500/10 text-green-600",
    draft: "bg-gray-500/10 text-gray-600",
    out_of_stock: "bg-red-500/10 text-red-600",
  };

  return (
    <>
      <Head><title>{product.name} - Admin</title></Head>
      <DashboardLayout
        title={product.name}
        description={category?.name ?? "Uncategorized"}
        action={
          <Button asChild className="gap-2">
            <Link href={`/products/${product.id}/edit`}><Pencil className="h-4 w-4" /> Edit Product</Link>
          </Button>
        }
      >
        <div className="mb-4">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/products"><ArrowLeft className="h-4 w-4" /> Back to Products</Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Card className="overflow-hidden border-border p-0">
              <div className="aspect-square bg-muted">
                {product.images.length > 0 ? (
                  <img src={product.images[activeImg]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Package className="h-16 w-16" />
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 border-t border-border bg-card p-3">
                  {product.images.map((img, idx) => (
                    <button key={idx} type="button" onClick={() => setActiveImg(idx)} className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${idx === activeImg ? "border-primary shadow-md" : "border-transparent hover:border-border"}`}>
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {videoEmbed && (
              <Card className="overflow-hidden border-border p-0">
                <div className="aspect-video">
                  <iframe src={videoEmbed} className="h-full w-full" allowFullScreen title="Product video" />
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-border p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">{product.name}</h2>
                  {category && <p className="text-sm text-muted-foreground">{category.name}</p>}
                </div>
                <Badge className={statusColors[product.status]}>{product.status.replace("_", " ")}</Badge>
              </div>
              <div className="mb-6">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-3xl font-bold tabular-nums text-primary">{formatVND(product.price)}</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Description</p>
                <div className="rich-content text-sm" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            </Card>

            <Card className="border-border p-6">
              <h3 className="mb-3 font-semibold">Product Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-muted-foreground">Product ID</dt>
                  <dd className="font-mono text-xs">{product.id}</dd>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd>{category?.name ?? "Uncategorized"}</dd>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="capitalize">{product.status.replace("_", " ")}</dd>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-muted-foreground">Images</dt>
                  <dd>{product.images.length}</dd>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-muted-foreground">Video</dt>
                  <dd>{product.videoUrl ? "Yes" : "No"}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd>{new Date(product.createdAt).toLocaleDateString("vi-VN")}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}