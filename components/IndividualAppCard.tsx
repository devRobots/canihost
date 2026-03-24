import { getServiceIcon } from '@/lib/icons';
import { type Service, type ActiveMachine } from '@/types';
import { Cpu, MemoryStick } from 'lucide-react';

interface Props {
  service: Service;
  machine: ActiveMachine;
  isExpert: boolean;
  onServiceClick: (service: Service) => void;
}

export default function IndividualAppCard({ service, machine, isExpert, onServiceClick }: Props) {
  const cpuPct = (service.recommendedCPU / machine.cpuCores) * 100;
  const ramPct = (service.recommendedRAM / machine.memoryRamGb) * 100;

  return (
    <button
      onClick={() => onServiceClick(service)}
      className="card relative flex flex-col pt-3 pb-2 px-3 transition-all active:scale-[0.98] cursor-pointer hover:border-accent w-full h-full"
    >
      {/* Info Button Top Left */}
      <div className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center text-[10px] font-bold badge-info">
        i
      </div>
      
      <div className="flex flex-col items-center gap-2 text-center flex-1 pt-4 pb-4">
        <span className="text-3xl leading-none">{getServiceIcon(service.name)}</span>
        <span className="font-bold text-xs mt-1 leading-tight px-1 text-fg">
          {service.name}
        </span>
      </div>
      
      <div className="flex justify-center mt-auto pt-2 text-[10px] font-mono w-full border-t border-default text-fg-dim">
        {isExpert ? (
          <div className="flex gap-3 w-full justify-center items-center">
            <span className="flex items-center gap-1">
              <Cpu size={12} />
              {service.minCPU === service.recommendedCPU ? service.recommendedCPU : `${service.minCPU}-${service.recommendedCPU}`}c
            </span>
            <span className="opacity-50">|</span>
            <span className="flex items-center gap-1">
              <MemoryStick size={12} />
              {service.minRAM === service.recommendedRAM ? service.recommendedRAM : `${service.minRAM}-${service.recommendedRAM}`}G
            </span>
          </div>
        ) : (
          <div className="flex gap-2 w-full justify-center">
            <span>{Math.min(100, cpuPct).toFixed(0)}%C</span>
            <span>|</span>
            <span>{Math.min(100, ramPct).toFixed(0)}%R</span>
          </div>
        )}
      </div>
    </button>
  );
}
