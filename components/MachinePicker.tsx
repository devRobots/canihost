'use client';

import { MachineType } from '@prisma/enums';
import {
  Box,
  ChevronDown,
  Cloud,
  Cpu,
  LayoutDashboard,
  MemoryStick,
  Server,
  Settings,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useAppStore } from '@/lib/store';

const getMachineTypeIcon = (type?: string) => {
  if (type === 'VPS') return <Cloud size={20} />;
  if (type === 'CUSTOM') return <Settings size={20} />;
  return <Server size={20} />;
};

const getMachineTypeLabel = (type?: string) => {
  if (type === 'VPS') return 'Cloud';
  if (type === 'CUSTOM') return 'Custom';
  return 'Device';
};

export default function MachinePicker() {
  const {
    selectedMachineId,
    selectedVariantId,
    setSelectedMachineId,
    setSelectedVariantId,
    machines,
    customVariantCores,
    customVariantRam,
    setCustomResources,
    mode,
    toggleMode,
  } = useAppStore();

  const [openDropdown, setOpenDropdown] = useState<
    'machine' | 'variant' | 'cpu' | 'ram' | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, {
      passive: true,
    });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelectMachine = (id: string) => {
    setSelectedMachineId(id);
    setOpenDropdown(null);
    setTimeout(
      () =>
        document
          .getElementById('recommendations-section')
          ?.scrollIntoView({ behavior: 'smooth' }),
      100,
    );
  };

  const miniPcs = machines
    .filter((m) => m.type === MachineType.MINI_PC)
    .sort((a, b) => a.name.localeCompare(b.name));
  const vpss = machines
    .filter((m) => m.type === MachineType.VPS)
    .sort((a, b) => a.name.localeCompare(b.name));
  const customs = machines.filter((m) => m.type === MachineType.CUSTOM);

  const selectedMachine = machines.find((m) => m.id === selectedMachineId);
  const selectedVariant =
    selectedMachine?.variants.find((v) => v.id === selectedVariantId) ||
    selectedMachine?.variants[0];

  const isCustom = selectedMachine?.type === MachineType.CUSTOM;
  const currentCores = isCustom
    ? customVariantCores
    : selectedVariant?.cpuCores || 0;
  const currentRam = isCustom
    ? customVariantRam
    : selectedVariant?.memoryRamGb || 0;

  const CPU_OPTIONS = [1, 2, 4, 6, 8, 10, 12, 14, 16, 24, 32, 64];
  const RAM_OPTIONS = [1, 2, 4, 6, 8, 12, 16, 24, 32, 64, 128];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 font-mono md:flex-row">
      {/* ─── MAIN SELECTOR BAR ─── */}
      <div
        ref={containerRef}
        className="border-line-accent bg-card flex w-full flex-col items-stretch justify-center gap-2 rounded-md border px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:py-2 md:w-auto"
      >
        {/* ─── MACHINE SELECTOR ─── */}
        <div className="relative flex-1 sm:flex-none">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === 'machine' ? null : 'machine')
            }
            className="group flex w-full items-center justify-between gap-3 py-1 text-left transition-colors sm:justify-start"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center opacity-70 transition-opacity group-hover:opacity-100">
                {getMachineTypeIcon(selectedMachine?.type)}
                <span className="text-fg-dim mt-1 text-[8px] font-bold tracking-widest uppercase">
                  {getMachineTypeLabel(selectedMachine?.type)}
                </span>
              </div>

              <span className="text-fg max-w-[200px] truncate pl-4 text-sm font-bold">
                {selectedMachine ? selectedMachine.name : 'Choose...'}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-fg-dim transition-transform ${openDropdown === 'machine' ? 'rotate-180' : ''}`}
            />
          </button>

          {openDropdown === 'machine' && (
            <div className="bg-card border-default absolute top-full left-0 z-50 mt-3 max-h-80 w-full overflow-y-auto rounded-md border shadow-2xl ring-1 ring-black/5 sm:w-72">
              <div className="p-1.5">
                <div className="text-fg-dim flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                  <Cloud size={10} /> Cloud VPS
                </div>
                {vpss.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMachine(m.id)}
                    className={`w-full rounded-sm px-3 py-2 text-left text-xs transition-all ${selectedMachineId === m.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
                  >
                    {m.name}
                  </button>
                ))}

                <div className="text-fg-dim border-default mt-2 flex items-center gap-2 border-t px-3 py-1.5 pt-3 text-[10px] font-bold tracking-widest uppercase">
                  <Server size={10} /> Mini PCs & Servers
                </div>
                {miniPcs.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMachine(m.id)}
                    className={`w-full rounded-sm px-3 py-2 text-left text-xs transition-all ${selectedMachineId === m.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
                  >
                    {m.name}
                  </button>
                ))}

                <div className="text-fg-dim border-default mt-2 flex items-center gap-2 border-t px-3 py-1.5 pt-3 text-[10px] font-bold tracking-widest uppercase">
                  <Settings size={10} /> Custom Spec
                </div>
                {customs.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMachine(m.id)}
                    className={`w-full rounded-sm px-3 py-2 text-left text-xs transition-all ${selectedMachineId === m.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedMachine && (
          <>
            <div className="bg-border my-1 h-[1px] w-full opacity-50 sm:mx-2 sm:my-0 sm:h-8 sm:w-[1px]" />

            {/* ─── VARIANT SELECTOR / INFO ─── */}
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={() => {
                  if (selectedMachine.variants.length > 1 && !isCustom)
                    setOpenDropdown(
                      openDropdown === 'variant' ? null : 'variant',
                    );
                }}
                className={`flex w-full items-center gap-2 py-1 text-left ${selectedMachine.variants.length > 1 && !isCustom ? 'group cursor-pointer transition-colors' : 'cursor-default'}`}
              >
                <div className="flex flex-col items-center justify-center opacity-70">
                  <Box size={20} />
                  <span className="text-fg-dim mt-1 text-[8px] font-bold uppercase">
                    Model
                  </span>
                </div>
                <span className="text-fg pl-4 text-sm font-bold">
                  {selectedVariant?.name || 'Standard'}
                </span>
                {selectedMachine.variants.length > 1 && !isCustom && (
                  <ChevronDown
                    size={14}
                    className={`text-fg-dim transition-transform ${openDropdown === 'variant' ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {openDropdown === 'variant' &&
                selectedMachine.variants.length > 1 &&
                !isCustom && (
                  <div className="bg-card border-default absolute top-full left-0 z-50 mt-3 w-full rounded-md border shadow-2xl sm:min-w-max">
                    <div className="flex flex-col gap-0.5 p-1 px-1.5">
                      {selectedMachine.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVariantId(v.id);
                            setOpenDropdown(null);
                          }}
                          className={`w-full rounded-sm px-3 py-2 text-left text-xs transition-all ${selectedVariantId === v.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="bg-border my-1 h-[1px] w-full opacity-50 sm:mx-2 sm:my-0 sm:h-8 sm:w-[1px]" />

            {/* ─── CPU SELECTOR ─── */}
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={() => {
                  if (isCustom)
                    setOpenDropdown(openDropdown === 'cpu' ? null : 'cpu');
                }}
                className={`flex w-full items-center gap-2 py-1 text-left ${isCustom ? 'group hover:text-accent cursor-pointer transition-colors' : 'cursor-default'}`}
              >
                <div className="flex flex-col items-center justify-center opacity-70">
                  <Cpu size={20} />
                  <span className="text-fg-dim mt-1 text-[8px] font-bold tracking-widest uppercase">
                    CPU
                  </span>
                </div>
                <span className="text-fg pl-4 text-sm font-bold">
                  {currentCores}{' '}
                  <span className="text-fg-dim text-xs">Cores</span>
                </span>
                {isCustom && (
                  <ChevronDown
                    size={14}
                    className={`text-fg-dim transition-transform ${openDropdown === 'cpu' ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {openDropdown === 'cpu' && isCustom && (
                <div className="bg-card border-default absolute top-full left-0 z-50 mt-3 max-h-60 w-full overflow-y-auto rounded-md border shadow-2xl sm:right-0 sm:left-auto sm:w-32">
                  <div className="flex flex-col gap-0.5 p-1 px-1.5">
                    {CPU_OPTIONS.map((cpu) => (
                      <button
                        key={cpu}
                        onClick={() => {
                          setCustomResources(cpu, currentRam);
                          setOpenDropdown(null);
                        }}
                        className={`w-full rounded-sm px-3 py-1.5 text-center text-xs transition-all ${currentCores === cpu ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
                      >
                        {cpu} C
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-border my-1 h-[1px] w-full opacity-50 sm:mx-2 sm:my-0 sm:h-8 sm:w-[1px]" />

            {/* ─── RAM SELECTOR ─── */}
            <div className="relative flex-1 pr-2 sm:flex-none">
              <button
                onClick={() => {
                  if (isCustom)
                    setOpenDropdown(openDropdown === 'ram' ? null : 'ram');
                }}
                className={`flex w-full items-center gap-2 py-1 text-left ${isCustom ? 'group hover:text-accent cursor-pointer transition-colors' : 'cursor-default'}`}
              >
                <div className="flex flex-col items-center justify-center opacity-70">
                  <MemoryStick size={20} />
                  <span className="text-fg-dim mt-1 text-[8px] font-bold tracking-widest uppercase">
                    RAM
                  </span>
                </div>
                <span className="text-fg pl-4 text-sm font-bold">
                  {currentRam} <span className="text-fg-dim text-xs">GB</span>
                </span>
                {isCustom && (
                  <ChevronDown
                    size={14}
                    className={`text-fg-dim transition-transform ${openDropdown === 'ram' ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {openDropdown === 'ram' && isCustom && (
                <div className="bg-card border-default absolute top-full left-0 z-50 mt-3 max-h-60 w-full overflow-y-auto rounded-md border shadow-2xl sm:right-0 sm:left-auto sm:w-32">
                  <div className="flex flex-col gap-0.5 p-1 px-1.5">
                    {RAM_OPTIONS.map((ram) => (
                      <button
                        key={ram}
                        onClick={() => {
                          setCustomResources(currentCores, ram);
                          setOpenDropdown(null);
                        }}
                        className={`w-full rounded-sm px-3 py-1.5 text-center text-xs transition-all ${currentRam === ram ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
                      >
                        {ram} GB
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ─── SEPARATED MODE TOGGLE ─── */}
      <div className="border-line-accent bg-card flex w-full min-w-max shrink-0 items-center justify-center gap-4 rounded-md border px-5 py-2 md:w-auto">
        <button
          onClick={toggleMode}
          className="group flex w-full items-center justify-center gap-4 py-1 text-left transition-colors"
          title="Toggle Expert Mode"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center opacity-70 transition-opacity group-hover:opacity-100">
              <LayoutDashboard size={20} />
              <span className="text-fg-dim mt-1 text-[8px] font-bold tracking-widest uppercase">
                Mode
              </span>
            </div>

            {/* Toggle visual */}
            <div className="ml-1 flex flex-col items-center justify-center gap-1.5">
              <div className="bg-input border-default flex h-4 w-8 items-center rounded-full border p-0.5 shadow-inner transition-all">
                <div
                  className={`h-2.5 w-2.5 rounded-full shadow-sm transition-transform duration-300 ${
                    mode === 'expert'
                      ? 'bg-accent translate-x-4 transform'
                      : 'bg-fg-dim'
                  }`}
                />
              </div>
              <span
                className={`text-[9px] font-bold tracking-widest uppercase ${mode === 'expert' ? 'text-accent' : 'text-fg'}`}
              >
                {mode === 'expert' ? 'Expert' : 'Basic'}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
