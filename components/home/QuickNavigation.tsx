import React from 'react';

interface Props {
  showBarelyUsable: boolean;
  showUnsupported: boolean;
}

export default function RecommendationsSidebar({
  showBarelyUsable,
  showUnsupported,
}: Props) {
  return (
    <aside className="border-border/50 sticky top-24 hidden w-56 shrink-0 flex-col gap-4 border-l pl-6 xl:flex">
      <span className="text-fg-dim text-[10px] font-bold tracking-widest uppercase">
        <span className="text-accent mr-2">{'//'}</span>
        Quick Navigation
      </span>
      <div className="mt-2 flex flex-col gap-3">
        <a
          href="#section-bundles"
          className="text-fg-muted hover:text-accent flex items-center gap-3 text-sm font-bold transition-colors"
        >
          <span className="bg-accent h-1.5 w-1.5 rounded-full opacity-50"></span>{' '}
          App Bundles
        </a>
        <a
          href="#section-recommended"
          className="text-fg-muted hover:text-accent flex items-center gap-3 text-sm font-bold transition-colors"
        >
          <span className="bg-accent h-1.5 w-1.5 rounded-full opacity-50"></span>{' '}
          Recommended
        </a>
        {showBarelyUsable && (
          <a
            href="#section-barely-usable"
            className="text-fg-muted hover:text-accent flex items-center gap-3 text-sm font-bold transition-colors"
          >
            <span className="bg-accent h-1.5 w-1.5 rounded-full opacity-50"></span>{' '}
            Barely Usable
          </a>
        )}
        {showUnsupported && (
          <a
            href="#section-unsupported"
            className="text-fg-muted hover:text-accent flex items-center gap-3 text-sm font-bold transition-colors"
          >
            <span className="bg-accent h-1.5 w-1.5 rounded-full opacity-50"></span>{' '}
            Unsupported
          </a>
        )}
      </div>
    </aside>
  );
}
