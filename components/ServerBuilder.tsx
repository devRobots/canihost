'use client';

import { App } from '@prisma/client';
import { HostType } from '@prisma/enums';
import { useState } from 'react';

import BuilderCatalog from '@/components/BuilderCatalog';
import BuilderMonitor from '@/components/BuilderMonitor';
import AppModal from '@/components/modals/AppModal';
import Modal from '@/components/modals/Modal';
import { useDbStore, useHostStore } from '@/lib/store';
import { type ActiveHost, type Host } from '@/types';

export default function ServerBuilder() {
  const { hosts } = useDbStore();
  const { selectedHostId, selectedVariantId, core, ram } = useHostStore();
  const host = hosts.find((h: Host) => h.id === selectedHostId) || hosts[0];

  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [appModalData, setAppModalData] = useState<App | null>(null);

  if (!host) {
    return (
      <div className="bg-page text-fg-dim flex min-h-[calc(100vh-56px)] w-full items-center justify-center font-mono">
        <span className="prompt">Loading...</span>
      </div>
    );
  }

  const selectedVariant =
    host.variants?.find((v) => v.id === selectedVariantId) ||
    host.variants?.[0] ||
    null;
  const isCustom = host.type === HostType.CUSTOM;

  const activeHost: ActiveHost = {
    ...host,
    cpuCores: isCustom ? core : selectedVariant?.cpuCores || 0,
    memoryRamGb: isCustom ? ram : selectedVariant?.memoryRamGb || 0,
  };

  return (
    <div className="bg-page mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-screen-2xl flex-col font-mono lg:flex-row">
      {/* ─── LEFT: Catalog ─── */}
      <BuilderCatalog
        host={activeHost}
        setAppModalData={setAppModalData}
        setHostModalOpen={setHostModalOpen}
      />

      {/* ─── RIGHT: Resource Monitor ─── */}
      <BuilderMonitor host={activeHost} setAppModalData={setAppModalData} />

      {/* ─── MODALS ─── */}
      <AppModal app={appModalData} onClose={() => setAppModalData(null)} />

      <Modal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        title={host.name}
      >
        <div className="text-fg-muted flex flex-col gap-6 p-2 font-sans text-sm">
          <div className="border-default mt-2 grid grid-cols-2 gap-y-2 border-t pt-4 text-xs">
            <div className="text-fg-dim">Architecture:</div>
            <div className="text-fg text-right font-mono">
              {activeHost.type}
            </div>

            <div className="text-fg-dim">CPU Cores:</div>
            <div className="text-fg text-right font-mono">
              {activeHost.cpuCores}
            </div>

            <div className="text-fg-dim">Memory RAM:</div>
            <div className="text-fg text-right font-mono">
              {activeHost.memoryRamGb} GB
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
