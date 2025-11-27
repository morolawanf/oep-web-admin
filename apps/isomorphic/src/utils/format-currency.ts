/**
 * Format number as Nigerian Naira currency
 * @param amount - Number to format
 * @returns Formatted currency string (e.g., "₦1,234.56")
 */
export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format number as currency without decimals
 * @param amount - Number to format
 * @returns Formatted currency string (e.g., "₦1,234")
 */
export function formatCurrencyCompact(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format number as compact Nigerian Naira (e.g., ₦105.2m, ₦400k, ₦1k, ₦999)
 * @param amount - Number to format
 * @returns Formatted string
 */
export function formatCurrencyShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}m`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1)}k`;
  }
  return `₦${amount}`;
}
