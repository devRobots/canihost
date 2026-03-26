'use client';

import { HostType } from '@prisma/enums';
import { ChevronDown, Cloud, Server, Settings } from 'lucide-react';

import { useDbStore, useHostStore } from '@/lib/store';

const getHostTypeIcon = (type?: string) => {
  if (type === 'VPS') return <Cloud size={20} />;
  if (type === 'CUSTOM') return <Settings size={20} />;
  return <Server size={20} />;
};

const getHostTypeLabel = (type?: string) => {
  if (type === 'VPS') return 'Cloud';
  if (type === 'CUSTOM') return 'Custom';
  return 'Device';
};

interface HostDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function HostDropdown({
  isOpen,
  onToggle,
  onClose,
}: HostDropdownProps) {
  const { hosts } = useDbStore();
  const { selectedHostId, setSelectedHostId } = useHostStore();

  const handleSelectHost = (id: string) => {
    setSelectedHostId(id, hosts);
    onClose();
  };

  const miniPcs = hosts
    .filter((m) => m.type === HostType.MINI_PC)
    .sort((a, b) => a.name.localeCompare(b.name));
  const vpss = hosts
    .filter((m) => m.type === HostType.VPS)
    .sort((a, b) => a.name.localeCompare(b.name));
  const customs = hosts.filter((m) => m.type === HostType.CUSTOM);

  const selectedHost = hosts.find((m) => m.id === selectedHostId);

  return (
    <div className="relative flex-1 sm:flex-none">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-2 py-1 text-left transition-colors sm:justify-start"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center opacity-70 transition-opacity group-hover:opacity-100">
            {getHostTypeIcon(selectedHost?.type)}
            <span className="text-fg-dim mt-1 text-[8px] font-bold uppercase">
              {getHostTypeLabel(selectedHost?.type)}
            </span>
          </div>

          <span className="text-fg max-w-[200px] truncate pl-4 text-sm font-bold">
            {selectedHost ? selectedHost.name : 'Choose...'}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-fg-dim transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="bg-card border-default absolute top-full left-0 z-50 mt-3 max-h-80 w-full overflow-y-auto rounded-md border shadow-2xl ring-1 ring-black/5 sm:w-72">
          <div className="p-1.5">
            <div className="text-fg-dim flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase">
              <Cloud size={10} /> Cloud VPS
            </div>
            {vpss.map((h) => (
              <button
                key={h.id}
                onClick={() => handleSelectHost(h.id)}
                className={`w-full rounded-sm px-3 py-2 text-left text-xs transition-all ${selectedHostId === h.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
              >
                {h.name}
              </button>
            ))}

            <div className="text-fg-dim border-default mt-2 flex items-center gap-2 border-t px-3 py-1.5 pt-3 text-[10px] font-bold tracking-widest uppercase">
              <Server size={10} /> Mini PCs & Servers
            </div>
            {miniPcs.map((h) => (
              <button
                key={h.id}
                onClick={() => handleSelectHost(h.id)}
                className={`w-full rounded-sm px-3 py-2 text-left text-xs transition-all ${selectedHostId === h.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
              >
                {h.name}
              </button>
            ))}

            <div className="text-fg-dim border-default mt-2 flex items-center gap-2 border-t px-3 py-1.5 pt-3 text-[10px] font-bold tracking-widest uppercase">
              <Settings size={10} /> Custom Spec
            </div>
            {customs.map((h) => (
              <button
                key={h.id}
                onClick={() => handleSelectHost(h.id)}
                className={`w-full rounded-sm px-3 py-2 text-left text-xs transition-all ${selectedHostId === h.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
              >
                {h.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
