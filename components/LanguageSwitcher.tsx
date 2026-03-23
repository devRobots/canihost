'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function toggleLocale() {
    const nextLocale = locale === 'en' ? 'es' : 'en';
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-zinc-800/80 backdrop-blur-md text-zinc-100 hover:bg-zinc-700/80 transition shadow hover:shadow-lg hover:scale-105 active:scale-95"
    >
      {locale === 'en' ? '🇪🇸 ESP' : '🇬🇧 ENG'}
    </button>
  );
}
