'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import Modal from '@/components/Modal';
import ServiceModal from '@/components/ServiceModal';

import BuilderCatalog from '@/components/BuilderCatalog';
import BuilderMonitor from '@/components/BuilderMonitor';
import { type Service, type Machine, type ActiveMachine } from '@/types';

export default function ServerBuilder() {
  const { machines, selectedMachineId, selectedVariantId, customVariantCores, customVariantRam } = useAppStore();
  const machine = machines.find((m: Machine) => m.id === selectedMachineId) || machines[0];

  const [machineModalOpen, setMachineModalOpen] = useState(false);
  const [serviceModalData, setServiceModalData] = useState<Service | null>(null);

  if (!machine) {
    return (
      <div className="flex bg-page w-full min-h-[calc(100vh-56px)] justify-center items-center text-fg-dim font-mono">
        <span className="prompt">Loading...</span>
      </div>
    );
  }

  const selectedVariant = machine.variants?.find(v => v.id === selectedVariantId) || machine.variants?.[0] || null;
  const isCustom = machine.type === 'CUSTOM';
  
  const activeMachine: ActiveMachine = {
    ...machine,
    cpuCores: isCustom ? customVariantCores : (selectedVariant?.cpuCores || 0),
    memoryRamGb: isCustom ? customVariantRam : (selectedVariant?.memoryRamGb || 0),
  };

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto min-h-[calc(100vh-56px)] font-mono bg-page">
      {/* ─── LEFT: Catalog ─── */}
      <BuilderCatalog 
        machine={activeMachine} 
        setServiceModalData={setServiceModalData}
        setMachineModalOpen={setMachineModalOpen}
      />

      {/* ─── RIGHT: Resource Monitor ─── */}
      <BuilderMonitor 
        machine={activeMachine} 
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
          <div className="mt-2 border-t border-default pt-4 grid grid-cols-2 gap-y-2 text-xs">
            <div className="text-fg-dim">Architecture:</div>
            <div className="text-right text-fg font-mono">{activeMachine.type}</div>

            <div className="text-fg-dim">CPU Cores:</div>
            <div className="text-right text-fg font-mono">{activeMachine.cpuCores}</div>

            <div className="text-fg-dim">Memory RAM:</div>
            <div className="text-right text-fg font-mono">{activeMachine.memoryRamGb} GB</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
