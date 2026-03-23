'use client';

import { getMachineIcon } from '@/lib/icons';
import { useAppStore } from '@/lib/store';
import { type Machine } from '@/types';

type Props = {
  onSelect?: (id: string) => void;
};

export default function MachinePicker({ onSelect }: Props) {
  const { selectedMachineId, setSelectedMachineId, machines } = useAppStore();

  const handleSelect = (id: string) => {
    setSelectedMachineId(id);
    if (onSelect) onSelect(id);
  };

  const excluded = [
    'Beelink SER5',
    'Intel NUC 12',
    'Dell',
    'Venus',
    'Raspberry Pi 4',
    '432',
  ];

  const activeMachines = machines.filter(
    (m) => !excluded.some((ex) => m.name.toLowerCase().includes(ex.toLowerCase()))
  );

  const miniPcs = activeMachines.filter(m => m.type !== 'VPS').sort((a, b) => a.name.localeCompare(b.name));
  const vpss    = activeMachines.filter(m => m.type === 'VPS').sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8" style={{ fontFamily: 'var(--font-mono)' }}>

      {/* ─── GROUP: VPS (LEFT) ─── */}
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest mb-2 mt-2"
          style={{ color: 'var(--fg-dim)' }}
        >
          <div className="flex-1" style={{ height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--accent)' }}>☁</span>
          Cloud VPS
          <div className="flex-1" style={{ height: 1, background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {vpss.map(m => (
            <MachineCard
              key={m.id}
              machine={m}
              isSelected={selectedMachineId === m.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* ─── GROUP: Mini PCs (RIGHT) ─── */}
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest mb-2 mt-2"
          style={{ color: 'var(--fg-dim)' }}
        >
          <div className="flex-1" style={{ height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--accent)' }}>💻</span>
          Mini PCs
          <div className="flex-1" style={{ height: 1, background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {miniPcs.map(m => (
            <MachineCard
              key={m.id}
              machine={m}
              isSelected={selectedMachineId === m.id}
              onSelect={setSelectedMachineId}
            />
          ))}
        </div>
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
  const { mode } = useAppStore();
  const isExpert = mode === 'expert';

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
      className="flex items-center gap-3 p-3 w-full cursor-pointer hover:brightness-110 active:scale-[0.98]"
    >
      <span className="text-2xl leading-none shrink-0">{icon}</span>

      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="font-bold text-xs leading-tight truncate"
          style={{ color: isSelected ? 'var(--accent)' : 'var(--fg)' }}
        >
          {isSelected && <span style={{ color: 'var(--accent)' }}>▶ </span>}
          {machine.name}
        </span>
        {isExpert && (
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
            {machine.cpuCores}c / {machine.memoryRamGb}GB{isVps ? ' · CubePath' : ''}
          </span>
        )}
      </div>
    </button>
  );
}
