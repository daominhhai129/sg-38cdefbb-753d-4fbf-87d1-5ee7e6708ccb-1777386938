import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types";

interface DbCategory {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  created_at: string;
}

const fromDb = (r: DbCategory): Category => ({
  id: r.id,
  storeId: r.store_id,
  name: r.name,
  slug: r.slug,
  description: r.description,
  color: r.color,
  createdAt: r.created_at,
});

export async function listCategories(storeId: string): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").eq("store_id", storeId).order("name");
  if (error) throw error;
  return (data ?? []).map((r) => fromDb(r as DbCategory));
}

export async function createCategory(storeId: string, c: Omit<Category, "id" | "createdAt" | "storeId">): Promise<Category> {
  const { data, error } = await supabase.from("categories").insert({
    store_id: storeId,
    name: c.name, slug: c.slug, description: c.description, color: c.color,
  }).select().single();
  if (error) throw error;
  return fromDb(data as DbCategory);
}

export async function updateCategory(id: string, c: Partial<Omit<Category, "id" | "createdAt" | "storeId">>): Promise<Category> {
  const { data, error } = await supabase.from("categories").update(c as never).eq("id", id).select().single();
  if (error) throw error;
  return fromDb(data as DbCategory);
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}