import { App } from '@prisma/client';

import IndividualAppCard from '@/components/IndividualAppCard';

interface Props {
  apps: App[];
  isExpert: boolean;
  onAppClick: (app: App) => void;
}

export default function BarelyUsableAppsPanel({
  apps,
  isExpert,
  onAppClick,
}: Props) {
  if (apps.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-orange-400 uppercase">
        <span className="text-orange-400">{'//'}</span>
        Barely Usable Apps
      </div>
      <p className="text-fg-dim -mt-2 text-xs">
        These apps can run on the machine, but might encounter performance
        constraints or leave little room for other services.
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {apps.map((app) => (
          <div
            key={app.id}
            className="h-full w-full opacity-80 grayscale-[30%] transition-all hover:opacity-100 hover:grayscale-0"
          >
            <IndividualAppCard
              app={app}
              isExpert={isExpert}
              onAppClick={onAppClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
