import { App } from '@prisma/client';
import { Layers } from 'lucide-react';

import { ResourceUsageBar } from '@/components/core/ResourceUsageBar';
import { useHostStore } from '@/store/host';
import { useModeStore } from '@/store/mode';
import { type AppBundle } from '@/types';

interface Props {
  bundle: AppBundle;
  onBundleClick: (bundle: AppBundle) => void;
  onAppClick: (app: App) => void;
}

export default function AppBundleCard({ bundle, onBundleClick }: Props) {
  const { activeHost } = useHostStore();
  const { mode } = useModeStore();

  const core = activeHost?.cores || 1;
  const ram = activeHost?.ram || 1;

  const totalCpu = bundle.apps.reduce((acc, s) => acc + s.minCPU, 0);
  const totalRam = bundle.apps.reduce((acc, s) => acc + s.minRAM, 0);

  return (
    <div onClick={() => onBundleClick(bundle)} className="card cursor-pointer flex flex-col gap-4 rounded p-5">
      {/* Card Header & Button */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Layers size={16} className="text-accent" />
            <h4 className="text-fg text-sm font-bold">{bundle.name}</h4>
          </div>
          <p className="text-fg-muted text-xs leading-relaxed">
            {bundle.description}
          </p>
        </div>
      </div>

      {/* Footer section that stays at the bottom */}
      <div className="mt-auto flex flex-col gap-4">
        {mode === 'expert' && (
          <div className="flex flex-col gap-2">
            <ResourceUsageBar
              label="CPU"
              current={totalCpu}
              total={core}
              unit="c"
            />
            <ResourceUsageBar
              label="RAM"
              current={totalRam}
              total={ram}
              unit="GB"
            />
          </div>
        )}

        {/* Apps list */}
        <div className="flex flex-wrap gap-2">
          {bundle.apps.map((app) => (
            <div
              key={app.id}
              className="tag items-center gap-2 transition-all"
            >
              <img
                src={app.logoUrl}
                alt={`${app.name} logo`}
                className="h-3 w-3 object-contain"
              />{' '}
              <span className="text-xs">{app.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
