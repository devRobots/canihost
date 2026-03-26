'use client';

import { HostType } from '@prisma/enums';
import { Box, ChevronDown } from 'lucide-react';

import { useDbStore, useHostStore } from '@/lib/store';

const getVariantLabel = (type?: string) => {
  if (type === 'VPS') return 'Tier';
  return 'Model';
};

interface VariantDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function VariantDropdown({
  isOpen,
  onToggle,
  onClose,
}: VariantDropdownProps) {
  const { hosts } = useDbStore();
  const { selectedHostId, selectedVariantId, setSelectedVariantId } =
    useHostStore();

  const selectedHost = hosts.find((m) => m.id === selectedHostId);
  const selectedVariant =
    selectedHost?.variants.find((v) => v.id === selectedVariantId) ||
    selectedHost?.variants[0];

  if (!selectedHost) return null;

  const isCustom = selectedHost.type === HostType.CUSTOM;

  return (
    <div className="relative flex-1 sm:flex-none">
      <button
        onClick={() => {
          if (selectedHost.variants.length > 1 && !isCustom) onToggle();
        }}
        className="group flex w-full items-center justify-between gap-2 py-1 text-left transition-colors sm:justify-start"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center opacity-70 transition-opacity group-hover:opacity-100">
            <Box size={20} />
            <span className="text-fg-dim mt-1 text-[8px] font-bold uppercase">
              {getVariantLabel(selectedHost.type)}
            </span>
          </div>
          <span className="text-fg pl-4 text-sm font-bold">
            {selectedVariant?.name || 'User'}
          </span>
        </div>
        {selectedHost.variants.length > 1 && !isCustom && (
          <ChevronDown
            size={14}
            className={`text-fg-dim transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {isOpen && selectedHost.variants.length > 1 && !isCustom && (
        <div className="bg-card border-default absolute top-full left-0 z-50 mt-3 w-full rounded-md border shadow-2xl sm:min-w-max">
          <div className="flex flex-col gap-0.5 p-1 px-1.5">
            {selectedHost.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVariantId(v.id);
                  onClose();
                }}
                className={`w-full rounded-sm px-3 py-2 text-left text-xs transition-all ${selectedVariantId === v.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
