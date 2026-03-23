'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { getServiceIcon } from '@/lib/icons';
import ServiceModal from './ServiceModal';
import AppSetModal from './AppSetModal';
import { type Service, type AppSet } from '@/types';

type Props = {
  t: {
    recommendations: string;
    noRecommendations: string;
    cpuLabel: string;
    ramLabel: string;
  };
};

export default function RecommendationsPanel({ t }: Props) {
  const { machines, allSets, allServices, selectedMachineId, mode } = useAppStore();
  const tSet = useTranslations('AppSets');
  const [serviceModalData, setServiceModalData] = React.useState<Service | null>(null);
  const [appSetModalData, setAppSetModalData] = React.useState<AppSet | null>(null);

  const isExpert = mode === 'expert';
  const machine = selectedMachineId ? machines.find(m => m.id === selectedMachineId) ?? null : null;

  if (!machine) return null;

  const maxSets = 3;
  const recommendedSets = allSets.filter((set) => {
    let totalCpu = 0;
    let totalRam = 0;
    let cloudSafe = true;
    for (const svc of set.services) {
      totalCpu += svc.cpuCost;
      totalRam += svc.ramCostGb;
      if (!svc.isCloudRecommended && machine.type === 'VPS') cloudSafe = false;
    }
    return totalCpu <= machine.cpuCores && totalRam <= machine.memoryRamGb * 0.9 && cloudSafe;
  }).slice(0, maxSets);

  const maxIndividualApps = 6;
  const recommendedApps = allServices.filter(svc => 
    svc.cpuCost <= machine.cpuCores && 
    svc.ramCostGb <= machine.memoryRamGb * 0.8 &&
    !(svc.isCloudRecommended === false && machine.type === 'VPS')
  ).slice(0, maxIndividualApps);

  return (
    <section id="recommendations-section" className="flex flex-col gap-6">
      {/* Target Audience / Use Case info if any */}

      {/* Section header */}
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-fg-muted">
         <span className="text-accent">{'//'}</span>
         {t.recommendations}
      </div>

      {/* AppSets Grid */}
      {recommendedSets.length === 0 ? (
        <div className="py-12 text-center text-sm card text-fg-muted">
          <div className="text-3xl mb-4">⚠</div>
          {t.noRecommendations}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedSets.map((set) => {
            const totalCpu = set.services.reduce((acc, s) => acc + s.cpuCost, 0);
            const totalRam = set.services.reduce((acc, s) => acc + s.ramCostGb, 0);
            const cpuPct = Math.min(Math.round((totalCpu / machine.cpuCores) * 100), 999);
            const ramPct = Math.min(Math.round((totalRam / machine.memoryRamGb) * 100), 999);
            const cpuClass = cpuPct > 70 ? 'warn' : 'accent';
            const ramClass = ramPct > 70 ? 'warn' : 'accent';

            return (
              <div key={set.id} className="card flex flex-col gap-4 p-5 rounded">
                {/* Card Header & Button */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-accent">◈</span>
                      <h4 className="font-bold text-sm text-fg">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {tSet(set.name as any) || set.name}
                      </h4>
                    </div>
                    <p className="text-xs leading-relaxed text-fg-muted">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {tSet(set.description as any) || set.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setAppSetModalData(set)}
                    className="w-6 h-6 shrink-0 flex items-center justify-center text-[10px] font-bold transition-all btn-terminal ml-2"
                    title="View Set Details"
                  >
                    i
                  </button>
                </div>

                {/* CPU bar — expert only */}
                {isExpert && (
                  <div className="flex flex-col gap-1 mt-auto">
                    <div className="flex justify-between text-xs text-fg-dim">
                      <span className={`text-${cpuClass}`}>CPU</span>
                      <span>{totalCpu}c / {machine.cpuCores}c</span>
                    </div>
                    <div className="h-1 bg-input rounded overflow-hidden flex">
                      <div className={`bar-fill ${cpuClass}`} style={{ width: `${cpuPct}%` }} />
                    </div>
                  </div>
                )}

                {/* RAM bar — expert only */}
                {isExpert && (
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-fg-dim">
                      <span className={`text-${ramClass}`}>RAM</span>
                      <span>{totalRam}GB / {machine.memoryRamGb}GB</span>
                    </div>
                    <div className="h-1 bg-input rounded overflow-hidden flex">
                      <div className={`bar-fill ${ramClass}`} style={{ width: `${ramPct}%` }} />
                    </div>
                  </div>
                )}

                {/* Services list */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {set.services.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => setServiceModalData(svc)}
                      className="tag flex items-center gap-1 transition-all hover:bg-white/10 active:scale-[0.98] cursor-pointer"
                    >
                      {getServiceIcon(svc.name)} {svc.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Individual Apps header */}
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest mt-6 text-fg-muted">
        <span className="text-accent">{'//'}</span>
        Top Individual Apps
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {recommendedApps.map(svc => (
           <button
             key={svc.id}
             onClick={() => setServiceModalData(svc)}
             className="card relative flex flex-col pt-3 pb-2 px-3 transition-all active:scale-[0.98] cursor-pointer"
           >
             {/* Info Button Top Left */}
             <div className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center text-[10px] font-bold badge-info">
               i
             </div>
             
             <div className="flex flex-col items-center gap-2 text-center flex-1 pt-4 pb-1">
               <span className="text-3xl leading-none">{getServiceIcon(svc.name)}</span>
               <span className="font-bold text-xs mt-1 leading-tight px-1 text-fg">
                 {svc.name}
               </span>
             </div>
             <div className="flex justify-center mt-auto pt-2 text-[10px] font-mono w-full border-t border-default text-fg-dim">
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
           </button>
        ))}
      </div>

      <ServiceModal service={serviceModalData} onClose={() => setServiceModalData(null)} />
      <AppSetModal set={appSetModalData} onClose={() => setAppSetModalData(null)} />
    </section>
  );
}
