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
      className="h-9 px-3 flex items-center gap-1.5 rounded border text-xs font-bold transition-all duration-200"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-input)',
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {locale === 'en' ? '🇪🇸 ES' : '🇬🇧 EN'}
    </button>
  );
}
