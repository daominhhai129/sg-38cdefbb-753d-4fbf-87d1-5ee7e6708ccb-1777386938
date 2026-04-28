import { Product, Category, Post, Order, ShopInfo } from "@/types";

const KEYS = {
  products: "admin_products",
  categories: "admin_categories",
  posts: "admin_posts",
  orders: "admin_orders",
  shopInfo: "admin_shop_info",
  seeded: "admin_seeded_v3",
} as const;

const sampleCategories: Category[] = [
  { id: "c1", name: "Electronics", color: "#3B82F6", createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: "c2", name: "Fashion", color: "#EC4899", createdAt: new Date(Date.now() - 86400000 * 25).toISOString() },
  { id: "c3", name: "Home & Garden", color: "#10B981", createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: "c4", name: "Books", color: "#F59E0B", createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: "c5", name: "Beauty", color: "#8B5CF6", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: "c6", name: "Sports", color: "#EF4444", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];

const sampleProducts: Product[] = [
  { id: "p1", name: "Wireless Headphones Pro", description: "<p>Premium <strong>noise-cancelling</strong> over-ear headphones with 40-hour battery life.</p><ul><li>Active noise cancellation</li><li>Bluetooth 5.3</li><li>Premium leather cushions</li></ul>", price: 5990000, categoryId: "c1", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600"], videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", status: "active", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "p2", name: "Smart Watch Series 8", description: "<p>Fitness tracking with <em>continuous</em> heart rate monitor and ECG.</p>", price: 9590000, categoryId: "c1", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"], videoUrl: "", status: "active", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "p3", name: "Cotton Crew Tee", description: "<p>Soft 100% organic cotton t-shirt. Available in multiple colors.</p>", price: 720000, categoryId: "c2", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"], videoUrl: "", status: "active", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: "p4", name: "Denim Jacket", description: "<p>Classic <strong>vintage wash</strong> denim jacket with copper buttons.</p>", price: 2150000, categoryId: "c2", images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"], videoUrl: "", status: "out_of_stock", createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: "p5", name: "Modern Floor Lamp", description: "<p>Minimalist LED floor lamp with adjustable dimmer and warm color temperature.</p>", price: 3820000, categoryId: "c3", images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"], videoUrl: "", status: "active", createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: "p6", name: "The Design Handbook", description: "<p>Essential reading for modern designers. <em>Covers typography, color, and layout.</em></p>", price: 850000, categoryId: "c4", images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600"], videoUrl: "", status: "active", createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: "p7", name: "Vitamin C Serum", description: "<p>Brightening serum with hyaluronic acid and antioxidants.</p>", price: 1150000, categoryId: "c5", images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"], videoUrl: "", status: "active", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "p8", name: "Yoga Mat Premium", description: "<p>Eco-friendly non-slip yoga mat. 6mm thick natural rubber.</p>", price: 1620000, categoryId: "c6", images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600"], videoUrl: "", status: "active", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: "p9", name: "Bluetooth Speaker Mini", description: "<p>Portable waterproof speaker with 24-hour playtime.</p>", price: 1920000, categoryId: "c1", images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"], videoUrl: "", status: "draft", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "p10", name: "Ceramic Plant Pot Set", description: "<p>Set of 3 minimalist ceramic pots in matte finish.</p>", price: 1010000, categoryId: "c3", images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600"], videoUrl: "", status: "active", createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
];

