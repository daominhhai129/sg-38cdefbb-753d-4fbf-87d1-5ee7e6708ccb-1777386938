import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, FileText, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, Post, Order } from "@/types";
import { listProducts } from "@/services/productService";
import { listPosts } from "@/services/postService";
import { listOrders } from "@/services/orderService";
import { useMyStore } from "@/contexts/StoreContext";
import { SEO } from "@/components/SEO";

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  processing: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  shipped: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200",
  delivered: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  cancelled: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

const formatVND = (n: number): string => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

export default function Home() {
  const { store } = useMyStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!store) return;
    listProducts(store.id).then(setProducts).catch(() => {});
    listPosts(store.id).then(setPosts).catch(() => {});
    listOrders(store.id).then(setOrders).catch(() => {});
  }, [store]);

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const recentOrders = orders.slice(0, 5);

  const metrics = [
    { label: "Total Revenue", value: formatVND(totalRevenue), change: orders.length + " orders", icon: DollarSign, accent: "from-primary to-primary/40" },
    { label: "Active Orders", value: pendingOrders.toString(), change: "Pending + Processing", icon: ShoppingCart, accent: "from-accent to-accent/40" },
    { label: "Total Products", value: products.length.toString(), change: products.filter((p) => p.status === "active").length + " active", icon: Package, accent: "from-emerald-500 to-emerald-500/40" },
    { label: "Published Posts", value: publishedPosts.toString(), change: posts.length + " total", icon: FileText, accent: "from-amber-500 to-amber-500/40" },
  ];

  return (
    <>
      <SEO title="Dashboard | Admin" description="Admin dashboard overview" />
      <DashboardLayout title="Dashboard" description="Welcome back. Here's what's happening with your shop today.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.label} className="relative overflow-hidden border-border bg-card p-6">
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${m.accent} opacity-20 blur-2xl`} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${m.accent}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-bold tracking-tight">{m.value}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{m.change}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="border-border bg-card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <p className="text-sm text-muted-foreground">Latest orders from customers</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/orders">View all<ArrowUpRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-4 hover:bg-muted/30">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{o.customerName}</p>
                    <p className="truncate text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold tabular-nums">{formatVND(o.total)}</span>
                    <Badge className={`${statusStyles[o.status]} border-0 capitalize`}>{o.status}</Badge>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No orders yet</div>}
            </div>
          </Card>

          <Card className="border-border bg-card">
            <div className="border-b border-border p-6">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <p className="text-sm text-muted-foreground">Jump to management</p>
            </div>
            <div className="space-y-2 p-4">
              <Link href="/products" className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><Package className="h-4 w-4" /></div>
                  <div>
                    <p className="text-sm font-medium">Manage Products</p>
                    <p className="text-xs text-muted-foreground">{products.length} items</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/posts" className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent"><FileText className="h-4 w-4" /></div>
                  <div>
                    <p className="text-sm font-medium">Write a Post</p>
                    <p className="text-xs text-muted-foreground">{publishedPosts} published</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link href="/categories" className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600"><Activity className="h-4 w-4" /></div>
                  <div>
                    <p className="text-sm font-medium">Categories</p>
                    <p className="text-xs text-muted-foreground">Organize products</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}