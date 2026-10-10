export const normalize = (value) =>
  String(value).trim().toLocaleLowerCase("ru").replace(/\s+/g, " ");
export function filterProducts(products, state = {}) {
  const query = normalize(state.q || "");
  return products
    .filter(
      (p) =>
        normalize(`${p.name} ${p.brand}`).includes(query) &&
        (!state.brands?.length || state.brands.includes(p.brand)) &&
        (!state.size || p.sizes.includes(Number(state.size))) &&
        (!state.min || p.price >= Number(state.min)) &&
        (!state.max || p.price <= Number(state.max)) &&
        (!state.newOnly || p.isNew),
    )
    .sort((a, b) =>
      state.sort === "price-asc"
        ? a.price - b.price
        : state.sort === "price-desc"
          ? b.price - a.price
          : a.name.localeCompare(b.name, "ru"),
    );
}
export function readFilters(search) {
  const p = new URLSearchParams(search);
  return {
    q: p.get("q") || "",
    brands: p.getAll("brand"),
    size: p.get("size") || "",
    min: p.get("min") || "",
    max: p.get("max") || "",
    newOnly: p.get("new") === "1",
    sort: p.get("sort") || "name",
  };
}
export function filtersToSearch(s) {
  const p = new URLSearchParams();
  for (const key of ["q", "size", "min", "max", "sort"])
    if (s[key]) p.set(key, s[key]);
  s.brands.forEach((b) => p.append("brand", b));
  if (s.newOnly) p.set("new", "1");
  return p.toString();
}
