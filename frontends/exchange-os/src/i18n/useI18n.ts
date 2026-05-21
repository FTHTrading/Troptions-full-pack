'use client';
import { useState, useLayoutEffect, useCallback } from 'react';
import { locales, DEFAULT_LOCALE, SUPPORTED_LOCALES, isRTL, type SupportedLocale, type LocaleShape } from './config';

const STORAGE_KEY = 'troptions-locale';

function detect(): SupportedLocale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
    if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;
    const browser = navigator.language.split('-')[0] as SupportedLocale;
    if (SUPPORTED_LOCALES.includes(browser)) return browser;
  } catch {}
  return DEFAULT_LOCALE;
}

export function useI18n() {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: sync locale from localStorage before first paint
    setLocaleState(detect());
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: SupportedLocale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    // Apply RTL to document
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL(l) ? 'rtl' : 'ltr';
      document.documentElement.lang = l;
    }
  }, []);

  const t: LocaleShape = locales[locale];
  const dir = isRTL(locale) ? ('rtl' as const) : ('ltr' as const);

  return { locale, setLocale, t, dir, mounted };
}

// Standalone getter for SSR-safe use
export function getLocaleDir(locale: SupportedLocale) {
  return isRTL(locale) ? 'rtl' : 'ltr';
}
