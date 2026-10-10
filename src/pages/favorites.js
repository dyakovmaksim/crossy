import { card, empty } from "../components/ui.js";
export function favoritesPage(root, products, store) {
  function render() {
    const ids = store.getFavorites();
    const saved = products.filter((p) => ids.includes(p.id));
    root.innerHTML = `<h1>Избранное <span class="muted">${saved.length}</span></h1>${saved.length ? `<div class="grid">${saved.map((p) => card(p, ids)).join("")}</div>` : empty("Здесь будут любимые пары", "Нажмите на сердечко у товара, чтобы сохранить его на потом.")}`;
  }
  store.subscribe(() => {
    const focused = document.activeElement?.dataset.favorite;
    const oldButtons = [...root.querySelectorAll("[data-favorite]")];
    const index = oldButtons.findIndex((b) => b.dataset.favorite === focused);
    render();
    if (focused) {
      const buttons = root.querySelectorAll("[data-favorite]");
      (
        buttons[Math.min(index, buttons.length - 1)] ||
        root.querySelector(".button")
      )?.focus();
    }
  });
  render();
}
