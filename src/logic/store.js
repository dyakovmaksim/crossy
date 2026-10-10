import products from "../data/products.json";
import { createStorage } from "./storage.js";
import { sanitizeCart, addItem, changeQuantity, removeItem } from "./cart.js";
const storage = createStorage();
export const keys = {
  cart: "crossy.cart.v1",
  favorites: "crossy.favorites.v1",
};
const cleanFavorites = (value) =>
  Array.isArray(value)
    ? [...new Set(value.filter((id) => products.some((p) => p.id === id)))]
    : [];
let cart = sanitizeCart(storage.read(keys.cart, []), products);
let favorites = cleanFavorites(storage.read(keys.favorites, []));
const listeners = new Set();
function emit() {
  listeners.forEach((listener) => listener());
}
function save() {
  storage.write(keys.cart, cart);
  storage.write(keys.favorites, favorites);
  emit();
}
export const store = {
  getCart: () => cart.map((item) => ({ ...item })),
  getFavorites: () => [...favorites],
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  toggleFavorite(id) {
    if (!products.some((p) => p.id === id)) return;
    favorites = favorites.includes(id)
      ? favorites.filter((value) => value !== id)
      : [...favorites, id];
    save();
  },
  add(id, size) {
    const p = products.find((p) => p.id === id);
    if (p?.sizes.includes(size)) {
      cart = addItem(cart, id, size);
      save();
    }
  },
  quantity(id, size, value) {
    cart = changeQuantity(cart, id, size, value);
    save();
  },
  remove(id, size) {
    cart = removeItem(cart, id, size);
    save();
  },
  clearCart() {
    cart = [];
    save();
  },
};
window.addEventListener("storage", (event) => {
  if (event.key === null || Object.values(keys).includes(event.key)) {
    cart = sanitizeCart(storage.read(keys.cart, []), products);
    favorites = cleanFavorites(storage.read(keys.favorites, []));
    emit();
  }
});
