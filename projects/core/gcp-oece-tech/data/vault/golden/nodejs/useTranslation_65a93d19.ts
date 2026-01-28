import { useLanguageStore } from '@/lib/store/language-store';
import { translations } from '@/lib/i18n/translations';

export function useTranslation() {
  const language = useLanguageStore((state) => state.language);

  return translations[language];
}
