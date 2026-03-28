import { App } from '@prisma/client';

import IndividualAppCard from '@/components/home/AppCard';

interface Props {
  apps: App[];
  onAppClick: (app: App) => void;
}

export default function UnsupportedAppsPanel({ apps, onAppClick }: Props) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-red-500 uppercase">
        <span className="text-red-500">{'//'}</span>
        Not Supported Apps
      </div>
      <p className="text-fg-dim -mt-2 text-xs text-pretty">
        These apps require more resources than the current host can provide or
        are incompatible with the environment.
      </p>

      {apps.length === 0 ? (
        <div className="text-fg-dim border-border flex flex-col items-center justify-center gap-3 rounded-md border border-dashed bg-transparent p-4 py-6 text-xs sm:flex-row">
          <span className="text-lg opacity-70">🚀</span>
          <span className="text-center opacity-80">
            Nothing is unsupported? Either you&apos;re hosting on a NASA rig, or
            we ran out of heavy apps. Stop flexing, we get it.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {apps.map((svc) => (
            <div
              key={svc.id}
              className="h-full w-full cursor-not-allowed opacity-85 grayscale transition-all hover:opacity-100 hover:grayscale-30"
            >
              <IndividualAppCard app={svc} onAppClick={onAppClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
