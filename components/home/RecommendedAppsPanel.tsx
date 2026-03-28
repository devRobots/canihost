import { App } from '@prisma/client';

import IndividualAppCard from '@/components/home/AppCard';

interface Props {
  apps: App[];
  onAppClick: (app: App) => void;
}

export default function RecommendedAppsPanel({ apps, onAppClick }: Props) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="text-fg-muted flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
        <span className="text-accent">{'//'}</span>
        Recommended Apps
      </div>

      {apps.length === 0 ? (
        <div className="text-fg-dim border-border flex flex-col items-center justify-center gap-3 rounded-md border border-dashed bg-transparent p-4 py-6 text-xs sm:flex-row">
          <span className="text-lg opacity-70">🥔</span>
          <span className="text-center opacity-80">
            Not even a single app is suitable? Your machine&apos;s resources are
            so low we&apos;re starting to suspect you&apos;re hosting on a
            literal potato. Impressive, in a sad way.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {apps.map((app) => (
            <IndividualAppCard key={app.id} app={app} onAppClick={onAppClick} />
          ))}
        </div>
      )}
    </div>
  );
}
