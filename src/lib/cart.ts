export interface CartItem {
  productId: string;
  storeId: string;
  quantity: number;
}

const CART_KEY = "store_cart";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(CART_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function write(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCart(): CartItem[] { return read(); }

export function addToCart(productId: string, qty: number = 1, storeId: string = ""): void {
  const cart = read();
  const existing = cart.find((c) => c.productId === productId);
  if (existing) existing.quantity += qty;
  else cart.push({ productId, storeId, quantity: qty });
  write(cart);
}

export function updateQuantity(productId: string, qty: number): void {
  let cart = read();
  if (qty <= 0) cart = cart.filter((c) => c.productId !== productId);
  else cart = cart.map((c) => (c.productId === productId ? { ...c, quantity: qty } : c));
  write(cart);
}

export function removeFromCart(productId: string): void { write(read().filter((c) => c.productId !== productId)); }
export function clearCart(): void { write([]); }
export function cartCount(): number { return read().reduce((s, i) => s + i.quantity, 0); }