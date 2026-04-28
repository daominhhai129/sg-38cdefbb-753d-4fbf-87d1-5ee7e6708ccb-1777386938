export interface CartItem {
  productId: string;
  quantity: number;
}

const CART_KEY = "store_cart";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function write(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(productId: string, quantity: number): void {
  const items = read();
  const existing = items.find((i) => i.productId === productId);
  if (existing) existing.quantity += quantity;
  else items.push({ productId, quantity });
  write(items);
}

export function updateCartItem(productId: string, quantity: number): void {
  const items = read();
  const item = items.find((i) => i.productId === productId);
  if (item) {
    item.quantity = quantity;
    write(items);
  }
}

export function removeFromCart(productId: string): void {
  write(read().filter((i) => i.productId !== productId));
}

export function getCart(): CartItem[] {
  return read();
}

export function clearCart(): void {
  write([]);
}

export function cartCount(): number {
  return read().reduce((s, i) => s + i.quantity, 0);
}