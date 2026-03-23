'use client';

import { useMode } from './ModeContext';

export default function ModeToggle() {
  const { mode, setMode } = useMode();
  const isExpert = mode === 'expert';

  return (
    <div className="flex items-center gap-2">
      {/* Label */}
      <span
        className="text-xs font-bold hidden sm:block"
        style={{
          color: isExpert ? 'var(--accent)' : 'var(--fg-muted)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
          transition: 'color 0.2s',
        }}
      >
        {isExpert ? 'Expert' : 'Simple'}
      </span>

      {/* Android-style toggle */}
      <button
        role="switch"
        aria-checked={isExpert}
        onClick={() => setMode(isExpert ? 'normal' : 'expert')}
        title={isExpert ? 'Switch to Simple mode' : 'Switch to Expert mode'}
        style={{
          position: 'relative',
          width: 52,
          height: 28,
          borderRadius: 4,
          border: `1px solid ${isExpert ? 'var(--accent)' : 'var(--border)'}`,
          background: isExpert
            ? 'var(--accent-glow)'
            : 'var(--bg-input)',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
          boxShadow: isExpert ? '0 0 10px var(--accent-glow)' : 'none',
        }}
      >
        {/* Track fill */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 4,
            background: isExpert ? 'var(--accent)' : 'transparent',
            opacity: 0.15,
            transition: 'opacity 0.25s',
          }}
        />

        {/* Thumb */}
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: isExpert ? 24 : 3,
            width: 20,
            height: 20,
            borderRadius: 3,
            background: isExpert ? 'var(--accent)' : 'var(--fg-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'left 0.22s cubic-bezier(0.4,0,0.2,1), background 0.25s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          {isExpert ? (
            /* Terminal > _ icon */
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          ) : (
            /* Person icon */
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
