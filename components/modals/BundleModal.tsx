'use client';

import { Cpu, Layers, MemoryStick } from 'lucide-react';

import DeployScriptButton from '@/components/core/DeployScriptButton';
import { ResourceUsageBar } from '@/components/core/ResourceUsageBar';
import Modal from '@/components/modals/Modal';
import { useHostStore } from '@/store/host';
import { useModeStore } from '@/store/mode';
import { type AppBundle } from '@/types';

export default function AppBundleModal({
  bundle,
  onClose,
}: {
  bundle: AppBundle | null;
  onClose: () => void;
}) {
  const { mode } = useModeStore();
  const { activeHost } = useHostStore();
  const title = bundle ? bundle.name : 'App Bundle Details';

  const totalCpu = bundle
    ? bundle.apps.reduce((acc, s) => acc + s.minCPU, 0)
    : 0;
  const totalRam = bundle
    ? bundle.apps.reduce((acc, s) => acc + s.minRAM, 0)
    : 0;

  const core = activeHost?.cores || 1;
  const ram = activeHost?.ram || 1;

  return (
    <Modal isOpen={!!bundle} onClose={onClose} title={title}>
      {bundle && (
        <div className="flex flex-col gap-4 pb-4">
          {/* Header & Description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Layers className="text-accent mr-2 h-6 w-6" />
              <div>
                <h3 className="text-fg text-lg font-black tracking-tight">
                  {bundle.name}
                </h3>
                <span className="text-fg-dim text-[10px] font-bold tracking-widest uppercase">
                  {bundle.apps.length} Applications
                </span>
              </div>
            </div>
            <p className="text-fg-muted text-sm">
              {bundle.description ||
                'A curated selection of applications optimized for efficiency and interoperability.'}
            </p>
          </div>

          {/* Resource Usage Bars */}
          {activeHost && mode === 'expert' && (
            <div className="group border-accent/10 bg-accent/3 hover:bg-accent/5 relative overflow-hidden rounded-xl border p-4 transition-all">
              <div className="flex flex-col gap-4">
                <ResourceUsageBar
                  label="CPU"
                  current={totalCpu}
                  total={core}
                  unit="c"
                />
                <ResourceUsageBar
                  label="RAM"
                  current={totalRam}
                  total={ram}
                  unit="GB"
                />
              </div>
            </div>
          )}

          {/* Flashy Totals */}
          {mode === 'expert' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="group border-accent/10 bg-accent/3 hover:bg-accent/5 relative overflow-hidden rounded-xl border p-4 transition-all">
                <div className="absolute -top-4 -right-4 opacity-5 transition-transform group-hover:scale-110">
                  <Cpu size={80} />
                </div>
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="text-accent flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                    <Cpu size={14} /> Total CPU
                  </div>
                  <div className="text-fg text-2xl font-black">
                    {totalCpu.toFixed(1)}
                    <span className="text-fg-dim ml-1 text-xs font-bold uppercase">
                      Cores
                    </span>
                  </div>
                </div>
              </div>

              <div className="group border-accent/10 bg-accent/3 hover:bg-accent/5 relative overflow-hidden rounded-xl border p-4 transition-all">
                <div className="absolute -top-4 -right-4 opacity-5 transition-transform group-hover:scale-110">
                  <MemoryStick size={80} />
                </div>
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="text-accent flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                    <MemoryStick size={14} /> Total RAM
                  </div>
                  <div className="text-fg text-2xl font-black">
                    {totalRam.toFixed(1)}
                    <span className="text-fg-dim ml-1 text-xs font-bold uppercase">
                      GB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* App List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-border/40 h-px flex-1" />
              <div className="text-accent text-[10px] font-black tracking-widest uppercase">
                Bundle Contents
              </div>
              <div className="bg-border/40 h-px flex-1" />
            </div>

            <div className="custom-scrollbar flex max-h-72 flex-col gap-2 overflow-y-auto pr-2">
              {bundle.apps.map((app) => (
                <div
                  key={app.id}
                  className="border-border/40 bg-bg-input/30 hover:bg-bg-input/50 flex items-center justify-between rounded-lg border p-1 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="border-border/60 bg-bg-card flex h-8 w-8 items-center justify-center rounded border p-1 shadow-sm">
                      <img
                        src={app.logoUrl}
                        alt={`${app.name} logo`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="text-fg text-xs font-bold">{app.name}</div>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-[10px]">
                    <div className="bg-border/20 text-fg-muted flex items-center gap-1.5 rounded-full px-2 py-0.5">
                      <Cpu size={14} className="text-accent" />
                      {app.minCPU}c
                    </div>
                    <div className="bg-border/20 text-fg-muted flex items-center gap-1.5 rounded-full px-2 py-0.5">
                      <MemoryStick size={14} className="text-accent" />
                      {app.minRAM}G
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Button */}
          <DeployScriptButton apps={bundle.apps} className="w-full">
            Generate Deployment Script
          </DeployScriptButton>
        </div>
      )}
    </Modal>
  );
}
