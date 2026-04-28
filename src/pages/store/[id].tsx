import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { ArrowLeft, Plus, ShoppingBag, Minus, Check } from "lucide-react";
import { Product, Category } from "@/types";
import { getProducts, getCategories } from "@/lib/storage";
import { addToCart } from "@/lib/cart";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const formatVND = (n: number): string => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const getYouTubeEmbed = (url: string): string | null => {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

export default function StoreProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const found = getProducts().find((p) => p.id === id) ?? null;
    setProduct(found);
    if (found) setCategory(getCategories().find((c) => c.id === found.categoryId) ?? null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <StoreLayout>
        <div className="container mx-auto px-4 py-12">Loading...</div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="mb-4">Product not found</p>
          <Button asChild>
            <Link href="/store">Back to Store</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  const youtube = product.videoUrl ? getYouTubeEmbed(product.videoUrl) : null;

  const handleAdd = () => {
    addToCart(product.id, qty);
    toast({ title: "Added to cart", description: `${qty} × ${product.name}` });
  };

  return (
    <>
      <Head>
        <title>{product.name}</title>
      </Head>
      <StoreLayout>
        <div className="container mx-auto px-4 py-8">
          <Link href="/store" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-3">
              <Card className="overflow-hidden">
                <div className="aspect-square bg-muted">
                  {product.images[activeImage] ? (
                    <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ShoppingBag className="h-16 w-16" />
                    </div>
                  )}
                </div>
              </Card>
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 ${activeImage === idx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {youtube && (
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-black">
                    <iframe src={youtube} className="h-full w-full" allowFullScreen />
                  </div>
                </Card>
              )}
            </div>
            <div className="space-y-5">
              {category && <p className="text-xs font-medium uppercase tracking-wide text-primary">{category.name}</p>}
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-3xl font-bold tabular-nums text-primary">{formatVND(product.price)}</p>
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: product.description }} />
              <div className="space-y-3 border-t border-border pt-5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => setQty(Math.max(1, qty - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-bold tabular-nums">{qty}</span>
                    <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => setQty(qty + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={handleAdd} className="w-full" size="lg">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <p className="flex items-center gap-1 text-sm text-emerald-600">
                  <Check className="h-4 w-4" /> In stock
                </p>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}