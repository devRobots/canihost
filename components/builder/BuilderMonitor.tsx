'use client';

import { App } from '@prisma/client';
import { HostType } from '@prisma/enums';

import PieChart from '@/components/builder/PieChart';
import { useBuilderStore, useDbStore, useModeStore } from '@/lib/store';
import { type ActiveHost } from '@/types';

type Props = {
  host: ActiveHost;
  setAppModalData: (s: App | null) => void;
};

export default function BuilderMonitor({ host, setAppModalData }: Props) {
  const { apps: apps } = useDbStore();
  const { selectedAppIds } = useBuilderStore();
  const { mode } = useModeStore();
  const isExpert = mode === 'expert';

  const selectedApps = apps.filter((s) => selectedAppIds.has(s.id));
  const totalCpu = selectedApps.reduce((acc, s) => acc + s.minCPU, 0);
  const totalRam = selectedApps.reduce((acc, s) => acc + s.minRAM, 0);

  const cpuPct = Math.min(Math.round((totalCpu / host.cpuCores) * 100), 999);
  const ramPct = Math.min(Math.round((totalRam / host.memoryRamGb) * 100), 999);

  const isCpuOver = totalCpu > host.cpuCores;
  const isRamOver = totalRam > host.memoryRamGb;
  const cloudWarnings = selectedApps.filter(
    (s) => !s.isCloudRecommended && host.type === HostType.VPS,
  );

  let cpuClass: 'accent' | 'warn' | 'danger' = 'accent';
  if (isCpuOver) cpuClass = 'danger';
  else if (cpuPct > 70) cpuClass = 'warn';

  let ramClass: 'accent' | 'warn' | 'danger' = 'accent';
  if (isRamOver) ramClass = 'danger';
  else if (ramPct > 70) ramClass = 'warn';

  return (
    <div className="bg-card border-default sticky bottom-0 z-10 flex w-full flex-col gap-6 overflow-y-auto border-t p-6 lg:top-14 lg:h-[calc(100vh-56px)] lg:w-80 lg:border-t-0 lg:border-l">
      <div className="text-fg-muted text-xs font-bold tracking-widest uppercase">
        <span className="text-accent">{'// '}</span>
        Resource Monitor
      </div>

      {isExpert ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="text-fg-dim flex justify-between text-xs">
              <span>CPU</span>
              <span className={isCpuOver ? 'text-red-500' : 'text-fg'}>
                {totalCpu.toFixed(1)} / {host.cpuCores.toFixed(1)} ({cpuPct}
                %)
              </span>
            </div>
            <div className="bg-input border-line flex h-2 overflow-hidden rounded">
              <div
                className={`bar-fill ${cpuClass === 'accent' ? '' : cpuClass}`}
                style={{ width: `${Math.min(cpuPct, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-fg-dim flex justify-between text-xs">
              <span>RAM</span>
              <span className={isRamOver ? 'text-red-500' : 'text-fg'}>
                {totalRam.toFixed(1)}GB / {host.memoryRamGb}GB ({ramPct}%)
              </span>
            </div>
            <div className="bg-input border-line flex h-2 overflow-hidden rounded">
              <div
                className={`bar-fill ${ramClass === 'accent' ? '' : ramClass}`}
                style={{ width: `${Math.min(ramPct, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4">
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
        <div className="glow-text flex flex-col gap-1.5 rounded border border-yellow-500/50 bg-yellow-500/10 p-3 text-xs text-yellow-500 shadow-lg">
          <div className="flex items-center gap-2 font-bold">
            <span>⚠</span> Cloud Warning
          </div>
          <p className="font-sans leading-relaxed opacity-90">
            You selected apps optimized for Local networking. Running them on a
            Cloud VPS is unsupported.
          </p>
        </div>
      )}

      {(isCpuOver || isRamOver) && (
        <div className="glow-text mb-4 flex flex-col gap-1.5 rounded border border-red-500/50 bg-red-500/10 p-3 text-xs text-red-500 shadow-lg">
          <div className="flex items-center gap-2 font-bold">
            <span className="animate-pulse">⚠</span> Overloaded
          </div>
          <p className="font-sans leading-relaxed opacity-90">
            Your host cannot handle this stack. Consider removing some apps or
            returning to Home to upgrade your hardware.
          </p>
        </div>
      )}

      {/* Selected Items */}
      {selectedApps.length > 0 && (
        <div className="mt-2 flex flex-col gap-3">
          <div className="text-fg-dim border-default border-b pb-2 text-[10px] font-bold tracking-widest uppercase">
            Selected Stack ({selectedApps.length})
          </div>
          <div className="flex flex-col gap-2">
            {selectedApps.map((s) => (
              <button
                key={s.id}
                onClick={() => setAppModalData(s)}
                className="bg-input border-line text-fg flex cursor-pointer items-center gap-2 rounded p-2 text-xs transition-all hover:brightness-125"
              >
                <span className="text-lg">
                  <img
                    src={s.logoUrl}
                    alt={`${s.name} logo`}
                    className="h-5 w-5 object-contain"
                  />
                </span>
                <span className="truncate font-bold" title={s.name}>
                  {s.name}
                </span>
                <span className="text-fg-dim ml-auto font-mono text-xs whitespace-nowrap">
                  {isExpert
                    ? `${s.minCPU}c · ${s.minRAM}G`
                    : `${Math.round((s.minCPU / host.cpuCores) * 100)}%C`}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
