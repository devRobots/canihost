'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import Modal from '@/components/Modal';
import ServiceModal from '@/components/ServiceModal';
import { useTranslations } from 'next-intl';
import BuilderCatalog from '@/components/BuilderCatalog';
import BuilderMonitor from '@/components/BuilderMonitor';
import { type Service, type Machine } from '@/types';

export default function ServerBuilder() {
  const { machines, selectedMachineId } = useAppStore();
  const machine = machines.find((m: Machine) => m.id === selectedMachineId) || machines[0];
  const tMod = useTranslations('Modal');

  const [machineModalOpen, setMachineModalOpen] = useState(false);
  const [serviceModalData, setServiceModalData] = useState<Service | null>(null);

  if (!machine) {
    return (
      <div className="flex bg-page w-full min-h-[calc(100vh-56px)] justify-center items-center text-fg-dim font-mono">
        <span className="prompt">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto min-h-[calc(100vh-56px)] font-mono bg-page">
      {/* ─── LEFT: Catalog ─── */}
      <BuilderCatalog 
        machine={machine} 
        setServiceModalData={setServiceModalData}
        setMachineModalOpen={setMachineModalOpen}
      />

      {/* ─── RIGHT: Resource Monitor ─── */}
      <BuilderMonitor 
        machine={machine} 
        setServiceModalData={setServiceModalData} 
      />

      {/* ─── MODALS ─── */}
      <ServiceModal service={serviceModalData} onClose={() => setServiceModalData(null)} />

      <Modal
        isOpen={machineModalOpen}
        onClose={() => setMachineModalOpen(false)}
        title={machine.name}
      >
        <div className="flex flex-col gap-6 text-sm text-fg-muted font-sans p-2">
          {machine.brand && (
            <div className="flex items-center gap-2 text-fg">
              <span className="font-bold text-accent">■</span> Brand: <strong>{machine.brand}</strong>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {machine.targetAudience && (
              <div className="flex flex-col gap-1">
                <div className="font-bold text-accent uppercase tracking-widest text-[10px]">{'// '} {tMod('targetAudience')}</div>
                <div className="text-fg-dim leading-relaxed">{machine.targetAudience}</div>
              </div>
            )}

            {machine.useCases && (
              <div className="flex flex-col gap-1">
                <div className="font-bold text-accent uppercase tracking-widest text-[10px]">{'// '} {tMod('useCases')}</div>
                <div className="text-fg-dim leading-relaxed">{machine.useCases}</div>
              </div>
            )}

            {machine.specialTech && (
              <div className="flex flex-col gap-1">
                <div className="font-bold text-accent uppercase tracking-widest text-[10px]">{'// '} {tMod('specialTech')}</div>
                <div className="text-fg-dim leading-relaxed">{machine.specialTech}</div>
              </div>
            )}

            {machine.technicalSpecs && (
              <div className="flex flex-col gap-1">
                <div className="font-bold text-accent uppercase tracking-widest text-[10px]">{'// '} {tMod('technicalSpecs')}</div>
                <div className="text-fg-dim leading-relaxed">{machine.technicalSpecs}</div>
              </div>
            )}
          </div>

          <div className="mt-2 border-t border-default pt-4 grid grid-cols-2 gap-y-2 text-xs">
            <div className="text-fg-dim">Architecture:</div>
            <div className="text-right text-fg font-mono">{machine.type}</div>

            <div className="text-fg-dim">CPU Cores:</div>
            <div className="text-right text-fg font-mono">{machine.cpuCores}</div>

            <div className="text-fg-dim">Memory RAM:</div>
            <div className="text-right text-fg font-mono">{machine.memoryRamGb} GB</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
