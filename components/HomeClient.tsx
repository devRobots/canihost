'use client';

import * as React from 'react';
import MachinePicker from '@/components/MachinePicker';
import { getServiceIcon } from '@/lib/icons';
import { useAppStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ServiceModal from './ServiceModal';
import AppSetModal from './AppSetModal';

type Machine = {
  id: string;
  name: string;
  type: string;
  brand: string | null;
  cpuCores: number;
  memoryRamGb: number;
};

type Service = {
  id: string;
  name: string;
  category: string;
  cpuCost: number;
  ramCostGb: number;
  isCloudRecommended: boolean;
  description: string | null;
  minRequirements: string | null;
  recRequirements: string | null;
};

type AppSet = {
  id: string;
  name: string;
  description: string | null;
  services: Service[];
};

type Props = {
  machines: Machine[];
  allSets: AppSet[];
  allServices: Service[];
  t: {
    title: string;
    subtitle: string;
    selectMachine: string;
    recommendations: string;
    builder: string;
    noRecommendations: string;
    cpuLabel: string;
    ramLabel: string;
    cloudWarning: string;
  };
};

export default function HomeClient({ machines, allSets, allServices, t }: Props) {
  const { selectedMachineId, mode, setSelectedMachineId } = useAppStore();
  const tSet = useTranslations('AppSets');
  const [serviceModalData, setServiceModalData] = React.useState<Service | null>(null);
  const [appSetModalData, setAppSetModalData] = React.useState<AppSet | null>(null);
  const isExpert = mode === 'expert';

  React.useEffect(() => {
    if (!selectedMachineId) {
      const topVps = machines.find((m) => m.name === 'CubePath VPS Enterprise');
      if (topVps) {
        setSelectedMachineId(topVps.id);
      }
    }
  }, [selectedMachineId, machines, setSelectedMachineId]);

  const machine = selectedMachineId
    ? machines.find(m => m.id === selectedMachineId) ?? null
    : null;

  const recommendedSets = machine
    ? allSets.filter((set) => {
        let totalCpu = 0;
        let totalRam = 0;
        let cloudSafe = true;
        for (const svc of set.services) {
          totalCpu += svc.cpuCost;
          totalRam += svc.ramCostGb;
          if (!svc.isCloudRecommended && machine.type === 'VPS') cloudSafe = false;
        }
        return totalCpu <= machine.cpuCores && totalRam <= machine.memoryRamGb * 0.9 && cloudSafe;
      }).slice(0, 3)
    : [];

  const recommendedApps = machine
    ? allServices.filter(svc => 
        svc.cpuCost <= machine.cpuCores && 
        svc.ramCostGb <= machine.memoryRamGb * 0.8 &&
        !(svc.isCloudRecommended === false && machine.type === 'VPS')
      ).slice(0, 6)
    : [];

  return (
    <div
      className="flex flex-col min-h-[calc(100vh-56px)]"
      style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg)' }}
    >
      {/* ─── HERO ─── */}
      <header
        className="w-full border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
      >
        <div className="container mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div
              className="text-xs uppercase tracking-widest mb-3 prompt"
              style={{ color: 'var(--fg-muted)' }}
            >
              v1.0.0 — self-hosting compatibility checker
            </div>
            <h1
              className="text-3xl sm:text-5xl font-black tracking-tight glow-text mb-3"
              style={{ color: 'var(--fg)' }}
            >
              Can<span style={{ color: 'var(--accent)' }}>I</span>Host
              <span style={{ color: 'var(--fg-muted)' }}>.tech</span>
            </h1>
            <p className="text-sm max-w-xl" style={{ color: 'var(--fg-muted)' }}>
              {t.subtitle}
            </p>
          </div>
          <div>
            <Link
              href="/builder"
              className="inline-block text-xs font-bold px-6 py-4 transition-all hover:bg-white/5 active:scale-95 cursor-pointer shadow-lg"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                textDecoration: 'none',
                borderRadius: 4,
              }}
            >
              ⚡ {t.builder}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="container mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">

        {/* SECTION: Machine Selector */}
        <section className="flex flex-col gap-4">
          <div
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--fg-muted)' }}
          >
            <span style={{ color: 'var(--accent)' }}>{'//'}</span>
            {t.selectMachine}
          </div>

          <MachinePicker 
            machines={machines} 
            onSelect={() => {
              setTimeout(() => document.getElementById('recommendations-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
            }} 
          />
        </section>

        {/* SECTION: Recommendations */}
        {machine && (
          <section id="recommendations-section" className="flex flex-col gap-6">

            {/* Section header */}
            <div
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--fg-muted)' }}
            >
              <span style={{ color: 'var(--accent)' }}>{'//'}</span>
              {t.recommendations}
            </div>

            {/* AppSets Grid */}
            {recommendedSets.length === 0 ? (
              <div
                className="py-12 text-center text-sm"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg-muted)',
                  borderRadius: 4,
                }}
              >
                <div className="text-3xl mb-4">⚠</div>
                {t.noRecommendations}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {recommendedSets.map((set) => {
                  const totalCpu = set.services.reduce((acc, s) => acc + s.cpuCost, 0);
                  const totalRam = set.services.reduce((acc, s) => acc + s.ramCostGb, 0);
                  const cpuPct = Math.min(Math.round((totalCpu / machine.cpuCores) * 100), 100);
                  const ramPct = Math.min(Math.round((totalRam / machine.memoryRamGb) * 100), 100);
                  let cpuClass: 'danger' | 'warn' | '' = '';
                  if (cpuPct > 85) cpuClass = 'danger';
                  else if (cpuPct > 60) cpuClass = 'warn';

                  let ramClass: 'danger' | 'warn' | '' = '';
                  if (ramPct > 85) ramClass = 'danger';
                  else if (ramPct > 60) ramClass = 'warn';

                  const classColorMap = { danger: 'var(--red)', warn: 'var(--yellow)', '': 'var(--fg-muted)' };
                  const cpuColor = classColorMap[cpuClass];
                  const ramColor = classColorMap[ramClass];

                  return (
                    <div key={set.id} className="card flex flex-col gap-4 p-5" style={{ borderRadius: 4 }}>
                      {/* Card Header & Button */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ color: 'var(--accent)' }}>◈</span>
                            <h4 className="font-bold text-sm" style={{ color: 'var(--fg)' }}>
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {tSet(set.name as any) || set.name}
                            </h4>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {tSet(set.description as any) || set.description}
                          </p>
                        </div>
                        <button
                          onClick={() => setAppSetModalData(set)}
                          className="w-6 h-6 shrink-0 flex items-center justify-center text-[10px] font-bold transition-all hover:bg-white/10 ml-2"
                          style={{ 
                            background: 'var(--bg-input)', 
                            border: '1px solid var(--accent)', 
                            color: 'var(--accent)', 
                            borderRadius: 4 
                          }}
                          title="View Set Details"
                        >
                          i
                        </button>
                      </div>

                      {/* CPU bar — expert only */}
                      {isExpert && (
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs" style={{ color: 'var(--fg-dim)' }}>
                            <span>CPU</span>
                            <span style={{ color: cpuColor }}>
                              {totalCpu}c / {machine.cpuCores}c ({cpuPct}%)
                            </span>
                          </div>
                          <div className="bar-track">
                            <div className={`bar-fill ${cpuClass}`} style={{ width: `${cpuPct}%` }} />
                          </div>
                        </div>
                      )}

                      {/* RAM bar — expert only */}
                      {isExpert && (
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs" style={{ color: 'var(--fg-dim)' }}>
                            <span>RAM</span>
                            <span style={{ color: ramColor }}>
                              {totalRam}GB / {machine.memoryRamGb}GB ({ramPct}%)
                            </span>
                          </div>
                          <div className="bar-track">
                            <div className={`bar-fill ${ramClass}`} style={{ width: `${ramPct}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Services tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {set.services.map((s) => (
                          <button 
                            key={s.id} 
                            onClick={() => setServiceModalData(s)} 
                            className="tag flex items-center gap-1 transition-all hover:brightness-125 active:scale-95 cursor-pointer" 
                            title={s.name}
                          >
                            {getServiceIcon(s.name)} {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Individual Apps header */}
            <div
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest mt-6"
              style={{ color: 'var(--fg-muted)' }}
            >
              <span style={{ color: 'var(--accent)' }}>{'//'}</span>
              Top Individual Apps
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {recommendedApps.map(svc => (
                 <button
                   key={svc.id}
                   onClick={() => setServiceModalData(svc)}
                   className="relative flex flex-col pt-3 pb-2 px-3 transition-all active:scale-[0.98] cursor-pointer hover:brightness-110"
                   style={{
                     background: 'var(--bg-card)',
                     border: '1px solid var(--border)',
                     borderRadius: 6,
                   }}
                 >
                   {/* Info Button Top Left */}
                   <div
                     className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center text-[10px] font-bold transition-all"
                     style={{ 
                       background: 'var(--bg-input)', 
                       border: '1px solid var(--border)', 
                       color: 'var(--fg)', 
                       borderRadius: 4 
                     }}
                   >
                     i
                   </div>
                   
                   <div className="flex flex-col items-center gap-2 text-center flex-1 pt-4 pb-1">
                     <span className="text-3xl leading-none">{getServiceIcon(svc.name)}</span>
                     <span className="font-bold text-xs mt-1 leading-tight px-1" style={{ color: 'var(--fg)' }}>
                       {svc.name}
                     </span>
                   </div>
                   <div className="flex justify-center mt-auto pt-2 text-[10px] font-mono w-full" style={{ borderTop: '1px solid var(--border)', color: 'var(--fg-dim)' }}>
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

          </section>
        )}

        {/* Placeholder when nothing selected */}
        {!machine && (
          <div className="text-center py-16 text-sm" style={{ color: 'var(--fg-dim)' }}>
            <div className="text-4xl mb-4">_</div>
            <span className="prompt">Select a machine above to see recommendations</span>
          </div>
        )}
      </div>
      <ServiceModal service={serviceModalData} onClose={() => setServiceModalData(null)} />
      <AppSetModal set={appSetModalData} onClose={() => setAppSetModalData(null)} />
    </div>
  );
}
