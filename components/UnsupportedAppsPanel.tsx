import { App } from '@prisma/client';

import IndividualAppCard from '@/components/IndividualAppCard';

interface Props {
  apps: App[];
  isExpert: boolean;
  onAppClick: (app: App) => void;
}

export default function UnsupportedAppsPanel({
  apps,
  isExpert,
  onAppClick,
}: Props) {
  if (apps.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-red-500 uppercase">
        <span className="text-red-500">{'//'}</span>
        Not Supported Apps
      </div>
      <p className="text-fg-dim -mt-2 text-xs">
        These apps require more resources than the current host can provide
        or are incompatible with the environment.
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {apps.map((svc) => (
          <div
            key={svc.id}
            className="h-full w-full cursor-not-allowed opacity-50 grayscale transition-all hover:opacity-80 hover:grayscale-[50%]"
          >
            <IndividualAppCard
              app={svc}
              isExpert={isExpert}
              onAppClick={onAppClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
