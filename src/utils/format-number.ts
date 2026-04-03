export function formatPrice(price: number | null, currency = "USD"): string {
  if (price === null || price === 0) return "Free"
  return `${currency} ${price.toLocaleString()}`
}
