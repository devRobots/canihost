'use client';

import { useState, useTransition } from 'react';
import { getMachineIcon } from '@/lib/icons';

type Machine = {
  id: string;
  name: string;
  type: string;
  brand: string | null;
  cpuCores: number;
  memoryRamGb: number;
};

type Props = {
  machines: Machine[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function MachinePicker({ machines, selectedId, onSelect }: Props) {
  const [showAll, setShowAll] = useState(false);
  const miniPcs = machines.filter(m => m.type !== 'VPS').sort((a,b) => a.name.localeCompare(b.name));
  const vpss    = machines.filter(m => m.type === 'VPS').sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div
      className="w-full flex flex-col gap-6"
      style={{ fontFamily: 'var(--font-mono)' }}
    >

      {/* ─── GROUP: Mini PCs ─── */}
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: 'var(--fg-muted)' }}
        >
          <span style={{ color: 'var(--accent)' }}>▸</span>
          Mini PCs &amp; SBCs
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {miniPcs.map(m => (
            <MachineCard
              key={m.id}
              machine={m}
              isSelected={selectedId === m.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      {/* ─── DIVIDER ─── */}
      <div
        className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--fg-dim)' }}
      >
        <div className="flex-1" style={{ height: 1, background: 'var(--border)' }} />
        <span style={{ color: 'var(--accent)' }}>☁</span>
        Cloud VPS
        <div className="flex-1" style={{ height: 1, background: 'var(--border)' }} />
      </div>

      {/* ─── GROUP: VPS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {vpss.map(m => (
          <MachineCard
            key={m.id}
            machine={m}
            isSelected={selectedId === m.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function MachineCard({
  machine,
  isSelected,
  onSelect,
}: {
  machine: Machine;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const icon = getMachineIcon(machine.brand);
  const isVps = machine.type === 'VPS';

  return (
    <button
      onClick={() => onSelect(machine.id)}
      style={{
        background: isSelected ? 'var(--accent-glow)' : 'var(--bg-card)',
        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
        color: 'var(--fg)',
        fontFamily: 'var(--font-mono)',
        textAlign: 'left',
        transition: 'all 0.15s',
        boxShadow: isSelected ? '0 0 14px var(--accent-glow)' : 'none',
        borderRadius: 4,
      }}
      className="flex items-start gap-3 p-3 w-full cursor-pointer hover:brightness-110 active:scale-[0.98]"
    >
      {/* Icon */}
      <span className="text-2xl leading-none mt-0.5 shrink-0">{icon}</span>

      {/* Info */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="font-bold text-xs leading-tight truncate"
          style={{ color: isSelected ? 'var(--accent)' : 'var(--fg)' }}
        >
          {isSelected && <span style={{ color: 'var(--accent)' }}>▶ </span>}
          {machine.name}
        </span>
        <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
          {machine.cpuCores}c / {machine.memoryRamGb}GB{isVps ? ' · CubePath' : ''}
        </span>
      </div>
    </button>
  );
}
