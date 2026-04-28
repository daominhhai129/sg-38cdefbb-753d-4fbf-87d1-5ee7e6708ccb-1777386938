import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ProductFormPage } from "@/components/products/ProductFormPage";
import { storage } from "@/lib/storage";
import type { Product } from "@/types";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const found = storage.products.get(id);
    if (!found) {
      router.replace("/products");
      return;
    }
    setProduct(found);
    setLoading(false);
  }, [id, router]);

  if (loading) {
    return (
      <DashboardLayout title="Edit Product" description="Loading...">
        <p className="text-muted-foreground">Loading...</p>
      </DashboardLayout>
    );
  }

  return <ProductFormPage product={product} />;
}