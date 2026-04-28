import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { ProductFormPage } from "@/components/products/ProductFormPage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getProduct } from "@/services/productService";
import { Product } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    if (!router.isReady || typeof id !== "string") return;
    getProduct(id).then((p) => setProduct(p ?? null)).catch(() => setProduct(null));
  }, [id, router.isReady]);

  if (product === undefined) {
    return (
      <>
        <Head><title>Loading · Admin</title></Head>
        <DashboardLayout title="Loading...">
          <Card className="p-12 text-center text-muted-foreground">Loading product...</Card>
        </DashboardLayout>
      </>
    );
  }

  if (product === null) {
    return (
      <>
        <Head><title>Not found · Admin</title></Head>
        <DashboardLayout title="Product not found">
          <Card className="p-12 text-center">
            <p className="mb-4 text-muted-foreground">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild><Link href="/products">Back to Products</Link></Button>
          </Card>
        </DashboardLayout>
      </>
    );
  }

  return <ProductFormPage product={product} />;
}