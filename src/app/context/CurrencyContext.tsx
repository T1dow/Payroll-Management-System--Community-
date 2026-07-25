import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getCurrencyConfig, formatFull, formatCompact, formatCompactP,
  getSymbol, CURRENCY_STORAGE_KEY, CurrencyConfig
} from '../utils/currency';

interface CurrencyContextValue {
  /** Active currency code e.g. 'GHS', 'USD' */
  currencyCode: string;
  /** Change the active currency globally */
  setCurrencyCode: (code: string) => void;
  /** Config object for the current currency */
  config: CurrencyConfig;
  /** Just the symbol string e.g. '₹', '$' */
  sym: string;
  /**
   * Compact smart format.
   * GHS: L / Cr   |   Others: K / M / B
   * e.g. fmt(44890750) → '₹4.49Cr' (GHS)  or  '$44.89M' (USD)
   */
  fmt: (amount: number) => string;
  /**
   * Compact with explicit decimal precision.
   * e.g. fmtP(44890750, 1) → '₹4.5Cr'
   */
  fmtP: (amount: number, precision: number) => string;
  /**
   * Full exact format with locale-aware separators.
   * e.g. fmtFull(1250000) → '₹12,50,000' (GHS)  or  '$1,250,000' (USD)
   */
  fmtFull: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currencyCode: 'GHS',
  setCurrencyCode: () => {},
  config: getCurrencyConfig('GHS'),
  sym: '₹',
  fmt: (n) => formatCompact(n, 'GHS'),
  fmtP: (n, p) => formatCompactP(n, 'GHS', p),
  fmtFull: (n) => formatFull(n, 'GHS'),
});

export function CurrencyProvider({
  children,
  initialCode = 'GHS',
}: {
  children: React.ReactNode;
  initialCode?: string;
}) {
  const [currencyCode, setCurrencyCodeState] = useState<string>(() => {
    try {
      return localStorage.getItem(CURRENCY_STORAGE_KEY) || initialCode;
    } catch {
      return initialCode;
    }
  });

  const setCurrencyCode = useCallback((code: string) => {
    setCurrencyCodeState(code);
    try { localStorage.setItem(CURRENCY_STORAGE_KEY, code); } catch {}
  }, []);

  const config = getCurrencyConfig(currencyCode);
  const sym = getSymbol(currencyCode);
  const fmt = useCallback((n: number) => formatCompact(n, currencyCode), [currencyCode]);
  const fmtP = useCallback((n: number, p: number) => formatCompactP(n, currencyCode, p), [currencyCode]);
  const fmtFull = useCallback((n: number) => formatFull(n, currencyCode), [currencyCode]);

  return (
    <CurrencyContext.Provider value={{ currencyCode, setCurrencyCode, config, sym, fmt, fmtP, fmtFull }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  return useContext(CurrencyContext);
}
