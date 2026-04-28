import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Package, FileText, ShoppingCart, Tags, Store, Zap, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/posts", label: "Posts", icon: FileText },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/shop-info", label: "Shop Info", icon: Store },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-[0_0_20px_-4px_hsl(var(--primary))]">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">Voltaic</p>
          <p className="text-[10px] text-muted-foreground">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? router.pathname === "/" : router.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_-6px_hsl(var(--primary))]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <a
          href="/store"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-3 ring-1 ring-primary/20 transition-all hover:from-primary/20 hover:to-accent/20 hover:ring-primary/40"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-vibrant text-white">
            <Store className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold">Xem Store</p>
            <p className="text-[10px] text-muted-foreground">Preview cho khách</p>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </a>
      </div>
    </aside>
  );
}