import { describe, it, expect } from "vitest";
import products from "../src/data/products.json";
import {
  filterProducts,
  readFilters,
  filtersToSearch,
} from "../src/logic/filters.js";
import {
  addItem,
  changeQuantity,
  removeItem,
  cartTotal,
  sanitizeCart,
} from "../src/logic/cart.js";
import { createStorage } from "../src/logic/storage.js";
import { validateOrder } from "../src/logic/checkout.js";
describe("Каталог", () => {
  it("совмещает поиск, несколько брендов, размер, цену и новинки", () => {
    const data = [
      {
        id: "a",
        name: "Air  Max",
        brand: "Nike",
        sizes: [40],
        price: 10000,
        isNew: true,
      },
      {
        id: "b",
        name: "Air Max",
        brand: "Nike",
        sizes: [41],
        price: 11000,
        isNew: true,
      },
      {
        id: "c",
        name: "Air Max",
        brand: "adidas",
        sizes: [40],
        price: 12000,
        isNew: false,
      },
      {
        id: "d",
        name: "Air Max",
        brand: "Puma",
        sizes: [40],
        price: 10000,
        isNew: true,
      },
    ];
    expect(
      filterProducts(data, {
        q: "  AIR   max ",
        brands: ["Nike", "adidas"],
        size: "40",
        min: "9000",
        max: "11000",
        newOnly: true,
      }).map((p) => p.id),
    ).toEqual(["a"]);
    expect(filterProducts(data, { min: 13000, max: 9000 })).toEqual([]);
  });
  it("сортирует по цене и названию, сохраняя исходный порядок", () => {
    const before = products.map((p) => p.id);
    const asc = filterProducts(products, { sort: "price-asc" });
    const desc = filterProducts(products, { sort: "price-desc" });
    expect(asc[0].price).toBe(Math.min(...products.map((p) => p.price)));
    expect(desc[0].price).toBe(Math.max(...products.map((p) => p.price)));
    expect(
      filterProducts(products, { sort: "name" }).map((p) => p.name),
    ).toEqual(
      products.map((p) => p.name).sort((a, b) => a.localeCompare(b, "ru")),
    );
    expect(products.map((p) => p.id)).toEqual(before);
  });
  it("восстанавливает все фильтры из URL", () => {
    const state = {
      q: "Nike Air",
      brands: ["Nike", "Jordan"],
      size: "40",
      min: "9000",
      max: "20000",
      newOnly: true,
      sort: "price-desc",
    };
    expect(readFilters(filtersToSearch(state))).toEqual(state);
  });
});
describe("Корзина", () => {
  it("объединяет одинаковый размер и не меняет исходные данные", () => {
    const original = [{ productId: "1", size: 40, quantity: 1 }];
    expect(addItem(original, "1", 40)).toEqual([
      { productId: "1", size: 40, quantity: 2 },
    ]);
    expect(original[0].quantity).toBe(1);
  });
  it("разделяет размеры", () => {
    expect(addItem(addItem([], "1", 40), "1", 41)).toHaveLength(2);
  });
  it("меняет количество, удаляет и рассчитывает итог", () => {
    let cart = addItem([], "1", 40);
    cart = changeQuantity(cart, "1", 40, 3);
    expect(cartTotal(cart, products)).toBe(products[0].price * 3);
    expect(changeQuantity(cart, "1", 40, 0)).toEqual(cart);
    expect(changeQuantity(cart, "1", 40, 1.5)).toEqual(cart);
    expect(removeItem(cart, "1", 40)).toEqual([]);
  });
  it("отбрасывает неизвестные товары, размеры и неверные количества", () => {
    const valid = { productId: "1", size: products[0].sizes[0], quantity: 2 };
    expect(
      sanitizeCart(
        [
          valid,
          null,
          { ...valid, productId: "unknown" },
          { ...valid, size: 99 },
          { ...valid, quantity: -1 },
          { ...valid, quantity: 1.5 },
          valid,
        ],
        products,
      ),
    ).toEqual([{ ...valid, quantity: 4 }]);
    expect(sanitizeCart({}, products)).toEqual([]);
  });
});
describe("Хранилище", () => {
  it("восстанавливается после повреждённого JSON", () => {
    let raw = "{broken";
    const adapter = {
      getItem: () => raw,
      setItem: (_, value) => (raw = value),
    };
    const storage = createStorage(() => adapter);
    expect(storage.read("cart", [])).toEqual([]);
    const cart = [{ productId: "1", size: 40, quantity: 1 }];
    storage.write("cart", cart);
    expect(storage.read("cart", [])).toEqual(cart);
  });
  it("продолжает работать без доступа к localStorage", () => {
    const storage = createStorage(() => {
      throw new Error("denied");
    });
    expect(storage.read("cart", [])).toEqual([]);
    storage.write("cart", [1]);
    expect(storage.read("cart", [])).toEqual([1]);
  });
  it("переживает превышение квоты при записи", () => {
    const storage = createStorage(() => ({
      getItem: () => {
        throw Error("denied");
      },
      setItem: () => {
        throw Error("quota");
      },
    }));
    storage.write("favorites", ["1"]);
    expect(storage.read("favorites", [])).toEqual(["1"]);
  });
});
describe("Оформление", () => {
  const valid = {
    name: "Максим",
    phone: "+7 (999) 123-45-67",
    email: "max@example.ru",
    method: "pickup",
  };
  it("не требует адрес при самовывозе", () =>
    expect(validateOrder(valid)).toEqual({}));
  it("требует адрес для доставки", () => {
    expect(validateOrder({ ...valid, method: "delivery" })).toHaveProperty(
      "address",
    );
    expect(
      validateOrder({
        ...valid,
        method: "delivery",
        address: "Москва, улица Мира, 5",
      }),
    ).toEqual({});
  });
  it("возвращает ошибки контактов и способа получения", () =>
    expect(
      Object.keys(
        validateOrder({
          name: " ",
          phone: "abc",
          email: "wrong",
          method: "other",
        }),
      ),
    ).toEqual(["name", "phone", "email", "method"]));
});

describe("Дополнительные случаи хранения", () => {
  it("возвращает последнее состояние сессии, если запись запрещена, а старое значение ещё читается", () => {
    const storage = createStorage(() => ({
      getItem: () => '["old"]',
      setItem: () => {
        throw Error("quota");
      },
    }));
    storage.read("favorites", []);
    storage.write("favorites", ["new"]);
    expect(storage.read("favorites", [])).toEqual(["new"]);
  });
  it("не возвращает старую копию после удаления ключа в другой вкладке", () => {
    let raw = '["1"]';
    const storage = createStorage(() => ({ getItem: () => raw }));
    expect(storage.read("favorites", [])).toEqual(["1"]);
    raw = null;
    expect(storage.read("favorites", [])).toEqual([]);
  });
});
