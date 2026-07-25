export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  name: string;
  flag: string;
  /** Use Indian scale (lakh / crore) instead of K / M / B */
  ghanaScale: boolean;
}

export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  GHS: { code: 'GHS', symbol: '₵',    locale: 'en-GH', name: 'Ghana Cedis',      flag: 'Gh', ghanaScale: true  },
  USD: { code: 'USD', symbol: '$',    locale: 'en-US', name: 'US Dollar',         flag: '🇺🇸', ghanaScale: false },
  EUR: { code: 'EUR', symbol: '€',    locale: 'de-DE', name: 'Euro',              flag: '🇪🇺', ghanaScale: false },
  GBP: { code: 'GBP', symbol: '£',    locale: 'en-GB', name: 'British Pound',     flag: '🇬🇧', ghanaScale: false },
  AED: { code: 'AED', symbol: 'AED ', locale: 'ar-AE', name: 'UAE Dirham',        flag: '🇦🇪', ghanaScale: false },
  SGD: { code: 'SGD', symbol: 'S$',   locale: 'en-SG', name: 'Singapore Dollar',  flag: '🇸🇬', ghanaScale: false },
  JPY: { code: 'JPY', symbol: '¥',    locale: 'ja-JP', name: 'Japanese Yen',      flag: '🇯🇵', ghanaScale: false },
  AUD: { code: 'AUD', symbol: 'A$',   locale: 'en-AU', name: 'Australian Dollar', flag: '🇦🇺', ghanaScale: false },
  CAD: { code: 'CAD', symbol: 'C$',   locale: 'en-CA', name: 'Canadian Dollar',   flag: '🇨🇦', ghanaScale: false },
  CHF: { code: 'CHF', symbol: 'CHF ', locale: 'de-CH', name: 'Swiss Franc',       flag: '🇨🇭', ghanaScale: false },
};

export function getCurrencyConfig(code: string): CurrencyConfig {
  return CURRENCY_CONFIGS[code] ?? CURRENCY_CONFIGS.INR;
}

/**
 * Returns just the currency symbol string.
 */
export function getSymbol(code: string): string {
  return getCurrencyConfig(code).symbol;
}

/**
 * Full exact format with locale-aware thousands separator.
 * e.g.  formatFull(1250000, 'INR') → '₹12,50,000'
 *       formatFull(1250000, 'USD') → '$1,250,000'
 */
export function formatFull(amount: number, code: string): string {
  const { symbol, locale } = getCurrencyConfig(code);
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  // JPY has no decimals natively
  const decimals = code === 'JPY' ? 0 : 0;
  return `${sign}${symbol}${abs.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

/**
 * Compact abbreviation format.
 * INR scale → L (lakh = 1e5), Cr (crore = 1e7)
 * Others   → K (1e3), M (1e6), B (1e9)
 *
 * e.g.  formatCompact(44890750, 'INR') → '₹4.49Cr'
 *       formatCompact(44890750, 'USD') → '$44.89M'
 *       formatCompact(125000,   'INR') → '₹1.25L'
 *       formatCompact(125000,   'USD') → '$125K'
 */
export function formatCompact(amount: number, code: string): string {
  const { symbol, ghanaScale } = getCurrencyConfig(code);
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  const p = (n: number, d: number) => n.toFixed(d).replace(/\.0+$/, '');

  if (ghanaScale) {
    if (abs >= 1e7) return `${sign}${symbol}${p(abs / 1e7, 2)}Cr`;
    if (abs >= 1e5) return `${sign}${symbol}${p(abs / 1e5, 1)}L`;
    if (abs >= 1e3) return `${sign}${symbol}${p(abs / 1e3, 1)}K`;
  } else {
    if (abs >= 1e9) return `${sign}${symbol}${p(abs / 1e9, 2)}B`;
    if (abs >= 1e6) return `${sign}${symbol}${p(abs / 1e6, 2)}M`;
    if (abs >= 1e3) return `${sign}${symbol}${p(abs / 1e3, 1)}K`;
  }
  return formatFull(amount, code);
}

/**
 * Compact with forced precision — useful for chart tick labels.
 * e.g. formatCompact(44890750, 'INR', 1) → '₹4.5Cr'
 */
export function formatCompactP(amount: number, code: string, precision: number): string {
  const { symbol, ghanaScale } = getCurrencyConfig(code);
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (ghanaScale) {
    if (abs >= 1e7) return `${sign}${symbol}${(abs / 1e7).toFixed(precision)}Cr`;
    if (abs >= 1e5) return `${sign}${symbol}${(abs / 1e5).toFixed(precision)}L`;
    if (abs >= 1e3) return `${sign}${symbol}${(abs / 1e3).toFixed(precision)}K`;
  } else {
    if (abs >= 1e9) return `${sign}${symbol}${(abs / 1e9).toFixed(precision)}B`;
    if (abs >= 1e6) return `${sign}${symbol}${(abs / 1e6).toFixed(precision)}M`;
    if (abs >= 1e3) return `${sign}${symbol}${(abs / 1e3).toFixed(precision)}K`;
  }
  return formatFull(amount, code);
}

/** Storage key for persisted currency preference */
export const CURRENCY_STORAGE_KEY = 'payrollpro_currency';
