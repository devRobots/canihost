'use client';

import { LayoutDashboard } from 'lucide-react';

import { useModeStore } from '@/lib/store';

export default function ModeToggle() {
  const { mode, toggleMode } = useModeStore();

  return (
    <div className="border-line-accent bg-card flex md:w-auto min-w-max shrink-0 self- md:items-center justify-center gap-4 rounded-md border px-5 py-2">
      <button
        onClick={toggleMode}
        className="group flex w-full items-center justify-center gap-4 py-1 text-left transition-colors"
        title="Toggle Expert Mode"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center opacity-70 transition-opacity group-hover:opacity-100">
            <LayoutDashboard size={20} />
            <span className="text-fg-dim mt-1 text-[8px] font-bold tracking-widest uppercase">
              Mode
            </span>
          </div>

          {/* Toggle visual */}
          <div className="ml-1 flex flex-col items-center justify-center gap-1.5">
            <div className="bg-input border-default flex h-4 w-8 items-center rounded-full border p-0.5 shadow-inner transition-all">
              <div
                className={`h-2.5 w-2.5 rounded-full shadow-sm transition-transform duration-300 ${
                  mode === 'expert'
                    ? 'bg-accent translate-x-4 transform'
                    : 'bg-fg-dim'
                }`}
              />
            </div>
            <span
              className={`text-[9px] font-bold tracking-widest uppercase ${mode === 'expert' ? 'text-accent' : 'text-fg'}`}
            >
              {mode === 'expert' ? 'Expert' : 'Basic'}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
