/**
 * Форматирует числовое значение цены в удобочитаемый формат с разделителями тысяч
 *
 * @param price - Числовое значение цены
 * @param currency - Валюта (по умолчанию: ₸)
 * @returns Отформатированная строка цены
 *
 * Примеры:
 * formatPrice(10000) => "10 000 ₸"
 * formatPrice(1500000) => "1 500 000 ₸"
 * formatPrice(25000, "$") => "25 000 $"
 */
export function formatPrice(price: number, currency: string = "₸"): string {
  if (isNaN(price) || price === null || price === undefined) {
    return "0 " + currency;
  }

  // Форматирование числа с разделителями тысяч
  const formattedNumber = new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(price);

  return `${formattedNumber} ${currency}`;
}

/**
 * Преобразует строку с разделителями цены обратно в число
 *
 * @param formattedPrice - Строка с форматированной ценой
 * @returns Числовое значение
 *
 * Пример:
 * parsePrice("10 000 ₸") => 10000
 */
export function parsePrice(formattedPrice: string): number {
  if (!formattedPrice) return 0;

  // Удаляем все нецифровые символы, кроме точки и запятой
  const numericString = formattedPrice.replace(/[^\d.,]/g, "");

  // Заменяем запятую на точку для корректного парсинга
  const normalized = numericString.replace(",", ".");

  return parseFloat(normalized) || 0;
}

/**
 * Проверяет, является ли значение корректной ценой
 *
 * @param value - Проверяемое значение
 * @returns true, если значение является корректной ценой
 */
export function isValidPrice(value: any): boolean {
  const price = parseFloat(value);
  return !isNaN(price) && price >= 0;
}
