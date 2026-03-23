'use client';

import { useState } from 'react';
import MachinePicker from '@/components/MachinePicker';
import { getServiceIcon } from '@/lib/icons';
import { useMode } from './ModeContext';

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

export default function HomeClient({ machines, allSets, t }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { mode } = useMode();
  const isExpert = mode === 'expert';

  const machine = selectedId ? machines.find(m => m.id === selectedId) ?? null : null;

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
      })
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
        <div className="container mx-auto px-4 sm:px-8 py-10">
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
      </header>

      {/* ─── BODY ─── */}
      <div className="container mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">

        {/* SECTION: Machine Selector */}
        <section className="flex flex-col gap-4">
          <div
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--fg-muted)' }}
          >
            <span style={{ color: 'var(--accent)' }}>//</span>
            {t.selectMachine}
          </div>

          <MachinePicker
            machines={machines}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>

        {/* SECTION: Recommendations (appears once machine is selected) */}
        {machine && (
          <section className="flex flex-col gap-6">
            {/* Machine Summary Bar */}
            <div
              className="p-4 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--accent)',
                boxShadow: '0 0 20px var(--accent-glow)',
              }}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span style={{ color: 'var(--accent)' }}>▶</span>
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>
                    {machine.name}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: 'var(--bg-input)', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}
                  >
                    {machine.type === 'VPS' ? 'Cloud VPS' : 'Mini PC'}
                  </span>
                </div>
                {isExpert && (
                  <div className="flex gap-4 text-xs" style={{ color: 'var(--fg-muted)' }}>
                    <span>CPU: <strong style={{ color: 'var(--fg)' }}>{machine.cpuCores} cores</strong></span>
                    <span>RAM: <strong style={{ color: 'var(--fg)' }}>{machine.memoryRamGb} GB</strong></span>
                  </div>
                )}
              </div>
              <a
                href={`/builder?machineId=${machine.id}`}
                className="text-xs font-bold px-4 py-2 rounded transition-all"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                ⚡ {t.builder}
              </a>
            </div>

            {/* Section header */}
            <div
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--fg-muted)' }}
            >
              <span style={{ color: 'var(--accent)' }}>//</span>
              {t.recommendations}
            </div>

            {/* AppSets Grid */}
            {recommendedSets.length === 0 ? (
              <div
                className="py-12 text-center rounded text-sm"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg-muted)',
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
                  const cpuClass = cpuPct > 85 ? 'danger' : cpuPct > 60 ? 'warn' : '';
                  const ramClass = ramPct > 85 ? 'danger' : ramPct > 60 ? 'warn' : '';

                  return (
                    <div key={set.id} className="card flex flex-col gap-4 p-5 rounded">
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ color: 'var(--accent)' }}>◈</span>
                          <h4 className="font-bold text-sm" style={{ color: 'var(--fg)' }}>
                            {set.name}
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                          {set.description}
                        </p>
                      </div>

                      {/* CPU bar - expert only */}
                      {isExpert && (
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs" style={{ color: 'var(--fg-dim)' }}>
                            <span>CPU</span>
                            <span style={{ color: cpuClass === 'danger' ? 'var(--red)' : cpuClass === 'warn' ? 'var(--yellow)' : 'var(--fg-muted)' }}>
                              {totalCpu}c / {machine.cpuCores}c ({cpuPct}%)
                            </span>
                          </div>
                          <div className="bar-track">
                            <div className={`bar-fill ${cpuClass}`} style={{ width: `${cpuPct}%` }} />
                          </div>
                        </div>
                      )}

                      {/* RAM bar - expert only */}
                      {isExpert && (
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs" style={{ color: 'var(--fg-dim)' }}>
                            <span>RAM</span>
                            <span style={{ color: ramClass === 'danger' ? 'var(--red)' : ramClass === 'warn' ? 'var(--yellow)' : 'var(--fg-muted)' }}>
                              {totalRam}GB / {machine.memoryRamGb}GB ({ramPct}%)
                            </span>
                          </div>
                          <div className="bar-track">
                            <div className={`bar-fill ${ramClass}`} style={{ width: `${ramPct}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Services list */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {set.services.map((s) => (
                          <span
                            key={s.id}
                            className="tag flex items-center gap-1"
                            title={s.description ?? s.name}
                          >
                            {getServiceIcon(s.name)} {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Placeholder when no machine selected */}
        {!machine && (
          <div
            className="text-center py-16 text-sm"
            style={{ color: 'var(--fg-dim)' }}
          >
            <div className="text-4xl mb-4">_</div>
            <span className="prompt">Select a machine above to see recommendations</span>
          </div>
        )}
      </div>
    </div>
  );
}
