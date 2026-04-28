import { supabase } from "@/integrations/supabase/client";

const BUCKET = "product-images";

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProductImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const f of files) urls.push(await uploadProductImage(f));
  return urls;
}

export async function deleteProductImage(url: string): Promise<void> {
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  await supabase.storage.from(BUCKET).remove([path]);
}