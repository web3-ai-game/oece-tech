import { useTranslations } from 'next-intl';
import Cookies from 'js-cookie';

export function useTranslation() {
  const t = useTranslations();
  const locale = Cookies.get('NEXT_LOCALE') || 'en';
  
  return { t, locale };
}
