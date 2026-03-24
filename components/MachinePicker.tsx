'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Cpu, MemoryStick, Cloud, Server, ChevronDown, LayoutDashboard, Settings, Box } from 'lucide-react';

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
    selectedMachineId, selectedVariantId, 
    setSelectedMachineId, setSelectedVariantId, 
    machines, customVariantCores, customVariantRam, 
    setCustomResources, mode, toggleMode 
  } = useAppStore();
  
  const [openDropdown, setOpenDropdown] = useState<'machine' | 'variant' | 'cpu' | 'ram' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelectMachine = (id: string) => {
    setSelectedMachineId(id);
    setOpenDropdown(null);
    setTimeout(() => document.getElementById('recommendations-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const miniPcs = machines.filter(m => m.type === 'MINI_PC').sort((a, b) => a.name.localeCompare(b.name));
  const vpss = machines.filter(m => m.type === 'VPS').sort((a, b) => a.name.localeCompare(b.name));
  const customs = machines.filter(m => m.type === 'CUSTOM');

  const selectedMachine = machines.find(m => m.id === selectedMachineId);
  const selectedVariant = selectedMachine?.variants.find(v => v.id === selectedVariantId) || selectedMachine?.variants[0];

  const isCustom = selectedMachine?.type === 'CUSTOM';
  const currentCores = isCustom ? customVariantCores : (selectedVariant?.cpuCores || 0);
  const currentRam = isCustom ? customVariantRam : (selectedVariant?.memoryRamGb || 0);

  const CPU_OPTIONS = [1, 2, 4, 6, 8, 10, 12, 14, 16, 24, 32, 64];
  const RAM_OPTIONS = [1, 2, 4, 6, 8, 12, 16, 24, 32, 64, 128];

  return (
    <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 font-mono">

      {/* ─── MAIN SELECTOR BAR ─── */}
      <div 
        ref={containerRef}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4 py-3 sm:py-2 px-4 rounded-md border border-line-accent bg-card w-full md:w-auto"
      >
        {/* ─── MACHINE SELECTOR ─── */}
        <div className="relative flex-1 sm:flex-none">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'machine' ? null : 'machine')}
            className="flex items-center justify-between sm:justify-start gap-3 py-1 group transition-colors text-left w-full"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                {getMachineTypeIcon(selectedMachine?.type)}
                <span className="text-[8px] mt-1 font-bold tracking-widest uppercase text-fg-dim">
                  {getMachineTypeLabel(selectedMachine?.type)}
                </span>
              </div>
              
              <span className="font-bold text-sm text-fg sm:min-w-[140px] truncate max-w-[200px]">
                {selectedMachine ? selectedMachine.name : 'Choose...'}
              </span>
            </div>
            <ChevronDown size={14} className={`text-fg-dim transition-transform ${openDropdown === 'machine' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'machine' && (
            <div className="absolute top-full left-0 mt-3 w-full sm:w-72 bg-card border border-default rounded-md shadow-2xl z-50 max-h-80 overflow-y-auto ring-1 ring-black/5">
              <div className="p-1.5">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-fg-dim flex items-center gap-2">
                  <Cloud size={10} /> Cloud VPS
                </div>
                {vpss.map(m => (
                  <button key={m.id} onClick={() => handleSelectMachine(m.id)} className={`w-full text-left px-3 py-2 rounded-sm text-xs transition-all ${selectedMachineId === m.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}>
                    {m.name}
                  </button>
                ))}

                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-fg-dim mt-2 flex items-center gap-2 border-t border-default pt-3">
                  <Server size={10} /> Mini PCs & Servers
                </div>
                {miniPcs.map(m => (
                  <button key={m.id} onClick={() => handleSelectMachine(m.id)} className={`w-full text-left px-3 py-2 rounded-sm text-xs transition-all ${selectedMachineId === m.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}>
                    {m.name}
                  </button>
                ))}

                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-fg-dim mt-2 flex items-center gap-2 border-t border-default pt-3">
                  <Settings size={10} /> Custom Spec
                </div>
                {customs.map(m => (
                  <button key={m.id} onClick={() => handleSelectMachine(m.id)} className={`w-full text-left px-3 py-2 rounded-sm text-xs transition-all ${selectedMachineId === m.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedMachine && (
          <>
            <div className="w-full h-[1px] sm:w-[1px] sm:h-8 bg-border opacity-50 my-1 sm:my-0 sm:mx-2" />

            {/* ─── VARIANT SELECTOR / INFO ─── */}
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={() => {
                  if (selectedMachine.variants.length > 1 && !isCustom) setOpenDropdown(openDropdown === 'variant' ? null : 'variant');
                }}
                className={`flex items-center gap-2 py-1 text-left w-full ${selectedMachine.variants.length > 1 && !isCustom ? 'group transition-colors cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex flex-col items-center justify-center opacity-70">
                  <Box size={20} />
                  <span className="text-[8px] mt-1 uppercase font-bold text-fg-dim">Model</span>
                </div>
                <span className="font-bold text-sm text-fg max-w-[120px] truncate">
                  {selectedVariant?.name || 'Standard'}
                </span>
                {selectedMachine.variants.length > 1 && !isCustom && (
                   <ChevronDown size={14} className={`text-fg-dim transition-transform ${openDropdown === 'variant' ? 'rotate-180' : ''}`} />
                )}
              </button>

              {openDropdown === 'variant' && selectedMachine.variants.length > 1 && !isCustom && (
                <div className="absolute top-full left-0 mt-3 w-full sm:w-48 bg-card border border-default rounded-md shadow-2xl z-50">
                  <div className="p-1 px-1.5 flex flex-col gap-0.5">
                    {selectedMachine.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVariantId(v.id);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-sm text-xs transition-all ${selectedVariantId === v.id ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full h-[1px] sm:w-[1px] sm:h-8 bg-border opacity-50 my-1 sm:my-0 sm:mx-2" />

            {/* ─── CPU SELECTOR ─── */}
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={() => { if (isCustom) setOpenDropdown(openDropdown === 'cpu' ? null : 'cpu'); }}
                className={`flex items-center gap-2 py-1 text-left w-full ${isCustom ? 'group transition-colors cursor-pointer hover:text-accent' : 'cursor-default'}`}
              >
                <div className="flex flex-col items-center justify-center opacity-70">
                  <Cpu size={20} />
                  <span className="text-[8px] mt-1 font-bold tracking-widest uppercase text-fg-dim">CPU</span>
                </div>
                <span className="font-bold text-sm text-fg">
                  {currentCores} <span className="text-xs text-fg-dim">Cores</span>
                </span>
                {isCustom && <ChevronDown size={14} className={`text-fg-dim transition-transform ${openDropdown === 'cpu' ? 'rotate-180' : ''}`} />}
              </button>

              {openDropdown === 'cpu' && isCustom && (
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-3 w-full sm:w-32 bg-card border border-default rounded-md shadow-2xl z-50 max-h-60 overflow-y-auto">
                  <div className="p-1 px-1.5 flex flex-col gap-0.5">
                    {CPU_OPTIONS.map(cpu => (
                      <button
                        key={cpu}
                        onClick={() => {
                          setCustomResources(cpu, currentRam);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-center px-3 py-1.5 rounded-sm text-xs transition-all ${currentCores === cpu ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
                      >
                        {cpu} C
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full h-[1px] sm:w-[1px] sm:h-8 bg-border opacity-50 my-1 sm:my-0 sm:mx-2" />

            {/* ─── RAM SELECTOR ─── */}
            <div className="relative pr-2 flex-1 sm:flex-none">
              <button
                onClick={() => { if (isCustom) setOpenDropdown(openDropdown === 'ram' ? null : 'ram'); }}
                className={`flex items-center gap-2 py-1 text-left w-full ${isCustom ? 'group transition-colors cursor-pointer hover:text-accent' : 'cursor-default'}`}
              >
                <div className="flex flex-col items-center justify-center opacity-70">
                  <MemoryStick size={20} />
                  <span className="text-[8px] mt-1 font-bold tracking-widest uppercase text-fg-dim">RAM</span>
                </div>
                <span className="font-bold text-sm text-fg pr-2">
                  {currentRam} <span className="text-xs text-fg-dim">GB</span>
                </span>
                {isCustom && <ChevronDown size={14} className={`text-fg-dim transition-transform ${openDropdown === 'ram' ? 'rotate-180' : ''}`} />}
              </button>

              {openDropdown === 'ram' && isCustom && (
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-3 w-full sm:w-32 bg-card border border-default rounded-md shadow-2xl z-50 max-h-60 overflow-y-auto">
                  <div className="p-1 px-1.5 flex flex-col gap-0.5">
                    {RAM_OPTIONS.map(ram => (
                      <button
                        key={ram}
                        onClick={() => {
                          setCustomResources(currentCores, ram);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-center px-3 py-1.5 rounded-sm text-xs transition-all ${currentRam === ram ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-input text-fg'}`}
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
      <div className="flex items-center justify-center gap-4 py-2 px-5 rounded-md border border-line-accent bg-card w-full md:w-auto shrink-0 min-w-max">
        <button
          onClick={toggleMode}
          className="flex items-center justify-center gap-4 py-1 group transition-colors text-left w-full"
          title="Toggle Expert Mode"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
              <LayoutDashboard size={20} />
              <span className="text-[8px] mt-1 font-bold tracking-widest uppercase text-fg-dim">Mode</span>
            </div>

            {/* Toggle visual */}
            <div className="flex flex-col items-center justify-center gap-1.5 ml-1">
              <div className="w-8 h-4 flex items-center bg-input rounded-full p-0.5 border border-default transition-all shadow-inner">
                <div
                  className={`h-2.5 w-2.5 rounded-full transition-transform duration-300 shadow-sm ${
                    mode === 'expert'
                      ? 'bg-accent transform translate-x-4'
                      : 'bg-fg-dim'
                  }`}
                />
              </div>
              <span className={`text-[9px] font-bold tracking-widest uppercase ${mode === 'expert' ? 'text-accent' : 'text-fg'}`}>
                {mode === 'expert' ? 'Expert' : 'Basic'}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
