import { Product, Post, Order, Category, ShopInfo } from "@/types";

const KEYS = {
  products: "admin_products",
  posts: "admin_posts",
  orders: "admin_orders",
  categories: "admin_categories",
  shopInfo: "admin_shop_info",
  seeded: "admin_seeded_v1",
} as const;

export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const storageKeys = KEYS;

const sampleCategories: Category[] = [
  { id: "c1", name: "Electronics", slug: "electronics", description: "Gadgets and devices", color: "#4F46E5" },
  { id: "c2", name: "Apparel", slug: "apparel", description: "Clothing and accessories", color: "#F43F5E" },
  { id: "c3", name: "Home & Living", slug: "home", description: "Furniture and decor", color: "#10B981" },
  { id: "c4", name: "Books", slug: "books", description: "Print and digital reads", color: "#F59E0B" },
  { id: "c5", name: "Beauty", slug: "beauty", description: "Skincare and cosmetics", color: "#EC4899" },
  { id: "c6", name: "Sports", slug: "sports", description: "Fitness and outdoor gear", color: "#06B6D4" },
];

const sampleProducts: Product[] = [
  { id: "p1", name: "Wireless Headphones Pro", description: "Premium noise-cancelling over-ear headphones", price: 249.99, categoryId: "c1", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", status: "active", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "p2", name: "Smart Watch Series 8", description: "Fitness tracking with heart rate monitor", price: 399.0, categoryId: "c1", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", status: "active", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "p3", name: "Cotton Crew Tee", description: "Soft 100% organic cotton t-shirt", price: 29.99, categoryId: "c2", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", status: "active", createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: "p4", name: "Denim Jacket", description: "Classic vintage wash denim jacket", price: 89.5, categoryId: "c2", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", status: "out_of_stock", createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: "p5", name: "Modern Floor Lamp", description: "Minimalist LED floor lamp with dimmer", price: 159.0, categoryId: "c3", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400", status: "active", createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: "p6", name: "The Design Handbook", description: "Essential reading for modern designers", price: 34.95, categoryId: "c4", imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", status: "active", createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: "p7", name: "Vitamin C Serum", description: "Brightening serum with hyaluronic acid", price: 48.0, categoryId: "c5", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", status: "active", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "p8", name: "Yoga Mat Premium", description: "Eco-friendly non-slip yoga mat", price: 68.0, categoryId: "c6", imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400", status: "active", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: "p9", name: "Bluetooth Speaker Mini", description: "Portable waterproof speaker", price: 79.99, categoryId: "c1", imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", status: "draft", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "p10", name: "Ceramic Plant Pot Set", description: "Set of 3 minimalist ceramic pots", price: 42.0, categoryId: "c3", imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400", status: "active", createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
];

const samplePosts: Post[] = [
  { id: "po1", title: "Spring Collection 2026 Launch", content: "We're thrilled to introduce our latest spring collection featuring vibrant colors and sustainable materials.", author: "Sarah Chen", status: "published", imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "po2", title: "How to Style Minimalist Spaces", content: "Less is more. Here's our guide to creating warm, minimalist living spaces.", author: "Marcus Lee", status: "published", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "po3", title: "Summer Sale Preview", content: "Get ready for our biggest summer sale yet. Up to 50% off select items.", author: "Sarah Chen", status: "draft", imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: "po4", title: "Sustainability Report Q1", content: "Our commitment to sustainable practices and eco-friendly packaging.", author: "David Park", status: "published", imageUrl: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600", createdAt: new Date(Date.now() - 86400000 * 14).toISOString() },
  { id: "po5", title: "Customer Story: Emma's Journey", content: "Featured customer shares how our products transformed her daily routine.", author: "Marcus Lee", status: "archived", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600", createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: "po6", title: "Behind the Scenes: Photo Shoot", content: "Take a peek behind the scenes of our latest campaign photoshoot.", author: "David Park", status: "draft", imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
];

const sampleOrders: Order[] = [
  { id: "o1", orderNumber: "ORD-1024", customerName: "Alice Johnson", customerEmail: "alice@example.com", items: [{ productName: "Wireless Headphones Pro", quantity: 1, price: 249.99 }], total: 249.99, status: "delivered", createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: "o2", orderNumber: "ORD-1025", customerName: "Bob Smith", customerEmail: "bob@example.com", items: [{ productName: "Smart Watch Series 8", quantity: 1, price: 399.0 }, { productName: "Cotton Crew Tee", quantity: 2, price: 29.99 }], total: 458.98, status: "shipped", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "o3", orderNumber: "ORD-1026", customerName: "Carol Davis", customerEmail: "carol@example.com", items: [{ productName: "Yoga Mat Premium", quantity: 1, price: 68.0 }], total: 68.0, status: "processing", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: "o4", orderNumber: "ORD-1027", customerName: "David Wilson", customerEmail: "david@example.com", items: [{ productName: "Modern Floor Lamp", quantity: 2, price: 159.0 }], total: 318.0, status: "pending", createdAt: new Date().toISOString() },
  { id: "o5", orderNumber: "ORD-1028", customerName: "Eva Martinez", customerEmail: "eva@example.com", items: [{ productName: "Vitamin C Serum", quantity: 3, price: 48.0 }], total: 144.0, status: "delivered", createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
  { id: "o6", orderNumber: "ORD-1029", customerName: "Frank Brown", customerEmail: "frank@example.com", items: [{ productName: "The Design Handbook", quantity: 1, price: 34.95 }], total: 34.95, status: "delivered", createdAt: new Date(Date.now() - 86400000 * 9).toISOString() },
  { id: "o7", orderNumber: "ORD-1030", customerName: "Grace Lee", customerEmail: "grace@example.com", items: [{ productName: "Bluetooth Speaker Mini", quantity: 1, price: 79.99 }, { productName: "Ceramic Plant Pot Set", quantity: 1, price: 42.0 }], total: 121.99, status: "cancelled", createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: "o8", orderNumber: "ORD-1031", customerName: "Henry Garcia", customerEmail: "henry@example.com", items: [{ productName: "Denim Jacket", quantity: 1, price: 89.5 }], total: 89.5, status: "shipped", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "o9", orderNumber: "ORD-1032", customerName: "Iris Chen", customerEmail: "iris@example.com", items: [{ productName: "Cotton Crew Tee", quantity: 4, price: 29.99 }], total: 119.96, status: "processing", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "o10", orderNumber: "ORD-1033", customerName: "Jack Taylor", customerEmail: "jack@example.com", items: [{ productName: "Wireless Headphones Pro", quantity: 1, price: 249.99 }, { productName: "Smart Watch Series 8", quantity: 1, price: 399.0 }], total: 648.99, status: "delivered", createdAt: new Date(Date.now() - 86400000 * 18).toISOString() },
  { id: "o11", orderNumber: "ORD-1034", customerName: "Kate White", customerEmail: "kate@example.com", items: [{ productName: "Modern Floor Lamp", quantity: 1, price: 159.0 }], total: 159.0, status: "pending", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "o12", orderNumber: "ORD-1035", customerName: "Leo Anderson", customerEmail: "leo@example.com", items: [{ productName: "Yoga Mat Premium", quantity: 2, price: 68.0 }], total: 136.0, status: "shipped", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];

const defaultShopInfo: ShopInfo = {
  name: "Voltaic Goods",
  tagline: "Curated essentials for modern living",
  description: "We design and source thoughtfully crafted products that bring energy and intention to everyday life.",
  logoUrl: "",
  email: "hello@voltaicgoods.com",
  phone: "+1 (555) 123-4567",
  address: "1247 Market Street, San Francisco, CA 94103",
  facebook: "https://facebook.com/voltaicgoods",
  instagram: "https://instagram.com/voltaicgoods",
  twitter: "https://twitter.com/voltaicgoods",
};

export function seedIfNeeded(): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(KEYS.seeded)) return;
  setItem(KEYS.categories, sampleCategories);
  setItem(KEYS.products, sampleProducts);
  setItem(KEYS.posts, samplePosts);
  setItem(KEYS.orders, sampleOrders);
  setItem(KEYS.shopInfo, defaultShopInfo);
  window.localStorage.setItem(KEYS.seeded, "true");
}

export function getProducts(): Product[] { return getItem<Product[]>(KEYS.products, []); }
export function setProducts(v: Product[]): void { setItem(KEYS.products, v); }
export function getPosts(): Post[] { return getItem<Post[]>(KEYS.posts, []); }
export function setPosts(v: Post[]): void { setItem(KEYS.posts, v); }
export function getOrders(): Order[] { return getItem<Order[]>(KEYS.orders, []); }
export function setOrders(v: Order[]): void { setItem(KEYS.orders, v); }
export function getCategories(): Category[] { return getItem<Category[]>(KEYS.categories, []); }
export function setCategories(v: Category[]): void { setItem(KEYS.categories, v); }
export function getShopInfo(): ShopInfo { return getItem<ShopInfo>(KEYS.shopInfo, defaultShopInfo); }
export function setShopInfo(v: ShopInfo): void { setItem(KEYS.shopInfo, v); }