export interface Store {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  createdAt: string;
}

export interface Product {
  id: string;
  storeId: string;
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
  storeId: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface Post {
  id: string;
  storeId: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  status: "draft" | "published" | "archived";
  author: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  storeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  notes: string;
  createdAt: string;
}