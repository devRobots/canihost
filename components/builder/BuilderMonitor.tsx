'use client';

import { App } from '@prisma/client';
import { HostType } from '@prisma/enums';
import { Cpu, Info, MemoryStick, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

import DeployScriptButton from '@/components/core/DeployScriptButton';
import { ResourceUsageBar } from '@/components/core/ResourceUsageBar';
import { useBuilderStore } from '@/store/builder';
import { useDbStore } from '@/store/db';
import { type ActiveHost } from '@/types';

type Props = {
  host: ActiveHost;
  setAppModalData: (s: App | null) => void;
};

export default function BuilderMonitor({ host, setAppModalData }: Props) {
  const { apps: apps } = useDbStore();
  const { selectedAppIds, toggleAppId } = useBuilderStore();

  const selectedApps = apps.filter((s) => selectedAppIds.has(s.id));
  const totalCpu = selectedApps.reduce((acc, s) => acc + s.minCPU, 0);
  const totalRam = selectedApps.reduce((acc, s) => acc + s.minRAM, 0);



  const isCpuOver = totalCpu > host.cores;
  const isRamOver = totalRam > host.ram;
  const cloudWarnings = selectedApps.filter(
    (s) => !s.isCloudRecommended && host.type === HostType.VPS,
  );

  const invalidAppIdsStr = cloudWarnings.map(a => a.id).join(',');

  useEffect(() => {
    if (invalidAppIdsStr) {
      invalidAppIdsStr.split(',').forEach((id) => toggleAppId(id));
    }
  }, [invalidAppIdsStr, toggleAppId]);



  return (
    <div className="bg-card border-default sticky bottom-0 z-10 flex w-full flex-col gap-6 overflow-y-auto border-t p-6 lg:top-[calc(56px+1.5rem)] lg:my-6 lg:mr-6 lg:h-[calc(100vh-56px-3rem)] lg:w-80 lg:rounded-2xl lg:border lg:shadow-2xl">
      <div className="text-fg-muted text-xs font-bold tracking-widest uppercase">
        <span className="text-accent">{'// '}</span>
        Resource Monitor
      </div>

      <div className="flex flex-col gap-4">
        <div className="group border-accent/10 bg-accent/3 hover:bg-accent/5 relative overflow-hidden rounded-xl border p-4 transition-all">
          <div className="flex flex-col gap-4">
            <ResourceUsageBar
              label="CPU"
              current={totalCpu}
              total={host.cores}
              unit="c"
            />
            <ResourceUsageBar
              label="RAM"
              current={totalRam}
              total={host.ram}
              unit="GB"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="group border-accent/10 bg-accent/3 hover:bg-accent/5 relative overflow-hidden rounded-xl border p-4 transition-all">
            <div className={`absolute -top-4 -right-4 transition-transform group-hover:scale-110 opacity-5`}>
              <Cpu size={80} />
            </div>
            <div className="relative z-10 flex flex-col gap-1">
              <div className="text-accent flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <Cpu size={14} /> Total CPU
              </div>
              <div className={`text-2xl font-black ${isCpuOver ? 'text-red-500' : 'text-fg'}`}>
                {Math.round(totalCpu)}
                <span className="text-fg-dim ml-1 text-xs font-bold uppercase">
                  Cores
                </span>
              </div>
            </div>
          </div>

          <div className="group border-accent/10 bg-accent/3 hover:bg-accent/5 relative overflow-hidden rounded-xl border p-4 transition-all">
            <div className="absolute -top-4 -right-4 transition-transform group-hover:scale-110 opacity-5">
              <MemoryStick size={80} />
            </div>
            <div className="relative z-10 flex flex-col gap-1">
              <div className="text-accent flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                <MemoryStick size={14}/> Total RAM
              </div>
              <div className={`text-2xl font-black ${isRamOver ? 'text-red-500' : ''}`}>
                {totalRam.toFixed(1)}
                <span className="text-fg-dim ml-1 text-xs font-bold uppercase">
                  GB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {(isCpuOver || isRamOver) && (
        <div className="glow-text mb-4 flex flex-col gap-1.5 rounded border border-red-500/50 bg-red-500/10 p-3 text-xs text-red-500 shadow-lg">
          <div className="flex items-center gap-2 font-bold">
            <span className="animate-pulse">⚠️</span> Overloaded
          </div>
          <p className="font-sans leading-relaxed opacity-90">
            Your host cannot handle this stack. Consider removing some apps or
            upgrade your hardware.
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
              <div
                key={s.id}
                className="bg-input border-line text-fg flex items-center justify-between rounded p-2 text-xs transition-all hover:brightness-125"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-lg shrink-0">
                    <img
                      src={s.logoUrl}
                      alt={`${s.name} logo`}
                      className="h-5 w-5 object-contain"
                    />
                  </span>
                  <span className="truncate font-bold" title={s.name}>
                    {s.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-fg-dim font-mono text-xs whitespace-nowrap">
                    {s.minCPU}c · {s.minRAM}G
                  </span>
                  <button
                    onClick={() => setAppModalData(s)}
                    className="text-fg-muted hover:text-accent transition-colors"
                  >
                    <Info size={14} />
                  </button>
                  <button
                    onClick={() => toggleAppId(s.id)}
                    className="text-fg-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedApps.length > 0 && (
        <DeployScriptButton apps={selectedApps} className="w-full mt-auto py-3 text-xs font-bold" />
      )}
    </div>
  );
}
