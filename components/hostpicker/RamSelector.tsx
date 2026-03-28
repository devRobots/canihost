'use client';

import { HostType } from '@prisma/enums';
import { ChevronDown, MemoryStick } from 'lucide-react';

import { useDbStore } from '@/lib/store/db';
import { useHostStore } from '@/lib/store/host';

const RAM_OPTIONS = [1, 2, 4, 6, 8, 12, 16, 24, 32, 64, 128];

interface RamSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function RamSelector({
  isOpen,
  onToggle,
  onClose,
}: RamSelectorProps) {
  const { hosts } = useDbStore();
  const { selectedHostId, selectedVariantId, core, ram, setCustomResources } =
    useHostStore();

  const selectedHost = hosts.find((m) => m.id === selectedHostId);
  const selectedVariant =
    selectedHost?.variants.find((v) => v.id === selectedVariantId) ||
    selectedHost?.variants[0];

  if (!selectedHost) return null;

  const isCustom = selectedHost.type === HostType.CUSTOM;
  const currentCores = isCustom ? core : selectedVariant?.cpuCores || 0;
  const currentRam = isCustom ? ram : selectedVariant?.memoryRamGb || 0;

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
            <MemoryStick size={20} />
            <span className="text-fg-dim mt-1 text-[8px] font-bold tracking-widest uppercase">
              RAM
            </span>
          </div>
          <span className="text-fg pl-4 text-sm font-bold">
            {currentRam} <span className="text-fg-dim text-xs">GB</span>
          </span>
        </div>
        {isCustom && (
          <ChevronDown
            size={14}
            className={`text-fg-dim transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {isOpen && isCustom && (
        <div className="bg-card border-default absolute top-full left-0 z-50 mt-3 max-h-60 w-full overflow-y-auto rounded-md border shadow-2xl sm:right-0 sm:left-auto sm:w-32">
          <div className="flex flex-col gap-0.5 p-1 px-1.5">
            {RAM_OPTIONS.map((ramOpt) => (
              <button
                key={ramOpt}
                onClick={() => {
                  setCustomResources(currentCores, ramOpt);
                  onClose();
                }}
                className={`w-full rounded-sm px-3 py-1.5 text-center text-xs transition-all ${currentRam === ramOpt ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
              >
                {ramOpt} GB
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
