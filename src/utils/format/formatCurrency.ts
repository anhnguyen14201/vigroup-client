type CurrencyCode = 'CZK' | 'USD' | 'EUR'
type CurrencyNumeric = 203 | 840 | 978

/**
 * Format số thành chuỗi tiền tệ, nhận cả mã số hoặc mã chữ.
 * - Nếu truyền numeric code không khớp, sẽ fallback về 'USD'
 * - Nếu truyền chuỗi không khớp, cũng sẽ fallback về 'USD'
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode | CurrencyNumeric,
): string {
  // 1) map numeric -> alphabetic
  const codeMap: Record<CurrencyNumeric, CurrencyCode> = {
    203: 'CZK',
    840: 'USD',
    978: 'EUR',
  }
  let alpha: CurrencyCode
  if (typeof currency === 'number') {
    alpha = codeMap[currency] ?? 'USD'
  } else {
    alpha = currency
  }

  // 2) validate alphabetic, fallback nếu cần
  const validCodes: CurrencyCode[] = ['CZK', 'USD', 'EUR']
  if (!validCodes.includes(alpha)) {
    alpha = 'USD'
  }

  // 3) map -> locale
  const localeMap: Record<CurrencyCode, string> = {
    CZK: 'cs-CZ',
    USD: 'en-US',
    EUR: 'de-DE',
  }
  const locale = localeMap[alpha] || 'en-US'

  // 4) format
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: alpha,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
