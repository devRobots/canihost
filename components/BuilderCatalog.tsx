'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { getServiceIcon } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { type Machine, type Service } from '@/types';

type Props = {
  machine: Machine;
  setServiceModalData: (s: Service | null) => void;
  setMachineModalOpen: (b: boolean) => void;
};

export default function BuilderCatalog({ machine, setServiceModalData, setMachineModalOpen }: Props) {
  const { allServices, selectedServiceIds, toggleServiceId, mode } = useAppStore();
  const tCat = useTranslations('Categories');
  const tIdx = useTranslations('Index');
  const isExpert = mode === 'expert';

  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const categories = Array.from(new Set(allServices.map(s => s.category))).sort();

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto border-r border-default">
      {/* Machine Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-card border-line-accent pulse-glow">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-accent">▶</span>
            <span className="font-bold text-lg text-accent">{machine.name}</span>
            <span className="tag px-2">{machine.type === 'VPS' ? 'Cloud VPS' : 'Mini PC'}</span>
            <button
              onClick={() => setMachineModalOpen(true)}
              className="ml-2 text-xs w-6 h-6 flex items-center justify-center rounded-full border border-accent text-accent transition-all hover:bg-white/10"
              title={tIdx('info')}
            >
              i
            </button>
          </div>
          {isExpert && (
            <p className="text-xs text-fg-muted">
              CPU: <strong>{machine.cpuCores}c</strong> · RAM: <strong>{machine.memoryRamGb}GB</strong>
            </p>
          )}
        </div>
        <Link
          href="/"
          className="text-xs font-bold px-4 py-2 transition-all text-center btn-terminal"
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
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-left transition-colors hover:brightness-125 text-fg-muted"
            >
              <span className="text-accent inline-block w-3">
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

                  let borderColorClass = 'border-default';
                  if (isSelected) borderColorClass = 'border-accent';
                  else if (isLocalOnly) borderColorClass = 'border-yellow-500';

                  return (
                    <div
                      key={svc.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleServiceId(svc.id)}
                      onKeyDown={(e) => e.key === 'Enter' && toggleServiceId(svc.id)}
                      className={`relative flex flex-col pt-2 transition-all active:scale-[0.98] cursor-pointer rounded-md min-h-[120px] ${
                        isSelected ? 'bg-accent/10 shadow-lg shadow-accent/20' : 'bg-card'
                      } cursor-pointer min-h-[120px] ${!isSelected && isLocalOnly ? 'opacity-70' : 'opacity-100'} border ${borderColorClass}`}
                    >
                      {/* Info Button Top Left */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setServiceModalData(svc); }}
                        className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center text-[10px] font-bold transition-all hover:bg-white/10 z-10 btn-terminal bg-input"
                        title={tIdx('info')}
                      >
                        i
                      </button>

                      {/* Selection Checkmark Top Right */}
                      <div
                        className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center transition-all z-10 rounded ${
                          isSelected ? 'bg-accent border text-[var(--bg)]' : 'bg-input border-line text-transparent'
                        }`}
                      >
                        <span className="text-sm font-bold mt-0.5">✓</span>
                      </div>

                      <div className="flex flex-col items-center gap-2 text-center flex-1 pt-6 pb-2">
                        <span className="text-3xl leading-none">{icon}</span>
                        <span className={`font-bold text-xs mt-1 leading-tight px-1 ${isSelected ? 'text-accent' : 'text-fg'}`}>
                          {svc.name}
                        </span>
                      </div>

                      {/* Hardware Metrics Footer */}
                      <div className="flex justify-center mt-auto pt-2 pb-1 text-[10px] font-mono w-full border-t border-default text-fg-dim">
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
                        <div className="absolute bottom-1 right-1 text-[8px] uppercase font-bold text-yellow-500">⚠ Local</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
