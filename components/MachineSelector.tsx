'use client';

import { useRouter } from "@/i18n/routing";
import { useState } from "react";

type Machine = {
  id: string;
  name: string;
  type: string;
  brand: string | null;
  cpuCores: number;
  memoryRamGb: number;
};

export default function MachineSelector({ machines }: { machines: Machine[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  const handleProceed = () => {
    if (selected) {
      router.push(`/recommendations?machineId=${selected}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full text-left">
      <select 
        className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none cursor-pointer"
        value={selected}
        onChange={handleSelect}
      >
        <option value="" disabled>-- Elige tu Dispositivo --</option>
        {machines.map(m => (
          <option key={m.id} value={m.id}>
            {m.type === 'VPS' ? '☁️' : '💻'} {m.name} - {m.cpuCores} Cores / {m.memoryRamGb}GB RAM
          </option>
        ))}
      </select>
      
      <button 
        onClick={handleProceed}
        disabled={!selected}
        className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 flex justify-center items-center gap-2"
      >
        Continuar 🚀
      </button>
    </div>
  );
}
