import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types";

interface DbPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image: string;
  status: "draft" | "published" | "archived";
  author: string;
  created_at: string;
}

const fromDb = (r: DbPost): Post => ({
  id: r.id,
  title: r.title,
  content: r.content,
  excerpt: r.excerpt,
  coverImage: r.cover_image,
  status: r.status,
  author: r.author,
  createdAt: r.created_at,
});

export async function listPosts(): Promise<Post[]> {
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => fromDb(r as DbPost));
}

export async function createPost(p: Omit<Post, "id" | "createdAt">): Promise<Post> {
  const { data, error } = await supabase.from("posts").insert({
    title: p.title, content: p.content, excerpt: p.excerpt,
    cover_image: p.coverImage, status: p.status, author: p.author,
  }).select().single();
  if (error) throw error;
  return fromDb(data as DbPost);
}

export async function updatePost(id: string, p: Partial<Omit<Post, "id" | "createdAt">>): Promise<Post> {
  const payload: Record<string, unknown> = {};
  if (p.title !== undefined) payload.title = p.title;
  if (p.content !== undefined) payload.content = p.content;
  if (p.excerpt !== undefined) payload.excerpt = p.excerpt;
  if (p.coverImage !== undefined) payload.cover_image = p.coverImage;
  if (p.status !== undefined) payload.status = p.status;
  if (p.author !== undefined) payload.author = p.author;
  const { data, error } = await supabase.from("posts").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return fromDb(data as DbPost);
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}