'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        fontFamily: 'var(--font-mono)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--accent)',
          boxShadow: '0 0 30px var(--accent-glow)',
          borderRadius: 4,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-input)' }}
        >
          <div className="flex items-center gap-2 font-bold tracking-widest text-xs uppercase" style={{ color: 'var(--fg)' }}>
            <span style={{ color: 'var(--accent)' }}>▶</span> {title}
          </div>
          <button
            onClick={onClose}
            className="text-xs transition-colors hover:scale-110 active:scale-95"
            style={{ color: 'var(--fg-muted)' }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
