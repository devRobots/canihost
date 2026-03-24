import { Service } from '@prisma/client';
import { Cpu, MemoryStick } from 'lucide-react';

import { getServiceIcon } from '@/lib/icons';

interface Props {
  service: Service;
  isExpert: boolean;
  onServiceClick: (service: Service) => void;
}

export default function IndividualAppCard({ service, isExpert, onServiceClick }: Props) {
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
      {isExpert && (
        <div className="flex justify-center mt-auto pt-2 text-[10px] font-mono w-full border-t border-default text-fg-dim">
          <div className="flex gap-3 w-full justify-center items-center">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Cpu size={12} />
              {service.minCPU === service.recommendedCPU ? service.recommendedCPU : `${service.minCPU}`} cores
            </span>
            <span className="opacity-50">|</span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <MemoryStick size={12} />
              {service.minRAM === service.recommendedRAM ? service.recommendedRAM : `${service.minRAM}`} GB
            </span>
          </div>
        </div>
      )}
    </button>
  );
}
