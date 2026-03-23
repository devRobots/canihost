'use client';

import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 flex items-center justify-center rounded border transition-all duration-200"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-input)',
        color: 'var(--accent)',
      }}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}
