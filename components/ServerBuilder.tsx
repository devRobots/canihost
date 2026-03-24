'use client';

import { Service } from '@prisma/client';
import { MachineType } from '@prisma/enums';
import { useState } from 'react';

import BuilderCatalog from '@/components/BuilderCatalog';
import BuilderMonitor from '@/components/BuilderMonitor';
import Modal from '@/components/Modal';
import ServiceModal from '@/components/ServiceModal';
import { useAppStore } from '@/lib/store';
import { type ActiveMachine, type Machine } from '@/types';

export default function ServerBuilder() {
  const {
    machines,
    selectedMachineId,
    selectedVariantId,
    customVariantCores,
    customVariantRam,
  } = useAppStore();
  const machine =
    machines.find((m: Machine) => m.id === selectedMachineId) || machines[0];

  const [machineModalOpen, setMachineModalOpen] = useState(false);
  const [serviceModalData, setServiceModalData] = useState<Service | null>(
    null,
  );

  if (!machine) {
    return (
      <div className="bg-page text-fg-dim flex min-h-[calc(100vh-56px)] w-full items-center justify-center font-mono">
        <span className="prompt">Loading...</span>
      </div>
    );
  }

  const selectedVariant =
    machine.variants?.find((v) => v.id === selectedVariantId) ||
    machine.variants?.[0] ||
    null;
  const isCustom = machine.type === MachineType.CUSTOM;

  const activeMachine: ActiveMachine = {
    ...machine,
    cpuCores: isCustom ? customVariantCores : selectedVariant?.cpuCores || 0,
    memoryRamGb: isCustom
      ? customVariantRam
      : selectedVariant?.memoryRamGb || 0,
  };

  return (
    <div className="bg-page mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-screen-2xl flex-col font-mono lg:flex-row">
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
      <ServiceModal
        service={serviceModalData}
        onClose={() => setServiceModalData(null)}
      />

      <Modal
        isOpen={machineModalOpen}
        onClose={() => setMachineModalOpen(false)}
        title={machine.name}
      >
        <div className="text-fg-muted flex flex-col gap-6 p-2 font-sans text-sm">
          <div className="border-default mt-2 grid grid-cols-2 gap-y-2 border-t pt-4 text-xs">
            <div className="text-fg-dim">Architecture:</div>
            <div className="text-fg text-right font-mono">
              {activeMachine.type}
            </div>

            <div className="text-fg-dim">CPU Cores:</div>
            <div className="text-fg text-right font-mono">
              {activeMachine.cpuCores}
            </div>

            <div className="text-fg-dim">Memory RAM:</div>
            <div className="text-fg text-right font-mono">
              {activeMachine.memoryRamGb} GB
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
