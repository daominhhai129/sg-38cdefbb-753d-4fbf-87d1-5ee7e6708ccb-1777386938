import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Store } from "@/types";
import { listAllStores } from "@/services/storeService";
import { Card } from "@/components/ui/card";

export default function MarketplacePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAllStores().then((s) => { setStores(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head><title>Marketplace</title></Head>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-vibrant text-white"><ShoppingBag className="h-5 w-5" /></div>
              <p className="text-lg font-bold">Marketplace</p>
            </div>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Sell on this platform &rarr;</Link>
          </div>
        </header>
        <section className="bg-gradient-vibrant py-16 text-center text-white">
          <div className="container mx-auto px-4">
            <h1 className="mb-3 text-4xl font-bold md:text-5xl">Discover unique stores</h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90">Browse independent shops from creators and small businesses.</p>
          </div>
        </section>
        <section className="container mx-auto px-4 py-12">
          <h2 className="mb-6 text-2xl font-bold">All stores ({stores.length})</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading stores...</p>
          ) : stores.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No stores yet. <Link href="/login" className="text-primary hover:underline">Be the first to open one</Link></p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((s) => (
                <Link key={s.id} href={`/store/${s.slug}`} className="group">
                  <Card className="h-full p-6 transition-shadow hover:shadow-lg">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-vibrant text-white"><ShoppingBag className="h-6 w-6" /></div>
                    <h3 className="mb-1 text-lg font-bold group-hover:text-primary">{s.name}</h3>
                    {s.tagline && <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{s.tagline}</p>}
                    <div className="mt-auto flex items-center text-sm text-primary">Visit store <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" /></div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}