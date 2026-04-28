<![CDATA[export interface CartItem {
  productId: string;
  quantity: number;
}

const CART_KEY = "stor
...
> => p.productId === productId).quantity || 0
    : items.reduce((s, i) => s + i.quantity, 0);
}
]]>

[Tool result trimmed: kept first 100 chars and last 100 chars of 1438 chars.]