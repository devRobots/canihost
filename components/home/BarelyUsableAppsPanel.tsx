import { App } from '@prisma/client';

import IndividualAppCard from '@/components/home/AppCard';

interface Props {
  apps: App[];
  onAppClick: (app: App) => void;
}

export default function BarelyUsableAppsPanel({ apps, onAppClick }: Props) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-orange-400 uppercase">
        <span className="text-orange-400">{'//'}</span>
        Barely Usable Apps
      </div>
      <p className="text-fg-dim -mt-2 text-xs text-pretty">
        These apps can run on the host, but might encounter performance
        constraints or leave little room for other apps.
      </p>

      {apps.length === 0 ? (
        <div className="text-fg-dim border-border flex flex-col items-center justify-center gap-3 rounded-md border border-dashed bg-transparent p-4 py-6 text-xs sm:flex-row">
          <span className="text-lg opacity-70">😎</span>
          <span className="text-center opacity-80">
            No poorly performing apps! Your host is so efficient it doesn&apos;t
            even have &apos;barely usable&apos; in its vocabulary. Total
            show-off.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {apps.map((app) => (
            <div
              key={app.id}
              className="h-full w-full opacity-85 grayscale-30 transition-all hover:opacity-100 hover:grayscale-0"
            >
              <IndividualAppCard app={app} onAppClick={onAppClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
