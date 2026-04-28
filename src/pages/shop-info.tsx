import { useEffect, useState } from "react";
import { Save, Store, Mail, Share2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { seedIfNeeded, getShopInfo, setShopInfo as saveShopInfo } from "@/lib/storage";
import { ShopInfo } from "@/types";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

export default function ShopInfoPage() {
  const [form, setForm] = useState<ShopInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    seedIfNeeded();
    setForm(getShopInfo());
  }, []);

  const update = (patch: Partial<ShopInfo>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    saveShopInfo(form);
    toast({ title: "Shop info saved", description: "Changes persisted to localStorage" });
  };

  if (!form) return null;

  return (
    <>
      <SEO title="Shop Info | Voltaic Admin" description="Configure shop settings" />
      <DashboardLayout title="Shop Info" description="Configure your shop details and contact info">
        <form onSubmit={handleSave}>
          <Tabs defaultValue="general">
            <TabsList className="bg-muted">
              <TabsTrigger value="general"><Store className="mr-2 h-4 w-4" />General</TabsTrigger>
              <TabsTrigger value="contact"><Mail className="mr-2 h-4 w-4" />Contact</TabsTrigger>
              <TabsTrigger value="social"><Share2 className="mr-2 h-4 w-4" />Social</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-4">
              <Card className="border-border bg-card p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Shop Name</Label>
                    <Input id="name" value={form.name} onChange={(e) => update({ name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" value={form.tagline} onChange={(e) => update({ tagline: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={form.description} onChange={(e) => update({ description: e.target.value })} rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input id="logo" value={form.logoUrl} onChange={(e) => update({ logoUrl: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-4">
              <Card className="border-border bg-card p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => update({ phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" value={form.address} onChange={(e) => update({ address: e.target.value })} rows={2} />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="mt-4">
              <Card className="border-border bg-card p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fb">Facebook</Label>
                    <Input id="fb" value={form.facebook} onChange={(e) => update({ facebook: e.target.value })} placeholder="https://facebook.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ig">Instagram</Label>
                    <Input id="ig" value={form.instagram} onChange={(e) => update({ instagram: e.target.value })} placeholder="https://instagram.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tw">Twitter / X</Label>
                    <Input id="tw" value={form.twitter} onChange={(e) => update({ twitter: e.target.value })} placeholder="https://twitter.com/..." />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="mt-6 flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </form>
      </DashboardLayout>
    </>
  );
}