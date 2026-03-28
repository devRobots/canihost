'use client';

import { App } from '@prisma/client';
import { HostType } from '@prisma/enums';
import { useState } from 'react';

import BuilderCatalog from '@/components/builder/BuilderCatalog';
import BuilderMonitor from '@/components/builder/BuilderMonitor';
import AppModal from '@/components/modals/AppModal';
import { useDbStore } from '@/store/db';
import { useHostStore } from '@/store/host';
import { type ActiveHost, type Host } from '@/types';

export default function ServerBuilder() {
  const { hosts } = useDbStore();
  const { selectedHostId, selectedVariantId, core, ram } = useHostStore();
  const host = hosts.find((h: Host) => h.id === selectedHostId) || hosts[0];

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
      <BuilderCatalog host={activeHost} setAppModalData={setAppModalData} />

      {/* ─── RIGHT: Resource Monitor ─── */}
      <BuilderMonitor host={activeHost} setAppModalData={setAppModalData} />

      {/* ─── MODALS ─── */}
      <AppModal app={appModalData} onClose={() => setAppModalData(null)} />
    </div>
  );
}
