export function sanitizeCart(value, products) {
  if (!Array.isArray(value)) return [];
  return value.reduce((cart, item) => {
    if (!item || typeof item !== "object") return cart;
    const product = products.find((p) => p.id === item.productId);
    if (
      !product ||
      !product.sizes.includes(item.size) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    )
      return cart;
    return addItem(cart, item.productId, item.size, item.quantity);
  }, []);
}
export function addItem(cart, productId, size, quantity = 1) {
  if (!Number.isSafeInteger(quantity) || quantity < 1) return cart;
  const found = cart.find(
    (item) => item.productId === productId && item.size === size,
  );
  return found
    ? cart.map((item) =>
        item === found
          ? {
              ...item,
              quantity: Math.min(
                Number.MAX_SAFE_INTEGER,
                item.quantity + quantity,
              ),
            }
          : item,
      )
    : [...cart, { productId, size, quantity }];
}
export function changeQuantity(cart, productId, size, quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 1) return cart;
  return cart.map((item) =>
    item.productId === productId && item.size === size
      ? { ...item, quantity }
      : item,
  );
}
export const removeItem = (cart, productId, size) =>
  cart.filter((item) => item.productId !== productId || item.size !== size);
export const cartTotal = (cart, products) =>
  cart.reduce(
    (sum, item) =>
      sum +
      (products.find((p) => p.id === item.productId)?.price || 0) *
        item.quantity,
    0,
  );
