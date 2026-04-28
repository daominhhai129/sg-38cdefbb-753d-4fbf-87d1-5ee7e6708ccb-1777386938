import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  images: string[];
  video_url: string;
  status: "active" | "draft" | "out_of_stock";
  created_at: string;
}

const fromDb = (r: DbProduct): Product => ({
  id: r.id,
  name: r.name,
  description: r.description,
  price: Number(r.price),
  categoryId: r.category_id ?? "",
  images: r.images ?? [],
  videoUrl: r.video_url,
  status: r.status,
  createdAt: r.created_at,
});

export async function listProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => fromDb(r as DbProduct));
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? fromDb(data as DbProduct) : null;
}

export async function createProduct(p: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const { data, error } = await supabase.from("products").insert({
    name: p.name,
    description: p.description,
    price: p.price,
    category_id: p.categoryId || null,
    images: p.images,
    video_url: p.videoUrl,
    status: p.status,
  }).select().single();
  if (error) throw error;
  return fromDb(data as DbProduct);
}

export async function updateProduct(id: string, p: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product> {
  const payload: Record<string, unknown> = {};
  if (p.name !== undefined) payload.name = p.name;
  if (p.description !== undefined) payload.description = p.description;
  if (p.price !== undefined) payload.price = p.price;
  if (p.categoryId !== undefined) payload.category_id = p.categoryId || null;
  if (p.images !== undefined) payload.images = p.images;
  if (p.videoUrl !== undefined) payload.video_url = p.videoUrl;
  if (p.status !== undefined) payload.status = p.status;
  const { data, error } = await supabase.from("products").update(payload as never).eq("id", id).select().single();
  if (error) throw error;
  return fromDb(data as DbProduct);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}