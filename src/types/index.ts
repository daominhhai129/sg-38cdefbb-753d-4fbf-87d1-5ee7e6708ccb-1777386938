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

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  status: "draft" | "published" | "archived";
  imageUrl: string;
  createdAt: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface ShopInfo {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
}