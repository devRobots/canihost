import { App } from '@prisma/client';

import IndividualAppCard from '@/components/IndividualAppCard';

interface Props {
  apps: App[];
  isExpert: boolean;
  onAppClick: (app: App) => void;
}

export default function RecommendedAppsPanel({
  apps,
  isExpert,
  onAppClick,
}: Props) {
  if (apps.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="text-fg-muted flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
        <span className="text-accent">{'//'}</span>
        Recommended Apps
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {apps.map((app) => (
          <IndividualAppCard
            key={app.id}
            app={app}
            isExpert={isExpert}
            onAppClick={onAppClick}
          />
        ))}
      </div>
    </div>
  );
}
