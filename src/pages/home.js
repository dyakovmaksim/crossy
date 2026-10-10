import { card, asset } from "../components/ui.js";
export function home(root, products, favorites) {
  const featured = products[1];
  root.innerHTML = `<section class="hero"><div><p class="muted">Коллекция. {на каждый день}</p><h1>Кроссы.<br>И точка.</h1><p>Знакомые силуэты и новые любимые пары.<br>Найди свою в нашей коллекции.</p><a class="button" href="catalog.html">Смотреть каталог</a></div><img src="${asset(featured.images[0])}" width="700" height="480" alt="${featured.name}"></section><section><div class="section-heading"><h2>Популярные модели</h2><a href="catalog.html">Вся коллекция</a></div><div class="grid">${products
    .slice(0, 3)
    .map((p) => card(p, favorites))
    .join(
      "",
    )}</div></section><section><div class="section-heading"><h2>Новинки</h2><a href="catalog.html?new=1">Все новинки</a></div><div class="grid">${products
    .filter((p) => p.isNew)
    .slice(0, 3)
    .map((p) => card(p, favorites))
    .join("")}</div></section>`;
}
