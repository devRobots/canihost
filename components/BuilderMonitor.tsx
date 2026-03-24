'use client';

import { useAppStore } from '@/lib/store';
import PieChart from '@/components/PieChart';
import { type ActiveMachine, type Service } from '@/types';
import { getServiceIcon } from '@/lib/icons';

type Props = {
  machine: ActiveMachine;
  setServiceModalData: (s: Service | null) => void;
};

export default function BuilderMonitor({ machine, setServiceModalData }: Props) {
  const { allServices, selectedServiceIds, mode } = useAppStore();
  const isExpert = mode === 'expert';

  const selectedServices = allServices.filter(s => selectedServiceIds.has(s.id));
  const totalCpu = selectedServices.reduce((acc, s) => acc + s.minCPU, 0);
  const totalRam = selectedServices.reduce((acc, s) => acc + s.minRAM, 0);

  const cpuPct = Math.min(Math.round((totalCpu / machine.cpuCores) * 100), 999);
  const ramPct = Math.min(Math.round((totalRam / machine.memoryRamGb) * 100), 999);

  const isCpuOver = totalCpu > machine.cpuCores;
  const isRamOver = totalRam > machine.memoryRamGb;
  const cloudWarnings = selectedServices.filter(s => !s.isCloudRecommended && machine.type === 'VPS');

  let cpuClass: 'accent' | 'warn' | 'danger' = 'accent';
  if (isCpuOver) cpuClass = 'danger';
  else if (cpuPct > 70) cpuClass = 'warn';

  let ramClass: 'accent' | 'warn' | 'danger' = 'accent';
  if (isRamOver) ramClass = 'danger';
  else if (ramPct > 70) ramClass = 'warn';

  return (
    <div className="w-full lg:w-80 flex flex-col gap-6 p-6 sticky bottom-0 lg:top-14 lg:h-[calc(100vh-56px)] overflow-y-auto z-10 bg-card border-t lg:border-t-0 lg:border-l border-default">
      <div className="text-xs font-bold uppercase tracking-widest text-fg-muted">
        <span className="text-accent">{'// '}</span>
        Resource Monitor
      </div>

      {isExpert ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-fg-dim">
              <span>CPU</span>
              <span className={isCpuOver ? 'text-red-500' : 'text-fg'}>
                {totalCpu.toFixed(1)} / {machine.cpuCores.toFixed(1)} ({cpuPct}%)
              </span>
            </div>
            <div className="h-2 rounded overflow-hidden flex bg-input border-line">
              <div className={`bar-fill ${cpuClass === 'accent' ? '' : cpuClass}`} style={{ width: `${Math.min(cpuPct, 100)}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-fg-dim">
              <span>RAM</span>
              <span className={isRamOver ? 'text-red-500' : 'text-fg'}>
                {totalRam.toFixed(1)}GB / {machine.memoryRamGb}GB ({ramPct}%)
              </span>
            </div>
            <div className="h-2 rounded overflow-hidden flex bg-input border-line">
              <div className={`bar-fill ${ramClass === 'accent' ? '' : ramClass}`} style={{ width: `${Math.min(ramPct, 100)}%` }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-4">
          <PieChart
            cpuPct={Math.min(cpuPct, 100)}
            ramPct={Math.min(ramPct, 100)}
            size={180}
            strokeWidth={18}
          />
        </div>
      )}

      {/* Warnings */}
      {cloudWarnings.length > 0 && (
        <div className="text-xs p-3 rounded flex flex-col gap-1.5 border border-yellow-500/50 bg-yellow-500/10 text-yellow-500 shadow-lg glow-text">
          <div className="font-bold flex items-center gap-2">
            <span>⚠</span> Cloud Warning
          </div>
          <p className="opacity-90 leading-relaxed font-sans">
            You selected apps optimized for Local networking. Running them on a Cloud VPS is unsupported.
          </p>
        </div>
      )}

      {(isCpuOver || isRamOver) && (
        <div className="text-xs p-3 rounded flex flex-col gap-1.5 border text-red-500 border-red-500/50 bg-red-500/10 mb-4 shadow-lg glow-text">
          <div className="font-bold flex items-center gap-2">
            <span className="animate-pulse">⚠</span> Overloaded
          </div>
          <p className="opacity-90 leading-relaxed font-sans">
            Your machine cannot handle this stack. Consider removing some apps or returning to Home to upgrade your hardware.
          </p>
        </div>
      )}

      {/* Selected Items */}
      {selectedServices.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <div className="text-[10px] uppercase font-bold tracking-widest text-fg-dim border-b border-default pb-2">
            Selected Stack ({selectedServices.length})
          </div>
          <div className="flex flex-col gap-2">
            {selectedServices.map(s => (
              <button
                key={s.id}
                onClick={() => setServiceModalData(s)}
                className="flex items-center gap-2 text-xs p-2 rounded transition-all hover:brightness-125 cursor-pointer bg-input border-line text-fg"
              >
                <span className="text-lg">{getServiceIcon(s.name)}</span>
                <span className="font-bold truncate" title={s.name}>{s.name}</span>
                  <span className="ml-auto text-xs text-fg-dim font-mono whitespace-nowrap">
                    {isExpert ? (
                      `${s.minCPU}c · ${s.minRAM}G`
                    ) : (
                      `${Math.round((s.minCPU/machine.cpuCores)*100)}%C`
                    )}
                  </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
