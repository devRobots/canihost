import { type Service, type ActiveMachine } from '@/types';
import IndividualAppCard from '@/components/IndividualAppCard';

interface Props {
  apps: Service[];
  machine: ActiveMachine;
  isExpert: boolean;
  onServiceClick: (service: Service) => void;
}

export default function RecommendedAppsPanel({ apps, machine, isExpert, onServiceClick }: Props) {
  if (apps.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-fg-muted">
        <span className="text-accent">{'//'}</span>
        Recommended Apps
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {apps.map(svc => (
          <IndividualAppCard 
            key={svc.id} 
            service={svc} 
            machine={machine} 
            isExpert={isExpert} 
            onServiceClick={onServiceClick} 
          />
        ))}
      </div>
    </div>
  );
}
