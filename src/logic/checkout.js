export function validateOrder(values) {
  const errors = {};
  if (!values.name || values.name.trim().length < 2)
    errors.name = "Введите имя: не менее двух символов.";
  const phone = values.phone?.replace(/[^0-9]/g, "") || "";
  if (
    !/^[+()0-9\s-]+$/.test(values.phone || "") ||
    phone.length < 10 ||
    phone.length > 15
  )
    errors.phone = "Введите телефон: от 10 до 15 цифр.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || ""))
    errors.email = "Введите email, например name@example.ru.";
  if (!["pickup", "delivery"].includes(values.method))
    errors.method = "Выберите способ получения.";
  if (
    values.method === "delivery" &&
    (!values.address || values.address.trim().length < 8)
  )
    errors.address = "Укажите город, улицу и номер дома.";
  return errors;
}
