import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { Product } from "@/types";
import { getProduct } from "@/services/productService";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " \u20AB";

export default function StoreProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (typeof id !== "string") return;
    getProduct(id).then(setProduct).catch(() => {});
  }, [id]);

  if (!product) {
    return (
      <StoreLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
          <Button asChild className="mt-4"><Link href="/store">Back</Link></Button>
        </div>
      </StoreLayout>
    );
  }

  return (
    <>
      <Head><title>{product.name}</title></Head>
      <StoreLayout>
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-2">
          <Card className="aspect-square overflow-hidden bg-muted">
            {product.images[0] && <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />}
          </Card>
          <div>
            <h1 className="mb-3 text-3xl font-bold">{product.name}</h1>
            <p className="mb-4 text-3xl font-bold text-primary">{formatVND(product.price)}</p>
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </div>
      </StoreLayout>
    </>
  );
}
