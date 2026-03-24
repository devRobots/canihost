import { type Service, type Machine } from '@/types';
import IndividualAppCard from '@/components/IndividualAppCard';

interface Props {
  apps: Service[];
  machine: Machine;
  isExpert: boolean;
  onServiceClick: (service: Service) => void;
}

export default function BarelyUsableAppsPanel({ apps, machine, isExpert, onServiceClick }: Props) {
  if (apps.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-orange-400">
        <span className="text-orange-400">{'//'}</span>
        Barely Usable Apps
      </div>
      <p className="text-xs text-fg-dim -mt-2">These apps can run on the machine, but might encounter performance constraints or leave little room for other services.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {apps.map(svc => (
          <div key={svc.id} className="opacity-80 grayscale-[30%] hover:grayscale-0 hover:opacity-100 transition-all w-full h-full">
            <IndividualAppCard 
              service={svc} 
              machine={machine} 
              isExpert={isExpert} 
              onServiceClick={onServiceClick} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
