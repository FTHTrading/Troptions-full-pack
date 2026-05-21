// Supported languages for TROPTIONS / UNYKORN ecosystem
// Non-English content requires human review before publishing

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  status: 'live' | 'draft' | 'human_review_required' | 'coming_soon';
  disclaimer: string;
  regions: string[];
}

const TRANSLATION_DISCLAIMER =
  'Non-English content is provided for informational purposes only and requires human review before use in institutional or legal contexts. Machine translation may not accurately represent technical or compliance terminology.';

export const LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    status: 'live',
    disclaimer: 'Primary language. All content is authored in English.',
    regions: ['US', 'UK', 'CA', 'AU', 'Global'],
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    status: 'human_review_required',
    disclaimer: TRANSLATION_DISCLAIMER,
    regions: ['MX', 'ES', 'CO', 'AR', 'Latin America'],
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    status: 'human_review_required',
    disclaimer: TRANSLATION_DISCLAIMER,
    regions: ['BR', 'PT', 'AO', 'MZ'],
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    status: 'human_review_required',
    disclaimer: TRANSLATION_DISCLAIMER,
    regions: ['FR', 'SN', 'CI', 'CM', 'Francophone Africa'],
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    direction: 'ltr',
    status: 'coming_soon',
    disclaimer: TRANSLATION_DISCLAIMER,
    regions: ['KE', 'TZ', 'UG', 'East Africa'],
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    direction: 'ltr',
    status: 'coming_soon',
    disclaimer: TRANSLATION_DISCLAIMER,
    regions: ['NG', 'BJ', 'West Africa'],
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '中文（简体）',
    direction: 'ltr',
    status: 'human_review_required',
    disclaimer: TRANSLATION_DISCLAIMER,
    regions: ['CN', 'SG', 'TW', 'Global Chinese'],
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    status: 'coming_soon',
    disclaimer: TRANSLATION_DISCLAIMER,
    regions: ['JP'],
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    status: 'coming_soon',
    disclaimer: TRANSLATION_DISCLAIMER,
    regions: ['SA', 'AE', 'EG', 'Middle East', 'North Africa'],
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    status: 'coming_soon',
    disclaimer: TRANSLATION_DISCLAIMER,
    regions: ['IN'],
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    status: 'coming_soon',
    disclaimer: TRANSLATION_DISCLAIMER,
    regions: ['DE', 'AT', 'CH'],
  },
];

export function getLanguage(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

export const LIVE_LANGUAGES = LANGUAGES.filter((l) => l.status === 'live');
export const DRAFT_LANGUAGES = LANGUAGES.filter((l) => l.status !== 'live' && l.status !== 'coming_soon');
