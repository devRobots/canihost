'use client';

import * as React from 'react';
import { getServiceIcon } from '@/lib/icons';
import { useAppStore } from '@/lib/store';
import Modal from './Modal';
import ServiceModal from './ServiceModal';
import PieChart from './PieChart';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type Machine = { id: string, name: string, type: string, brand: string | null, cpuCores: number, memoryRamGb: number, targetAudience: string | null, useCases: string | null, specialTech: string | null, technicalSpecs: string | null };
type Service = { id: string, name: string, category: string, cpuCost: number, ramCostGb: number, isCloudRecommended: boolean, description: string | null, minRequirements: string | null, recRequirements: string | null };

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function ServerBuilder({ machine, allServices }: { machine: Machine, allServices: Service[] }) {
  const { selectedServiceIds, toggleServiceId, mode } = useAppStore();
  const tCat = useTranslations('Categories');
  const tIdx = useTranslations('Index');
  const tMod = useTranslations('Modal');

  const [machineModalOpen, setMachineModalOpen] = React.useState(false);
  const [serviceModalData, setServiceModalData] = React.useState<Service | null>(null);
  const [collapsedCategories, setCollapsedCategories] = React.useState<Record<string, boolean>>({});

  const isExpert = mode === 'expert';
  const selectedServices = allServices.filter(s => selectedServiceIds.has(s.id));
  const totalCpu = selectedServices.reduce((acc, s) => acc + s.cpuCost, 0);
  const totalRam = selectedServices.reduce((acc, s) => acc + s.ramCostGb, 0);

  const cpuPct = Math.min(Math.round((totalCpu / machine.cpuCores) * 100), 999);
  const ramPct = Math.min(Math.round((totalRam / machine.memoryRamGb) * 100), 999);

  const isCpuOver = totalCpu > machine.cpuCores;
  const isRamOver = totalRam > machine.memoryRamGb;
  const cloudWarnings = selectedServices.filter(s => !s.isCloudRecommended && machine.type === 'VPS');

  let cpuClass: 'accent' | 'warn' | 'danger' = 'accent';
  if (isCpuOver) cpuClass = 'danger';
  else if (cpuPct > 70) cpuClass = 'warn';

  let ramClass: 'accent' | 'warn' | 'danger' = 'accent';
  if (isRamOver) ramClass = 'danger';
  else if (ramPct > 70) ramClass = 'warn';

  const categories = Array.from(new Set(allServices.map(s => s.category))).sort();

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div
      className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto min-h-[calc(100vh-56px)]"
      style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg)' }}
    >
      {/* ─── LEFT: Catalog ─── */}
      <div
        className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto"
        style={{ borderRight: '1px solid var(--border)' }}
      >
        {/* Machine Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--accent)',
            boxShadow: '0 0 20px var(--accent-glow)',
          }}
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--accent)' }}>▶</span>
              <span className="font-bold text-lg" style={{ color: 'var(--accent)' }}>{machine.name}</span>
              <span className="tag px-2">{machine.type === 'VPS' ? 'Cloud VPS' : 'Mini PC'}</span>
              <button
                onClick={() => setMachineModalOpen(true)}
                className="ml-2 text-xs w-6 h-6 flex items-center justify-center rounded-full border transition-all hover:bg-white/10"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                title={tIdx('info')}
              >
                i
              </button>
            </div>
            {isExpert && (
              <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                CPU: <strong>{machine.cpuCores}c</strong> · RAM: <strong>{machine.memoryRamGb}GB</strong>
              </p>
            )}
          </div>
          <Link
            href="/"
            className="text-xs font-bold px-4 py-2 transition-all text-center"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              textDecoration: 'none',
              borderRadius: 4,
            }}
          >
            ↶ {tIdx('changeMachine')}
          </Link>
        </div>

        {/* Categories */}
        {categories.map(cat => {
          const isCollapsed = collapsedCategories[cat];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const catNameTranslated = tCat(cat as any) || cat;

          return (
            <div key={cat} className="flex flex-col gap-3">
              <button
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-left transition-colors hover:brightness-125"
                style={{ color: 'var(--fg-muted)' }}
              >
                <span style={{ color: 'var(--accent)', display: 'inline-block', width: 12 }}>
                  {isCollapsed ? '+' : '-'}
                </span>
                {catNameTranslated}
              </button>

              {!isCollapsed && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {allServices.filter(s => s.category === cat).map(svc => {
                    const isSelected = selectedServiceIds.has(svc.id);
                    const isLocalOnly = !svc.isCloudRecommended && machine.type === 'VPS';
                    const icon = getServiceIcon(svc.name);

                    let borderColor = 'var(--border)';
                    if (isSelected) borderColor = 'var(--accent)';
                    else if (isLocalOnly) borderColor = 'var(--yellow)';

                    return (
                      <button
                        key={svc.id}
                        onClick={() => toggleServiceId(svc.id)}
                        className="relative flex flex-col pt-2 transition-all active:scale-[0.98] cursor-pointer"
                        style={{
                          background: isSelected ? 'var(--accent-glow)' : 'var(--bg-card)',
                          border: `1px solid ${borderColor}`,
                          boxShadow: isSelected ? '0 0 10px var(--accent-glow)' : 'none',
                          opacity: isLocalOnly && !isSelected ? 0.7 : 1,
                          borderRadius: 6,
                          minHeight: 120,
                        }}
                      >
                        {/* Info Button Top Left */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setServiceModalData(svc); }}
                          className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center text-[10px] font-bold transition-all hover:bg-white/10 z-10"
                          style={{ 
                            background: 'var(--bg-input)', 
                            border: '1px solid var(--border)', 
                            color: 'var(--fg)', 
                            borderRadius: 4 
                          }}
                          title={tIdx('info')}
                        >
                          i
                        </button>

                        {/* Selection Checkmark Top Right */}
                        <div
                          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center transition-all z-10"
                          style={{
                            background: isSelected ? 'var(--accent)' : 'var(--bg-input)',
                            border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                            color: isSelected ? 'var(--bg)' : 'transparent',
                            borderRadius: 4
                          }}
                        >
                          <span className="text-sm font-bold mt-0.5">✓</span>
                        </div>

                        <div className="flex flex-col items-center gap-2 text-center flex-1 pt-6 pb-2">
                          <span className="text-3xl leading-none">{icon}</span>
                          <span className="font-bold text-xs mt-1 leading-tight px-1" style={{ color: isSelected ? 'var(--accent)' : 'var(--fg)' }}>
                            {svc.name}
                          </span>
                        </div>

                        {/* Hardware Metrics Footer */}
                        <div className="flex justify-center mt-auto pt-2 pb-1 text-[10px] font-mono w-full" style={{ borderTop: '1px solid var(--border)', color: 'var(--fg-dim)' }}>
                          {isExpert ? (
                            <div className="flex gap-2 w-full justify-center">
                              <span>{svc.cpuCost.toFixed(1)}c</span>
                              <span>|</span>
                              <span>{svc.ramCostGb.toFixed(1)}G</span>
                            </div>
                          ) : (
                            <div className="flex gap-2 w-full justify-center">
                              <span>{(svc.cpuCost / machine.cpuCores * 100).toFixed(0)}%C</span>
                              <span>|</span>
                              <span>{(svc.ramCostGb / machine.memoryRamGb * 100).toFixed(0)}%R</span>
                            </div>
                          )}
                        </div>
                        
                        {isLocalOnly && (
                          <div className="absolute bottom-1 right-1 text-[8px] uppercase font-bold" style={{ color: 'var(--yellow)' }}>⚠ Local</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── RIGHT: Resource Monitor ─── */}
      <div
        className="w-full lg:w-80 flex flex-col gap-6 p-6 sticky bottom-0 lg:top-14 lg:h-[calc(100vh-56px)] overflow-y-auto z-10"
        style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}
      >
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--fg-muted)' }}>
          <span style={{ color: 'var(--accent)' }}>{'// '}</span>
          Resource Monitor
        </div>

        {isExpert ? (
          /* EXPERT MODE BARS */
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs" style={{ color: 'var(--fg-dim)' }}>
                <span>{tIdx('cpu')}</span>
                <span style={{ color: isCpuOver ? 'var(--red)' : 'var(--fg)' }}>
                  {totalCpu.toFixed(1)} / {machine.cpuCores.toFixed(1)} ({cpuPct}%)
                </span>
              </div>
              <div className="bar-track">
                <div className={`bar-fill ${cpuClass === 'accent' ? '' : cpuClass}`} style={{ width: `${Math.min(cpuPct, 100)}%` }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs" style={{ color: 'var(--fg-dim)' }}>
                <span>{tIdx('ram')}</span>
                <span style={{ color: isRamOver ? 'var(--red)' : 'var(--fg)' }}>
                  {totalRam.toFixed(1)}GB / {machine.memoryRamGb.toFixed(1)}GB ({ramPct}%)
                </span>
              </div>
              <div className="bar-track">
                <div className={`bar-fill ${ramClass === 'accent' ? '' : ramClass}`} style={{ width: `${Math.min(ramPct, 100)}%` }} />
              </div>
            </div>
          </div>
        ) : (
          /* SIMPLE MODE PIE CHARTS */
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col items-center gap-2">
               <PieChart used={totalCpu} total={machine.cpuCores} colorClass={cpuClass} />
               <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--fg-dim)' }}>{tIdx('cpu')}</span>
             </div>
             <div className="flex flex-col items-center gap-2">
               <PieChart used={totalRam} total={machine.memoryRamGb} colorClass={ramClass} />
               <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--fg-dim)' }}>{tIdx('ram')}</span>
             </div>
          </div>
        )}

        {/* Warnings */}
        {(isCpuOver || isRamOver || cloudWarnings.length > 0) && (
          <div className="flex flex-col gap-2">
            {isCpuOver && (
              <div className="text-xs p-3" style={{ background: 'color-mix(in srgb, var(--red) 10%, transparent)', border: '1px solid var(--red)', color: 'var(--red)', borderRadius: 4 }}>
                🚨 {tIdx('cpu')} limit exceeded
              </div>
            )}
            {isRamOver && (
              <div className="text-xs p-3" style={{ background: 'color-mix(in srgb, var(--red) 10%, transparent)', border: '1px solid var(--red)', color: 'var(--red)', borderRadius: 4 }}>
                🚨 {tIdx('ram')} limit exceeded
              </div>
            )}
            {cloudWarnings.length > 0 && (
              <div className="text-xs p-3" style={{ background: 'color-mix(in srgb, var(--yellow) 10%, transparent)', border: '1px solid var(--yellow)', color: 'var(--yellow)', borderRadius: 4 }}>
                ⚠ {tIdx('cloudWarning')}: {cloudWarnings.map(s => s.name).join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Selected stack list */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-xs font-bold uppercase tracking-widest mt-2" style={{ color: 'var(--fg-muted)' }}>
            <span style={{ color: 'var(--accent)' }}>{'// '}</span>
            Stack ({selectedServices.length})
          </div>
          {selectedServices.length === 0 ? (
            <p className="text-xs prompt" style={{ color: 'var(--fg-dim)' }}>_</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {selectedServices.map(s => (
                <li
                  key={s.id}
                  className="flex items-center justify-between text-xs py-1.5"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <div className="flex flex-col flex-1 min-w-0 pr-2">
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{getServiceIcon(s.name)}</span>
                      <span style={{ color: 'var(--fg)' }} className="truncate font-bold">{s.name}</span>
                    </span>
                    <span className="text-[10px] opacity-70 mt-0.5 ml-6" style={{ fontFamily: 'var(--font-mono)' }}>
                      {isExpert ? (
                        <>CPU: {s.cpuCost.toFixed(1)}c | RAM: {s.ramCostGb.toFixed(1)}GB</>
                      ) : (
                        <>C: {(s.cpuCost / machine.cpuCores * 100).toFixed(0)}% | R: {(s.ramCostGb / machine.memoryRamGb * 100).toFixed(0)}%</>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleServiceId(s.id)}
                    className="text-xs transition-colors hover:text-red-400 p-1"
                    style={{ color: 'var(--fg-dim)' }}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ─── MODALS ─── */}
      <Modal
        isOpen={machineModalOpen}
        onClose={() => setMachineModalOpen(false)}
        title={tMod('machineDetails')}
      >
        <div className="flex flex-col gap-4 text-sm" style={{ color: 'var(--fg-muted)' }}>
          <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
             <span className="text-4xl">{machine.type === 'VPS' ? '☁' : '📟'}</span>
             <div>
               <h3 className="font-bold text-lg" style={{ color: 'var(--fg)' }}>{machine.name}</h3>
               <p className="text-xs">{machine.brand || 'Generic'}</p>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
               <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--accent)' }}>{tMod('targetAudience')}</div>
               <div>{machine.targetAudience || 'General Purpose'}</div>
            </div>
            <div>
               <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--accent)' }}>{tMod('specialTech')}</div>
               <div>{machine.specialTech || 'N/A'}</div>
            </div>
            <div className="col-span-2">
               <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--accent)' }}>{tMod('useCases')}</div>
               <div>{machine.useCases || 'Various workloads'}</div>
            </div>
            <div className="col-span-2 p-3 rounded" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
               <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--accent)' }}>{tMod('technicalSpecs')}</div>
               <div className="font-mono text-xs">{machine.technicalSpecs || `${machine.cpuCores} CPU / ${machine.memoryRamGb} GB RAM`}</div>
            </div>
          </div>
        </div>
      </Modal>

      <ServiceModal service={serviceModalData} onClose={() => setServiceModalData(null)} />
    </div>
  );
}
