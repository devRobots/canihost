'use client';

import { App } from '@prisma/client';
import { useState } from 'react';

import BuilderCatalog from '@/components/builder/BuilderCatalog';
import BuilderMonitor from '@/components/builder/BuilderMonitor';
import AppModal from '@/components/modals/AppModal';
import { useHostStore } from '@/store/host';

export default function ServerBuilder() {
  const { activeHost } = useHostStore();
  const [appModalData, setAppModalData] = useState<App | null>(null);

  if (!activeHost) {
    return (
      <div className="bg-page text-fg-dim flex min-h-[calc(100vh-56px)] w-full items-center justify-center font-mono">
        <span className="prompt">Loading...</span>
      </div>
    );
  }

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
