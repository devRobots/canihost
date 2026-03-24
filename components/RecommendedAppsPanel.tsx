import { Service } from '@prisma/client';

import IndividualAppCard from '@/components/IndividualAppCard';

interface Props {
  apps: Service[];
  isExpert: boolean;
  onServiceClick: (service: Service) => void;
}

export default function RecommendedAppsPanel({
  apps,
  isExpert,
  onServiceClick,
}: Props) {
  if (apps.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="text-fg-muted flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
        <span className="text-accent">{'//'}</span>
        Recommended Apps
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {apps.map((svc) => (
          <IndividualAppCard
            key={svc.id}
            service={svc}
            isExpert={isExpert}
            onServiceClick={onServiceClick}
          />
        ))}
      </div>
    </div>
  );
}
