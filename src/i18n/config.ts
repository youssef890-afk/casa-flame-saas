export type Locale = 'en' | 'fr' | 'ar';

export interface LanguageMeta {
  code: Locale;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'fr', label: 'French', nativeLabel: 'Francais', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' },
];
