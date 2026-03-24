import { type Service, type ActiveMachine } from '@/types';
import IndividualAppCard from '@/components/IndividualAppCard';

interface Props {
  apps: Service[];
  machine: ActiveMachine;
  isExpert: boolean;
  onServiceClick: (service: Service) => void;
}

export default function UnsupportedAppsPanel({ apps, machine, isExpert, onServiceClick }: Props) {
  if (apps.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-red-500">
        <span className="text-red-500">{'//'}</span>
        Not Supported Apps
      </div>
      <p className="text-xs text-fg-dim -mt-2">These apps require more resources than the current machine can provide or are incompatible with the environment.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {apps.map(svc => (
          <div key={svc.id} className="opacity-50 grayscale hover:grayscale-[50%] hover:opacity-80 transition-all w-full h-full cursor-not-allowed">
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
