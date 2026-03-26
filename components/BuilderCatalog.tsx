'use client';

import { App } from '@prisma/client';
import { HostType } from '@prisma/enums';
import { useState } from 'react';

import { useBuilderStore, useDbStore, useModeStore } from '@/lib/store';
import { type ActiveHost } from '@/types';

import HostPicker from './hostpicker/HostPicker';

type Props = {
  host: ActiveHost;
  setAppModalData: (s: App | null) => void;
};

export default function BuilderCatalog({
  host,
  setAppModalData,
}: Props) {
  const { apps } = useDbStore();
  const { selectedAppIds, toggleAppId } = useBuilderStore();
  const { mode } = useModeStore();

  const isExpert = mode === 'expert';

  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});
  const categories = Array.from(new Set(apps.map((s) => s.category))).sort();

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="border-default flex flex-1 flex-col gap-6 overflow-y-auto border-r p-6">
      <HostPicker />

      {categories.map((cat) => {
        const isCollapsed = collapsedCategories[cat];
        const catNameTranslated = cat;

        return (
          <div key={cat} className="flex flex-col gap-3">
            <button
              onClick={() => toggleCategory(cat)}
              className="text-fg-muted flex items-center gap-2 text-left text-xs font-bold tracking-widest uppercase transition-colors hover:brightness-125"
            >
              <span className="text-accent inline-block w-3">
                {isCollapsed ? '+' : '-'}
              </span>
              {catNameTranslated}
            </button>

            {!isCollapsed && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {apps
                  .filter((s) => s.category === cat)
                  .map((svc) => {
                    const isSelected = selectedAppIds.has(svc.id);
                    const isLocalOnly =
                      !svc.isCloudRecommended && host.type === HostType.VPS;

                    let borderColorClass = 'border-default';
                    if (isSelected) borderColorClass = 'border-accent';
                    else if (isLocalOnly)
                      borderColorClass = 'border-yellow-500';

                    return (
                      <div
                        key={svc.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleAppId(svc.id)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && toggleAppId(svc.id)
                        }
                        className={`relative flex min-h-[120px] cursor-pointer flex-col rounded-md pt-2 transition-all active:scale-[0.98] ${
                          isSelected
                            ? 'bg-accent/10 shadow-accent/20 shadow-lg'
                            : 'bg-card'
                        } min-h-[120px] cursor-pointer ${!isSelected && isLocalOnly ? 'opacity-70' : 'opacity-100'} border ${borderColorClass}`}
                      >
                        {/* Info Button Top Left */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAppModalData(svc);
                          }}
                          className="btn-terminal bg-input absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center text-[10px] font-bold transition-all hover:bg-white/10"
                          title="Info"
                        >
                          i
                        </button>

                        {/* Selection Checkmark Top Right */}
                        <div
                          className={`absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded transition-all ${
                            isSelected
                              ? 'bg-accent border text-(--bg)'
                              : 'bg-input border-line text-transparent'
                          }`}
                        >
                          <span className="mt-0.5 text-sm font-bold">✓</span>
                        </div>

                        <div className="flex flex-1 flex-col items-center gap-2 pt-6 pb-2 text-center">
                          <span className="text-3xl leading-none">
                            <img
                              src={svc.logoUrl}
                              alt={`${svc.name} logo`}
                              className="h-6 w-6 object-contain"
                            />
                          </span>
                          <span
                            className={`mt-1 px-1 text-xs leading-tight font-bold ${isSelected ? 'text-accent' : 'text-fg'}`}
                          >
                            {svc.name}
                          </span>
                        </div>

                        {/* Hardware Metrics Footer */}
                        <div className="border-default text-fg-dim mt-auto flex w-full justify-center border-t pt-2 pb-1 font-mono text-[10px]">
                          {isExpert ? (
                            <div className="flex w-full items-center justify-center gap-3">
                              <span className="flex items-center gap-1">
                                <span className="text-xs">CPU</span>
                                {svc.minCPU === svc.recommendedCPU
                                  ? svc.recommendedCPU
                                  : `${svc.minCPU}-${svc.recommendedCPU}`}
                                c
                              </span>
                              <span className="opacity-50">|</span>
                              <span className="flex items-center gap-1">
                                <span className="text-xs">RAM</span>
                                {svc.minRAM === svc.recommendedRAM
                                  ? svc.recommendedRAM
                                  : `${svc.minRAM}-${svc.recommendedRAM}`}
                                G
                              </span>
                            </div>
                          ) : (
                            <div className="flex w-full justify-center gap-2">
                              <span>
                                {((svc.minCPU / host.cpuCores) * 100).toFixed(
                                  0,
                                )}
                                %C
                              </span>
                              <span>|</span>
                              <span>
                                {(
                                  (svc.minRAM / host.memoryRamGb) *
                                  100
                                ).toFixed(0)}
                                %R
                              </span>
                            </div>
                          )}
                        </div>

                        {isLocalOnly && (
                          <div className="absolute right-1 bottom-1 text-[8px] font-bold text-yellow-500 uppercase">
                            ⚠ Local
                          </div>
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
