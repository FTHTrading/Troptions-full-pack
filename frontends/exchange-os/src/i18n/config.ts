import { en } from './locales/en';
import { es } from './locales/es';
import { pt } from './locales/pt';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { ar } from './locales/ar';
import { zh } from './locales/zh';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { it } from './locales/it';

export const SUPPORTED_LOCALES = ['en','es','pt','fr','de','ar','zh','ja','ko','it'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export const DEFAULT_LOCALE: SupportedLocale = 'en';
export const RTL_LOCALES: SupportedLocale[] = ['ar'];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English', es: 'Español', pt: 'Português', fr: 'Français', de: 'Deutsch',
  ar: 'العربية', zh: '中文', ja: '日本語', ko: '한국어', it: 'Italiano',
};

// Use a generic deep-string type so non-English locales (plain string, not literal) are compatible
type DeepString<T> = { [K in keyof T]: T[K] extends object ? DeepString<T[K]> : string };
export type LocaleShape = DeepString<typeof en>;

export const locales: Record<SupportedLocale, LocaleShape> = {
  en: en as unknown as LocaleShape,
  es: es as LocaleShape,
  pt: pt as LocaleShape,
  fr: fr as LocaleShape,
  de: de as LocaleShape,
  ar: ar as unknown as LocaleShape,
  zh: zh as unknown as LocaleShape,
  ja: ja as unknown as LocaleShape,
  ko: ko as unknown as LocaleShape,
  it: it as unknown as LocaleShape,
};

export function isRTL(locale: SupportedLocale): boolean {
  return RTL_LOCALES.includes(locale);
}
