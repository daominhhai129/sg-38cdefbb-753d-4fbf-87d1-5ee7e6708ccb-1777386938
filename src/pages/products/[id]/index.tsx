import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { ArrowLeft, Pencil, Video, Package2, Calendar } from "lucide-react";
import { Product, Category } from "@/types";
import { getProduct } from "@/services/productService";
import { listCategories } from "@/services/categoryService";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const statusStyles: Record<Product["status"], string> = {
  active: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  draft: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  out_of_stock: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

const getYouTubeEmbed = (url: string): string | null => {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    (async () => {
      try {
        const found = await getProduct(id);
        setProduct(found);
        if (found) {
          const cats = await listCategories(found.storeId);
          setCategory(cats.find((c) => c.id === found.categoryId) ?? null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Loading..." description="">
        <Card className="p-8"><p className="text-muted-foreground">Loading product...</p></Card>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout title="Not found" description="Product does not exist">
        <Card className="p-12 text-center">
          <Package2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">Product not found</p>
          <Button asChild><Link href="/products">Back to Products</Link></Button>
        </Card>
      </DashboardLayout>
    );
  }

  const youtubeEmbed = product.videoUrl ? getYouTubeEmbed(product.videoUrl) : null;

  return (
    <>
      <Head><title>{product.name} · Admin</title></Head>
      <DashboardLayout title={product.name} description={category?.name ?? ""}>
        <div className="mb-6 flex items-center justify-between">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
          <Button asChild>
            <Link href={`/products/${product.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-muted">
                {product.images[activeImage] ? (
                  <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center"><Package2 className="h-16 w-16 text-muted-foreground" /></div>
                )}
              </div>
            </Card>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, idx) => (
                  <button key={idx} type="button" onClick={() => setActiveImage(idx)} className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${activeImage === idx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {product.videoUrl && (
              <Card className="p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Video className="h-4 w-4" /> Product Video</h3>
                {youtubeEmbed ? (
                  <div className="aspect-video overflow-hidden rounded-lg bg-black"><iframe src={youtubeEmbed} className="h-full w-full" allowFullScreen /></div>
                ) : (
                  <a href={product.videoUrl} target="_blank" rel="noreferrer" className="block rounded-lg border border-border bg-muted p-3 text-sm text-primary hover:underline">{product.videoUrl}</a>
                )}
              </Card>
            )}
          </div>
          <div className="space-y-4 lg:col-span-2">
            <Card className="p-6">
              {category && <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">{category.name}</p>}
              <h1 className="mb-3 text-2xl font-bold">{product.name}</h1>
              <span className={`mb-4 inline-block rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[product.status]}`}>{product.status.replace("_", " ")}</span>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-3xl font-bold tabular-nums">{formatVND(product.price)}</p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="mb-3 text-sm font-semibold">Description</h3>
              {product.description ? (
                <div className="rich-content" dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : <p className="text-sm text-muted-foreground">No description.</p>}
            </Card>
            <Card className="p-6">
              <h3 className="mb-3 text-sm font-semibold">Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Product ID</dt><dd className="font-mono text-xs">{product.id.slice(0, 8)}...</dd></div>
                <div className="flex justify-between"><dt className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" /> Created</dt><dd>{new Date(product.createdAt).toLocaleDateString()}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Images</dt><dd>{product.images.length}</dd></div>
              </dl>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}