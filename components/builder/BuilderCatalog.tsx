'use client';

import { App } from '@prisma/client';
import { HostType } from '@prisma/enums';
import { useState } from 'react';

import { ResourceSpecs } from '@/components/apps/ResourceSpecs';
import HostPicker from '@/components/hostpicker/HostPicker';
import { useBuilderStore } from '@/store/builder';
import { useDbStore } from '@/store/db';
import { useModeStore } from '@/store/mode';
import { type ActiveHost } from '@/types';

type Props = {
  host: ActiveHost;
  setAppModalData: (s: App | null) => void;
};

export default function BuilderCatalog({ host, setAppModalData }: Props) {
  const { apps } = useDbStore();
  const { selectedAppIds, toggleAppId } = useBuilderStore();
  const { mode } = useModeStore();

  const isExpert = mode === 'expert';

  const selectedApps = apps.filter((a) => selectedAppIds.has(a.id));
  const totalCpu = selectedApps.reduce((acc, a) => acc + a.minCPU, 0);
  const totalRam = selectedApps.reduce((acc, a) => acc + a.minRAM, 0);
  const isSystemOverloaded = totalCpu > host.cores || totalRam > host.ram;

  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});
  const categories = Array.from(new Set(apps.map((s) => s.category))).sort();

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
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
                  .filter((s) => !(host.type === HostType.VPS && !s.isCloudRecommended))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((svc) => {
                    const isSelected = selectedAppIds.has(svc.id);
                    const isDisabled = !isSelected && isSystemOverloaded;                    return (
                      <button
                        key={svc.id}
                        disabled={isDisabled}
                        onClick={() => toggleAppId(svc.id)}
                        className={`card relative flex h-full w-full flex-col px-3 pt-3 pb-2 transition-all ${
                          isDisabled
                            ? 'opacity-50 cursor-not-allowed grayscale'
                            : 'cursor-pointer hover:border-accent active:scale-[0.98]'
                        } ${
                          isSelected
                            ? 'bg-accent/10 border-accent shadow-accent/20 shadow-lg'
                            : 'border-default'
                        }`}
                      >
                        {/* Info Button Top Left */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setAppModalData(svc);
                          }}
                          className="btn-terminal bg-input absolute top-2 left-2 z-10 flex h-6 w-6 items-center justify-center text-[10px] font-bold transition-all hover:bg-white/10"
                          title="Info"
                        >
                          i
                        </div>

                        {/* Selection Checkmark */}
                        {isSelected && (
                          <div
                            className={`absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded transition-all bg-accent text-(--bg)`}
                          >
                            <span className="mt-0.5 text-sm font-bold">✓</span>
                          </div>
                        )}

                        <div className="flex flex-1 flex-col items-center gap-2 pt-6 pb-4 text-center">
                          <img
                            src={svc.logoUrl}
                            alt={`${svc.name} logo`}
                            className="h-12 w-12 object-contain"
                          />
                          <span
                            className={`mt-1 px-1 text-xs leading-tight font-bold ${isSelected ? 'text-accent' : 'text-fg'}`}
                          >
                            {svc.name}
                          </span>
                        </div>

                        {/* Hardware Metrics Footer */}
                        {isExpert && (
                          <div className="mt-auto flex w-full flex-col gap-1.5">
                            <ResourceSpecs
                              cpu={svc.recommendedCPU}
                              ram={svc.recommendedRAM}
                              title="Recommended"
                            />
                            {(svc.minCPU !== svc.recommendedCPU ||
                              svc.minRAM !== svc.recommendedRAM) && (
                              <ResourceSpecs
                                cpu={svc.minCPU}
                                ram={svc.minRAM}
                                title="Minimum"
                              />
                            )}
                          </div>
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
  );
}
