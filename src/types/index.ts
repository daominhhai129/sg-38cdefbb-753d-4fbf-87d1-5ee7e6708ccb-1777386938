export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  videoUrl: string;
  status: "active" | "draft" | "out_of_stock";
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: "published" | "draft";
  author: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes: string;
  createdAt: string;
}

export interface ShopInfo {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
}