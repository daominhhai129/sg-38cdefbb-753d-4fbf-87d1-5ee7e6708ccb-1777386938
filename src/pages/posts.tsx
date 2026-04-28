import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostForm } from "@/components/posts/PostForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { seedIfNeeded, getPosts, setPosts as savePosts } from "@/lib/storage";
import { Post } from "@/types";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

const statusStyles: Record<Post["status"], string> = {
  published: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  draft: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  archived: "bg-muted-foreground/15 text-muted-foreground ring-1 ring-muted-foreground/30",
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    seedIfNeeded();
    setPosts(getPosts());
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  const handleSave = (p: Post) => {
    const exists = posts.some((x) => x.id === p.id);
    const next = exists ? posts.map((x) => (x.id === p.id ? p : x)) : [p, ...posts];
    setPosts(next);
    savePosts(next);
    toast({ title: exists ? "Post updated" : "Post created", description: p.title });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const next = posts.filter((p) => p.id !== deleteId);
    setPosts(next);
    savePosts(next);
    setDeleteId(null);
    toast({ title: "Post deleted" });
  };

  return (
    <>
      <SEO title="Posts | Voltaic Admin" description="Manage blog posts" />
      <DashboardLayout
        title="Posts"
        description={`${posts.length} posts total`}
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        }
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-border bg-muted pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden border-border bg-card transition-all hover:border-primary/40">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" /> : <FileText className="h-full w-full p-12 text-muted-foreground" />}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <Badge className={`${statusStyles[p.status]} border-0 capitalize`}>{p.status}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(p); setFormOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                <h3 className="mt-3 line-clamp-2 font-semibold leading-snug">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.content}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.author || "Anonymous"}</span>
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="col-span-full border-border bg-card p-12 text-center text-muted-foreground">No posts found</Card>
          )}
        </div>
        <PostForm open={formOpen} onOpenChange={setFormOpen} post={editing} onSave={handleSave} />
        <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete post?" description="This action cannot be undone." onConfirm={handleDelete} />
      </DashboardLayout>
    </>
  );
}