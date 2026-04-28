import { supabase } from "@/integrations/supabase/client";
import { ShopInfo } from "@/types";

interface DbShopInfo {
  id: number;
  name: string;
  tagline: string;
  description: string;
  logo_url: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

const fromDb = (r: DbShopInfo): ShopInfo => ({
  id: r.id,
  name: r.name,
  tagline: r.tagline,
  description: r.description,
  logoUrl: r.logo_url,
  email: r.email,
  phone: r.phone,
  address: r.address,
  facebook: r.facebook,
  instagram: r.instagram,
  twitter: r.twitter,
});

export async function getShopInfo(): Promise<ShopInfo | null> {
  const { data, error } = await supabase.from("shop_info").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data ? fromDb(data as DbShopInfo) : null;
}

export async function updateShopInfo(s: Partial<Omit<ShopInfo, "id">>): Promise<ShopInfo> {
  const payload: Record<string, unknown> = {};
  if (s.name !== undefined) payload.name = s.name;
  if (s.tagline !== undefined) payload.tagline = s.tagline;
  if (s.description !== undefined) payload.description = s.description;
  if (s.logoUrl !== undefined) payload.logo_url = s.logoUrl;
  if (s.email !== undefined) payload.email = s.email;
  if (s.phone !== undefined) payload.phone = s.phone;
  if (s.address !== undefined) payload.address = s.address;
  if (s.facebook !== undefined) payload.facebook = s.facebook;
  if (s.instagram !== undefined) payload.instagram = s.instagram;
  if (s.twitter !== undefined) payload.twitter = s.twitter;
  const { data, error } = await supabase.from("shop_info").update(payload).eq("id", 1).select().single();
  if (error) throw error;
  return fromDb(data as DbShopInfo);
}