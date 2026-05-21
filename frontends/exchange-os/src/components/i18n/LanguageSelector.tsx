'use client';
import { SUPPORTED_LOCALES, LOCALE_LABELS, type SupportedLocale } from '@/i18n/config';
import { useI18n } from '@/i18n/useI18n';

interface LanguageSelectorProps {
  className?: string;
  compact?: boolean;
}

export default function LanguageSelector({ className = '', compact = false }: LanguageSelectorProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {!compact && (
        <span className="text-xs text-white/30 uppercase tracking-widest">{t.language.select}</span>
      )}
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as SupportedLocale)}
        className="bg-transparent border border-white/15 text-white/60 text-xs rounded px-2 py-1 hover:border-white/30 transition-colors cursor-pointer"
        aria-label="Select language"
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l} value={l} style={{ background: '#020611', color: 'white' }}>
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
