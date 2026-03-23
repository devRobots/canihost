'use client';

import { useState } from 'react';
import { getServiceIcon } from '@/lib/icons';
import MachinePicker from '@/components/MachinePicker';

type Machine = { id: string, name: string, type: string, brand: string | null, cpuCores: number, memoryRamGb: number };
type Service = { id: string, name: string, category: string, cpuCost: number, ramCostGb: number, isCloudRecommended: boolean, description: string | null };

export default function ServerBuilder({ machine, allServices }: { machine: Machine, allServices: Service[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleService = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectedServices = allServices.filter(s => selectedIds.has(s.id));
  const totalCpu = selectedServices.reduce((acc, s) => acc + s.cpuCost, 0);
  const totalRam = selectedServices.reduce((acc, s) => acc + s.ramCostGb, 0);

  const cpuPct = Math.min(Math.round((totalCpu / machine.cpuCores) * 100), 999);
  const ramPct = Math.min(Math.round((totalRam / machine.memoryRamGb) * 100), 999);

  const isCpuOver = totalCpu > machine.cpuCores;
  const isRamOver = totalRam > machine.memoryRamGb;
  const cloudWarnings = selectedServices.filter(s => !s.isCloudRecommended && machine.type === 'VPS');

  const categories = Array.from(new Set(allServices.map(s => s.category))).sort();

  const style = (obj: Record<string, string>) => obj;

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
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: 'var(--accent)' }}>▶</span>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>{machine.name}</span>
            <span className="tag">{machine.type === 'VPS' ? 'Cloud VPS' : 'Mini PC'}</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
            {machine.cpuCores} cores · {machine.memoryRamGb} GB RAM — Select services below
          </p>
        </div>

        {/* Categories */}
        {categories.map(cat => (
          <div key={cat}>
            <div
              className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
              style={{ color: 'var(--fg-muted)' }}
            >
              <span style={{ color: 'var(--accent)' }}>▸</span>
              {cat}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
              {allServices.filter(s => s.category === cat).map(svc => {
                const isSelected = selectedIds.has(svc.id);
                const isLocalOnly = !svc.isCloudRecommended && machine.type === 'VPS';
                const icon = getServiceIcon(svc.name);

                return (
                  <button
                    key={svc.id}
                    onClick={() => toggleService(svc.id)}
                    className="text-left p-3 rounded flex items-start gap-3 transition-all active:scale-[0.98] cursor-pointer"
                    style={{
                      background: isSelected ? 'var(--accent-glow)' : 'var(--bg-card)',
                      border: `1px solid ${isSelected ? 'var(--accent)' : isLocalOnly ? 'var(--yellow)' : 'var(--border)'}`,
                      boxShadow: isSelected ? '0 0 10px var(--accent-glow)' : 'none',
                      opacity: isLocalOnly && !isSelected ? 0.7 : 1,
                    }}
                  >
                    <span className="text-xl leading-none mt-0.5 shrink-0">{icon}</span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="font-bold text-xs"
                          style={{ color: isSelected ? 'var(--accent)' : 'var(--fg)' }}
                        >
                          {svc.name}
                        </span>
                        {isSelected && (
                          <span className="text-xs" style={{ color: 'var(--accent)' }}>✓</span>
                        )}
                        {isLocalOnly && (
                          <span className="text-xs" style={{ color: 'var(--yellow)' }}>⚠ local only</span>
                        )}
                      </div>
                      <p
                        className="text-xs line-clamp-2"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        {svc.description}
                      </p>
                      <div className="flex gap-2 text-xs mt-1" style={{ color: 'var(--fg-dim)' }}>
                        <span>cpu: {svc.cpuCost}c</span>
                        <span>ram: {svc.ramCostGb}GB</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ─── RIGHT: Gauge Panel ─── */}
      <div
        className="w-full lg:w-80 flex flex-col gap-5 p-6 sticky bottom-0 lg:top-14 lg:h-[calc(100vh-56px)] overflow-y-auto z-10"
        style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}
      >
        <div
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--fg-muted)' }}
        >
          <span style={{ color: 'var(--accent)' }}>// </span>
          Resource Monitor
        </div>

        {/* CPU Gauge */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs" style={{ color: 'var(--fg-dim)' }}>
            <span>CPU Cores</span>
            <span style={{ color: isCpuOver ? 'var(--red)' : 'var(--fg)' }}>
              {totalCpu} / {machine.cpuCores} ({cpuPct}%)
            </span>
          </div>
          <div className="bar-track">
            <div
              className={`bar-fill ${isCpuOver ? 'danger' : cpuPct > 70 ? 'warn' : ''}`}
              style={{ width: `${Math.min(cpuPct, 100)}%` }}
            />
          </div>
        </div>

        {/* RAM Gauge */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs" style={{ color: 'var(--fg-dim)' }}>
            <span>Memory RAM</span>
            <span style={{ color: isRamOver ? 'var(--red)' : 'var(--fg)' }}>
              {totalRam}GB / {machine.memoryRamGb}GB ({ramPct}%)
            </span>
          </div>
          <div className="bar-track">
            <div
              className={`bar-fill ${isRamOver ? 'danger' : ramPct > 70 ? 'warn' : ''}`}
              style={{ width: `${Math.min(ramPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Warnings */}
        {(isCpuOver || isRamOver || cloudWarnings.length > 0) && (
          <div className="flex flex-col gap-2 pt-1">
            {isCpuOver && (
              <div
                className="text-xs p-3 rounded"
                style={{ background: 'color-mix(in srgb, var(--red) 10%, transparent)', border: '1px solid var(--red)', color: 'var(--red)' }}
              >
                🚨 CPU limit exceeded
              </div>
            )}
            {isRamOver && (
              <div
                className="text-xs p-3 rounded"
                style={{ background: 'color-mix(in srgb, var(--red) 10%, transparent)', border: '1px solid var(--red)', color: 'var(--red)' }}
              >
                🚨 RAM limit exceeded
              </div>
            )}
            {cloudWarnings.length > 0 && (
              <div
                className="text-xs p-3 rounded"
                style={{ background: 'color-mix(in srgb, var(--yellow) 10%, transparent)', border: '1px solid var(--yellow)', color: 'var(--yellow)' }}
              >
                ⚠ Cloud warning: {cloudWarnings.map(s => s.name).join(', ')} not suited for VPS
              </div>
            )}
          </div>
        )}

        {/* Selected list */}
        <div className="flex-1 flex flex-col gap-2">
          <div
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--fg-muted)' }}
          >
            <span style={{ color: 'var(--accent)' }}>// </span>
            Stack ({selectedServices.length})
          </div>
          {selectedServices.length === 0 ? (
            <p className="text-xs prompt" style={{ color: 'var(--fg-dim)' }}>
              no services selected
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {selectedServices.map(s => (
                <li
                  key={s.id}
                  className="flex items-center justify-between text-xs py-1.5"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{getServiceIcon(s.name)}</span>
                    <span style={{ color: 'var(--fg)' }}>{s.name}</span>
                  </span>
                  <button
                    onClick={() => toggleService(s.id)}
                    className="text-xs transition-colors"
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
    </div>
  );
}
