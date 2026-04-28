import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem } from "@/types";

interface DbOrder {
  id: string;
  store_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  items: OrderItem[];
  total: number;
  status: Order["status"];
  notes: string;
  created_at: string;
}

const fromDb = (r: DbOrder): Order => ({
  id: r.id,
  storeId: r.store_id,
  customerName: r.customer_name,
  customerEmail: r.customer_email,
  customerPhone: r.customer_phone,
  shippingAddress: r.shipping_address,
  items: Array.isArray(r.items) ? r.items : [],
  total: Number(r.total),
  status: r.status,
  notes: r.notes,
  createdAt: r.created_at,
});

export async function listOrders(storeId: string): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").eq("store_id", storeId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => fromDb(r as unknown as DbOrder));
}

export async function createOrder(storeId: string, o: Omit<Order, "id" | "createdAt" | "status" | "storeId"> & { status?: Order["status"] }): Promise<Order> {
  const { data, error } = await supabase.from("orders").insert({
    store_id: storeId,
    customer_name: o.customerName,
    customer_email: o.customerEmail,
    customer_phone: o.customerPhone,
    shipping_address: o.shippingAddress,
    items: o.items as unknown as never,
    total: o.total,
    status: o.status ?? "pending",
    notes: o.notes,
  }).select().single();
  if (error) throw error;
  return fromDb(data as unknown as DbOrder);
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}