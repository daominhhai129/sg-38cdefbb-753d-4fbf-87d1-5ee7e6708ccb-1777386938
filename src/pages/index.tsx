import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, FileText, ShoppingCart, TrendingUp, DollarSign, Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { storage } from "@/lib/storage";
import type { Product, Post, Order } from "@/types";

const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setProducts(storage.products.list());
    setPosts(storage.posts.list());
    setOrders(storage.orders.list());
  }, []);

  const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const activeProducts = products.filter((p) => p.status === "active").length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;

  const recentOrders = orders.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <>
      <SEO title="Dashboard - Admin" />
      <DashboardLayout title="Dashboard" description="Welcome back! Here's what's happening.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-card/50 p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary transition-transform group-hover:scale-110">
                <DollarSign className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">{formatVND(totalRevenue)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Revenue (delivered)</p>
          </Card>
          <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-card/50 p-6 transition-all hover:shadow-lg hover:shadow-accent/5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 text-accent transition-transform group-hover:scale-110">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Active</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">{activeProducts}</p>
            <p className="mt-1 text-xs text-muted-foreground">Products</p>
          </Card>
          <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-card/50 p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary transition-transform group-hover:scale-110">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">{pendingOrders}</p>
            <p className="mt-1 text-xs text-muted-foreground">Orders</p>
          </Card>
          <Card className="group overflow-hidden border-border bg-gradient-to-br from-card to-card/50 p-6 transition-all hover:shadow-lg hover:shadow-accent/5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 text-accent transition-transform group-hover:scale-110">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Published</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">{publishedPosts}</p>
            <p className="mt-1 text-xs text-muted-foreground">Posts</p>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="border-border p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex-1">
                      <p className="font-medium">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">{o.items.length} items • {new Date(o.createdAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold tabular-nums">{formatVND(o.total)}</p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${o.status === "delivered" ? "bg-green-500/10 text-green-600" : o.status === "shipped" ? "bg-blue-500/10 text-blue-600" : o.status === "processing" ? "bg-yellow-500/10 text-yellow-600" : "bg-gray-500/10 text-gray-600"}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 text-center">
              <Link href="/orders" className="text-sm font-medium text-primary hover:underline">
                View all orders →
              </Link>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}