import { getServiceIcon } from '@/lib/icons';
import { type Service, type Machine } from '@/types';

interface Props {
  service: Service;
  machine: Machine;
  isExpert: boolean;
  onServiceClick: (service: Service) => void;
}

export default function IndividualAppCard({ service, machine, isExpert, onServiceClick }: Props) {
  const cpuPct = (service.cpuCost / machine.cpuCores) * 100;
  const ramPct = (service.ramCostGb / machine.memoryRamGb) * 100;

  return (
    <button
      onClick={() => onServiceClick(service)}
      className="card relative flex flex-col pt-3 pb-2 px-3 transition-all active:scale-[0.98] cursor-pointer hover:border-accent w-full h-full"
    >
      {/* Info Button Top Left */}
      <div className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center text-[10px] font-bold badge-info">
        i
      </div>
      
      <div className="flex flex-col items-center gap-2 text-center flex-1 pt-4 pb-1">
        <span className="text-3xl leading-none">{getServiceIcon(service.name)}</span>
        <span className="font-bold text-xs mt-1 leading-tight px-1 text-fg">
          {service.name}
        </span>
      </div>
      <div className="flex justify-center mt-auto pt-2 text-[10px] font-mono w-full border-t border-default text-fg-dim">
        {isExpert ? (
          <div className="flex gap-2 w-full justify-center">
            <span>{service.cpuCost.toFixed(1)}c</span>
            <span>|</span>
            <span>{service.ramCostGb.toFixed(1)}G</span>
          </div>
        ) : (
          <div className="flex gap-2 w-full justify-center">
            <span>{cpuPct.toFixed(0)}%C</span>
            <span>|</span>
            <span>{ramPct.toFixed(0)}%R</span>
          </div>
        )}
      </div>
    </button>
  );
}
