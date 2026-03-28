'use client';

import { HostType } from '@prisma/enums';
import { ChevronDown, Cpu } from 'lucide-react';

import { useHostStore } from '@/store/host';

const CPU_OPTIONS = [1, 2, 4, 6, 8, 10, 12, 14, 16, 24, 32, 64];

interface CpuSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function CpuSelector({
  isOpen,
  onToggle,
  onClose,
}: CpuSelectorProps) {
  const { activeHost, setCustomResources } = useHostStore();

  if (!activeHost) return null;

  const isCustom = activeHost.type === HostType.CUSTOM;
  const currentCores = activeHost.cores;
  const currentRam = activeHost.ram;

  return (
    <div className="relative flex-1 md:flex-none">
      <button
        onClick={() => {
          if (isCustom) onToggle();
        }}
        className="group flex w-full items-center justify-between gap-2 py-1 text-left transition-colors sm:justify-start"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center opacity-70 transition-opacity group-hover:opacity-100">
            <Cpu size={20} />
            <span className="text-fg-dim mt-1 text-[8px] font-bold tracking-widest uppercase">
              CPU
            </span>
          </div>
          <span className="text-fg pl-4 text-sm font-bold">
            {currentCores} <span className="text-fg-dim text-xs">Cores</span>
          </span>
        </div>
        {isCustom && (
          <ChevronDown
            size={14}
            className={`text-fg-dim transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {isOpen && isCustom && (
        <div className="bg-card border-default absolute top-full left-0 z-50 mt-3 max-h-60 w-full overflow-y-auto rounded-md border shadow-2xl sm:right-0 sm:left-auto sm:w-32">
          <div className="flex flex-col gap-0.5 p-1 px-1.5">
            {CPU_OPTIONS.map((cpuOpt) => (
              <button
                key={cpuOpt}
                onClick={() => {
                  setCustomResources(cpuOpt, currentRam);
                  onClose();
                }}
                className={`w-full rounded-sm px-3 py-1.5 text-center text-xs transition-all ${
                  currentCores === cpuOpt
                    ? 'bg-accent/10 text-accent font-bold'
                    : 'hover:bg-input text-fg'
                }`}
              >
                {cpuOpt} Core{cpuOpt !== 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
