import { App } from '@prisma/client';

import AppBundleCard from '@/components/AppBundleCard';
import { type ActiveHost, type AppBundle } from '@/types';

interface Props {
  bundles: AppBundle[];
  host: ActiveHost;
  isExpert: boolean;
  onBundleClick: (bundle: AppBundle) => void;
  onAppClick: (app: App) => void;
}

export default function AppBundlesPanel({
  bundles,
  host,
  isExpert,
  onBundleClick,
  onAppClick,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-fg-muted flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
        <span className="text-accent">{'//'}</span>
        Recommended App Bundles
      </div>

      {bundles.length === 0 ? (
        <div className="text-fg-dim border-border flex flex-col items-center justify-center gap-3 rounded-md border border-dashed bg-transparent py-6 text-xs sm:flex-row">
          <span className="text-lg opacity-70">ℹ</span>
          <span className="opacity-80">
            The selected host lacks the resources to run the selected app bundle. Try an individual app below.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <AppBundleCard
              key={bundle.id}
              bundle={bundle}
              host={host}
              isExpert={isExpert}
              onBundleClick={onBundleClick}
              onAppClick={onAppClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
