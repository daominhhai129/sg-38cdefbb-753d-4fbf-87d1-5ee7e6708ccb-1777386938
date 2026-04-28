import { useEffect, useMemo, useState } from "react";
import { Search, Eye, ShoppingCart } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { seedIfNeeded, getOrders, setOrders as saveOrders } from "@/lib/storage";
import { Order } from "@/types";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  processing: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30",
  shipped: "bg-primary/15 text-primary ring-1 ring-primary/30",
  delivered: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  cancelled: "bg-destructive/15 text-destructive ring-1 ring-destructive/30",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<Order | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    seedIfNeeded();
    setOrders(getOrders());
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.customerEmail.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  const updateStatus = (id: string, status: Order["status"]) => {
    const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(next);
    saveOrders(next);
    if (viewing?.id === id) setViewing({ ...viewing, status });
    toast({ title: "Status updated", description: `Order set to ${status}` });
  };

  return (
    <>
      <SEO title="Orders | Voltaic Admin" description="Track and manage orders" />
      <DashboardLayout title="Orders" description={`${orders.length} orders · $${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total`}>
        <Card className="border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search orders, customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-border bg-muted pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer border-border" onClick={() => setViewing(o)}>
                    <TableCell className="font-mono text-sm font-medium">{o.orderNumber}</TableCell>
                    <TableCell>
                      <p className="font-medium">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">{o.customerEmail}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">${o.total.toFixed(2)}</TableCell>
                    <TableCell><Badge className={`${statusStyles[o.status]} border-0 capitalize`}>{o.status}</Badge></TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setViewing(o); }}><Eye className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground"><ShoppingCart className="mx-auto mb-2 h-8 w-8 opacity-50" />No orders found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
          <DialogContent className="border-border bg-card sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Order {viewing?.orderNumber}</DialogTitle>
            </DialogHeader>
            {viewing && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="mt-1 font-medium">{viewing.customerName}</p>
                  <p className="text-sm text-muted-foreground">{viewing.customerEmail}</p>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Items</p>
                  <div className="space-y-2">
                    {viewing.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 text-sm">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                        </div>
                        <span className="font-semibold tabular-nums">${(item.quantity * item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold tabular-nums">${viewing.total.toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Update Status</p>
                  <Select value={viewing.status} onValueChange={(v: Order["status"]) => updateStatus(viewing.id, v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
}