const samplePosts: Post[] = [
  { id: "post1", title: "Summer Collection Launch", content: "<p>Check out our new summer collection featuring vibrant colors and lightweight fabrics.</p>", slug: "summer-collection-2024", status: "published", author: "Admin", createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
  { id: "post2", title: "Black Friday Sale", content: "<p>Up to 50% off on selected items. Limited time only!</p>", slug: "black-friday-sale", status: "published", author: "Admin", createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: "post3", title: "New Store Opening", content: "<p>We're excited to announce our new flagship store opening next month.</p>", slug: "new-store-opening", status: "draft", author: "Admin", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
];

const sampleOrders: Order[] = [
  { id: "o1", customerName: "Nguyễn Văn A", customerEmail: "nguyenvana@example.com", customerPhone: "0901234567", items: [{ productId: "p1", productName: "Wireless Headphones Pro", quantity: 1, price: 5990000 }], total: 5990000, status: "delivered", notes: "Giao hàng nhanh", createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: "o2", customerName: "Trần Thị B", customerEmail: "tranthib@example.com", customerPhone: "0912345678", items: [{ productId: "p3", productName: "Cotton Crew Tee", quantity: 3, price: 720000 }], total: 2160000, status: "processing", notes: "", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "o3", customerName: "Lê Văn C", customerEmail: "levanc@example.com", customerPhone: "0923456789", items: [{ productId: "p2", productName: "Smart Watch Series 8", quantity: 1, price: 9590000 }, { productId: "p7", productName: "Vitamin C Serum", quantity: 2, price: 1150000 }], total: 11890000, status: "shipped", notes: "Giao giờ hành chính", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

const defaultShopInfo: ShopInfo = {
  name: "Electric Store",
  tagline: "Premium products, delivered fast",
  email: "hello@electricstore.com",
  phone: "+84 901 234 567",
  address: "123 Hai Bà Trưng, Q1, TP.HCM",
  facebook: "https://facebook.com/electricstore",
  instagram: "https://instagram.com/electricstore",
  twitter: "https://twitter.com/electricstore",
};

function seed() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEYS.seeded)) return;
  localStorage.setItem(KEYS.products, JSON.stringify(sampleProducts));
  localStorage.setItem(KEYS.categories, JSON.stringify(sampleCategories));
  localStorage.setItem(KEYS.posts, JSON.stringify(samplePosts));
  localStorage.setItem(KEYS.orders, JSON.stringify(sampleOrders));
  localStorage.setItem(KEYS.shopInfo, JSON.stringify(defaultShopInfo));
  localStorage.setItem(KEYS.seeded, "true");
}

seed();

export const storage = {
  products: {
    list: (): Product[] => JSON.parse(localStorage.getItem(KEYS.products) || "[]"),
    get: (id: string): Product | undefined => storage.products.list().find((p) => p.id === id),
    create: (p: Omit<Product, "id" | "createdAt">): Product => {
      const item: Product = { ...p, id: `p-${Date.now()}`, createdAt: new Date().toISOString() };
      const all = storage.products.list();
      all.push(item);
      localStorage.setItem(KEYS.products, JSON.stringify(all));
      return item;
    },
    update: (id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): void => {
      const all = storage.products.list();
      const idx = all.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Product not found");
      all[idx] = { ...all[idx], ...updates };
      localStorage.setItem(KEYS.products, JSON.stringify(all));
    },
    delete: (id: string): void => {
      const all = storage.products.list().filter((p) => p.id !== id);
      localStorage.setItem(KEYS.products, JSON.stringify(all));
    },
  },
  categories: {
    list: (): Category[] => JSON.parse(localStorage.getItem(KEYS.categories) || "[]"),
    get: (id: string): Category | undefined => storage.categories.list().find((c) => c.id === id),
    create: (c: Omit<Category, "id" | "createdAt">): Category => {
      const item: Category = { ...c, id: `c-${Date.now()}`, createdAt: new Date().toISOString() };
      const all = storage.categories.list();
      all.push(item);
      localStorage.setItem(KEYS.categories, JSON.stringify(all));
      return item;
    },
    update: (id: string, updates: Partial<Omit<Category, "id" | "createdAt">>): void => {
      const all = storage.categories.list();
      const idx = all.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error("Category not found");
      all[idx] = { ...all[idx], ...updates };
      localStorage.setItem(KEYS.categories, JSON.stringify(all));
    },
    delete: (id: string): void => {
      const all = storage.categories.list().filter((c) => c.id !== id);
      localStorage.setItem(KEYS.categories, JSON.stringify(all));
    },
  },
  posts: {
    list: (): Post[] => JSON.parse(localStorage.getItem(KEYS.posts) || "[]"),
    get: (id: string): Post | undefined => storage.posts.list().find((p) => p.id === id),
    create: (p: Omit<Post, "id" | "createdAt">): Post => {
      const item: Post = { ...p, id: `post-${Date.now()}`, createdAt: new Date().toISOString() };
      const all = storage.posts.list();
      all.push(item);
      localStorage.setItem(KEYS.posts, JSON.stringify(all));
      return item;
    },
    update: (id: string, updates: Partial<Omit<Post, "id" | "createdAt">>): void => {
      const all = storage.posts.list();
      const idx = all.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Post not found");
      all[idx] = { ...all[idx], ...updates };
      localStorage.setItem(KEYS.posts, JSON.stringify(all));
    },
    delete: (id: string): void => {
      const all = storage.posts.list().filter((p) => p.id !== id);
      localStorage.setItem(KEYS.posts, JSON.stringify(all));
    },
  },
  orders: {
    list: (): Order[] => JSON.parse(localStorage.getItem(KEYS.orders) || "[]"),
    get: (id: string): Order | undefined => storage.orders.list().find((o) => o.id === id),
    create: (o: Omit<Order, "id" | "createdAt">): Order => {
      const item: Order = { ...o, id: `o-${Date.now()}`, createdAt: new Date().toISOString() };
      const all = storage.orders.list();
      all.push(item);
      localStorage.setItem(KEYS.orders, JSON.stringify(all));
      return item;
    },
    update: (id: string, updates: Partial<Omit<Order, "id" | "createdAt">>): void => {
      const all = storage.orders.list();
      const idx = all.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error("Order not found");
      all[idx] = { ...all[idx], ...updates };
      localStorage.setItem(KEYS.orders, JSON.stringify(all));
    },
    delete: (id: string): void => {
      const all = storage.orders.list().filter((o) => o.id !== id);
      localStorage.setItem(KEYS.orders, JSON.stringify(all));
    },
  },
  shopInfo: {
    get: (): ShopInfo => JSON.parse(localStorage.getItem(KEYS.shopInfo) || JSON.stringify(defaultShopInfo)),
    update: (updates: Partial<ShopInfo>): void => {
      const current = storage.shopInfo.get();
      localStorage.setItem(KEYS.shopInfo, JSON.stringify({ ...current, ...updates }));
    },
  },
};