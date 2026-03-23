'use client';

import { useState } from 'react';

type Machine = { id: string, name: string, type: string, cpuCores: number, memoryRamGb: number };
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

  const cpuPercent = Math.round((totalCpu / machine.cpuCores) * 100);
  const ramPercent = Math.round((totalRam / machine.memoryRamGb) * 100);

  const isCpuExceeded = totalCpu > machine.cpuCores;
  const isRamExceeded = totalRam > machine.memoryRamGb;
  
  const cloudWarnings = selectedServices.filter(s => !s.isCloudRecommended && machine.type === 'VPS');

  const categories = Array.from(new Set(allServices.map(s => s.category)));

  return (
    <div className="flex flex-col md:flex-row w-full max-w-screen-2xl mx-auto p-4 md:p-8 gap-8 h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-4 pb-20 md:pb-0">
        <h2 className="text-3xl font-extrabold tracking-tight">Catálogo de Servicios</h2>
        <p className="text-zinc-400">Selecciona los servicios que deseas instalar en {machine.name}.</p>

        {categories.map(cat => (
          <div key={cat} className="flex flex-col gap-3">
            <h3 className="text-xl font-bold text-indigo-400 sticky top-0 bg-zinc-950/90 py-2 backdrop-blur-md z-10">{cat}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {allServices.filter(s => s.category === cat).map(svc => {
                const isSelected = selectedIds.has(svc.id);
                return (
                  <button 
                    key={svc.id}
                    onClick={() => toggleService(svc.id)}
                    className={`relative p-4 rounded-xl text-left transition-all border ${isSelected ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold">{svc.name}</h4>
                       {isSelected && <span className="text-indigo-400 ml-2">✓</span>}
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3 h-8">{svc.description}</p>
                    <div className="flex gap-2 text-xs font-semibold text-zinc-500">
                      <span className="bg-zinc-950 px-2 py-1 rounded">💻 {svc.cpuCost}c</span>
                      <span className="bg-zinc-950 px-2 py-1 rounded">📱 {svc.ramCostGb}GB</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full md:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl h-fit sticky bottom-4 md:top-24 max-h-[85vh] overflow-y-auto z-20">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{machine.name}</h3>
          <p className="text-zinc-400 text-sm mt-1">{machine.type === 'VPS' ? '☁️ Servidor Cloud (VPS)' : '🏠 Local Mini PC'}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-semibold">
               <span>CPU Cores</span>
               <span className={isCpuExceeded ? 'text-red-400' : 'text-zinc-300'}>{totalCpu} / {machine.cpuCores} ({cpuPercent}%)</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
               <div className={`h-full transition-all duration-300 ${isCpuExceeded ? 'bg-red-500' : 'bg-indigo-500'}`} style={{width: `${Math.min(cpuPercent, 100)}%`}}></div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-semibold">
               <span>Memoria RAM</span>
               <span className={isRamExceeded ? 'text-red-400' : 'text-zinc-300'}>{totalRam} / {machine.memoryRamGb}GB ({ramPercent}%)</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
               <div className={`h-full transition-all duration-300 ${isRamExceeded ? 'bg-red-500' : 'bg-purple-500'}`} style={{width: `${Math.min(ramPercent, 100)}%`}}></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {cloudWarnings.length > 0 && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm">
              ⚠️ <strong>Advertencia Cloud:</strong> Estás instalando {cloudWarnings.map(c=>c.name).join(', ')} en un VPS. Estos servicios están diseñados para hardware o redes locales.
            </div>
          )}
          {(isCpuExceeded || isRamExceeded) && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm">
              🚨 <strong>Recursos Excedidos:</strong> Tu servidor no tiene capacidad suficiente.
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Seleccionadas ({selectedServices.length})</h4>
          {selectedServices.length === 0 ? <p className="text-zinc-600 text-sm">No has seleccionado ningún servicio.</p> : (
            <ul className="flex flex-col gap-2">
              {selectedServices.map(s => (
                <li key={s.id} className="flex justify-between items-center text-sm border-b border-zinc-800/50 pb-2">
                  <span>{s.name}</span>
                  <button onClick={() => toggleService(s.id)} className="text-zinc-500 hover:text-red-400 p-1">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
