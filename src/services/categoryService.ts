import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types";

interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  created_at: string;
}

const fromDb = (r: DbCategory): Category => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  description: r.description,
  color: r.color,
  createdAt: r.created_at,
});

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return (data ?? []).map((r) => fromDb(r as DbCategory));
}

export async function createCategory(c: Omit<Category, "id" | "createdAt">): Promise<Category> {
  const { data, error } = await supabase.from("categories").insert({
    name: c.name, slug: c.slug, description: c.description, color: c.color,
  }).select().single();
  if (error) throw error;
  return fromDb(data as DbCategory);
}

export async function updateCategory(id: string, c: Partial<Omit<Category, "id" | "createdAt">>): Promise<Category> {
  const { data, error } = await supabase.from("categories").update(c).eq("id", id).select().single();
  if (error) throw error;
  return fromDb(data as DbCategory);
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}