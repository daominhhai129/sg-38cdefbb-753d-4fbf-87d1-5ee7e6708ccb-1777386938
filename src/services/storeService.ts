import { supabase } from "@/integrations/supabase/client";
import { Store } from "@/types";

interface DbStore {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo_url: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  created_at: string;
}

const fromDb = (r: DbStore): Store => ({
  id: r.id,
  ownerId: r.owner_id,
  name: r.name,
  slug: r.slug,
  tagline: r.tagline,
  description: r.description,
  logoUrl: r.logo_url,
  email: r.email,
  phone: r.phone,
  address: r.address,
  facebook: r.facebook,
  instagram: r.instagram,
  twitter: r.twitter,
  createdAt: r.created_at,
});

export async function getMyStore(): Promise<Store | null> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data, error } = await supabase.from("stores").select("*").eq("owner_id", u.user.id).maybeSingle();
  if (error) throw error;
  return data ? fromDb(data as DbStore) : null;
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const { data, error } = await supabase.from("stores").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? fromDb(data as DbStore) : null;
}

export async function listAllStores(): Promise<Store[]> {
  const { data, error } = await supabase.from("stores").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => fromDb(r as DbStore));
}

export async function updateMyStore(p: Partial<Omit<Store, "id" | "ownerId" | "createdAt">>): Promise<Store> {
  const me = await getMyStore();
  if (!me) throw new Error("No store found for current user");
  const payload: Record<string, unknown> = {};
  if (p.name !== undefined) payload.name = p.name;
  if (p.slug !== undefined) payload.slug = p.slug;
  if (p.tagline !== undefined) payload.tagline = p.tagline;
  if (p.description !== undefined) payload.description = p.description;
  if (p.logoUrl !== undefined) payload.logo_url = p.logoUrl;
  if (p.email !== undefined) payload.email = p.email;
  if (p.phone !== undefined) payload.phone = p.phone;
  if (p.address !== undefined) payload.address = p.address;
  if (p.facebook !== undefined) payload.facebook = p.facebook;
  if (p.instagram !== undefined) payload.instagram = p.instagram;
  if (p.twitter !== undefined) payload.twitter = p.twitter;
  const { data, error } = await supabase.from("stores").update(payload as never).eq("id", me.id).select().single();
  if (error) throw error;
  return fromDb(data as DbStore);
}