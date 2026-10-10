export const price = (value) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
export function notify(message) {
  const el = document.querySelector("#notice");
  el.textContent = message;
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => (el.textContent = ""), 4500);
}
export const empty = (title, text) =>
  `<div class="empty"><h2>${title}</h2><p>${text}</p><a class="button" href="catalog.html">В каталог</a></div>`;
export function card(p, favorites = []) {
  const saved = favorites.includes(p.id);
  return `<article class="card"><a href="product.html?id=${p.id}"><div class="card-image"><img src="${asset(p.images[0])}" width="500" height="350" loading="lazy" alt="${p.name}">${p.isNew ? '<span class="badge">Новинка</span>' : ""}</div><div class="card-copy"><p class="muted">${p.brand}</p><h3>${p.name}</h3><strong>${price(p.price)}</strong></div></a><button class="favorite" data-favorite="${p.id}" aria-pressed="${saved}" aria-label="${saved ? "Удалить из избранного" : "В избранное"}: ${p.name}">${saved ? "♥" : "♡"}</button></article>`;
}
