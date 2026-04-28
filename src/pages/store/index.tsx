import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { Product, Category } from "@/types";
import { listProducts } from "@/services/productService";
import { listCategories } from "@/services/categoryService";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Card } from "@/components/ui/card";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " \u20AB";

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    listProducts().then((all) => setProducts(all.filter((p) => p.status === "active"))).catch(() => {});
    listCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <>
      <Head><title>Store</title></Head>
      <StoreLayout>
        <section className="bg-gradient-vibrant py-16 text-center text-white">
          <h1 className="text-4xl font-bold">Welcome</h1>
        </section>
        {categories.map((cat) => {
          const items = products.filter((p) => p.categoryId === cat.id);
          if (!items.length) return null;
          return (
            <section key={cat.id} className="container mx-auto px-4 py-8">
              <h2 className="mb-4 text-xl font-bold">{cat.name}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((p) => (
                  <Card key={p.id} className="overflow-hidden">
                    <Link href={"/store/" + p.id} className="block aspect-square bg-muted">
                      {p.images[0] && <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />}
                    </Link>
                    <div className="p-3">
                      <Link href={"/store/" + p.id} className="line-clamp-2 text-sm font-medium hover:text-primary">{p.name}</Link>
                      <p className="mt-1 font-bold tabular-nums">{formatVND(p.price)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </StoreLayout>
    </>
  );
}
