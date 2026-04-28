import { useEffect, useState } from "react";
import { Post } from "@/types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onSave: (post: Post) => void;
}

const empty: Omit<Post, "id" | "createdAt"> = {
  title: "",
  content: "",
  author: "",
  status: "draft",
  imageUrl: "",
};

export function PostForm({ open, onOpenChange, post, onSave }: PostFormProps) {
  const [form, setForm] = useState({ ...empty });

  useEffect(() => {
    if (post) {
      const { id: _id, createdAt: _c, ...rest } = post;
      setForm(rest);
    } else {
      setForm({ ...empty });
    }
  }, [post, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const saved: Post = {
      id: post?.id ?? `po-${Date.now()}`,
      createdAt: post?.createdAt ?? new Date().toISOString(),
      ...form,
    };
    onSave(saved);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-lg">
        <DialogHeader><DialogTitle>{post ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: Post["status"]) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="img">Cover Image URL</Label>
            <Input id="img" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">{post ? "Save Changes" : "Create Post"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}