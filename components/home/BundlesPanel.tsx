import { App } from '@prisma/client';
import { useMemo } from 'react';

import AppBundleCard from '@/components/home/BundleCard';
import { useDbStore } from '@/store/db';
import { useHostStore } from '@/store/host';
import { type AppBundle } from '@/types';

interface Props {
  onBundleClick: (bundle: AppBundle) => void;
  onAppClick: (app: App) => void;
}

export default function AppBundlesPanel({ onBundleClick, onAppClick }: Props) {
  const { bundles } = useDbStore();
  const { activeHost } = useHostStore();

  const core = activeHost?.cores || 0;
  const ram = activeHost?.ram || 0;

  const recommendedBundles = useMemo(() => {
    return bundles
      .filter((bundle) => {
        const total = bundle.apps.reduce(
          (acc, app) => ({
            cpu: acc.cpu + app.minCPU,
            ram: acc.ram + app.minRAM,
          }),
          { cpu: 0, ram: 0 },
        );
        return total.cpu <= core && total.ram <= ram;
      })
      .slice(0, 6);
  }, [bundles, core, ram]);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-fg-muted flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
        <span className="text-accent">{'//'}</span>
        Recommended Bundles
      </div>

      {recommendedBundles.length === 0 ? (
        <div className="text-fg-dim border-border flex flex-col items-center justify-center gap-3 rounded-md border border-dashed bg-transparent py-6 text-xs sm:flex-row p-4">
          <span className="text-lg opacity-70">🧮</span>
          <span className="text-center opacity-80">
            Zero bundles available. Your host had a panic attack just looking at
            these combined requirements. Maybe try something simpler, like a
            pocket calculator?
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendedBundles.map((bundle) => (
            <AppBundleCard
              key={bundle.id}
              bundle={bundle}
              onBundleClick={onBundleClick}
              onAppClick={onAppClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
