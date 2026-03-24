import { App } from '@prisma/client';

import { getAppIcon } from '@/lib/icons';
import { type ActiveHost, type AppBundle } from '@/types';

interface Props {
  bundle: AppBundle;
  host: ActiveHost;
  isExpert: boolean;
  onBundleClick: (bundle: AppBundle) => void;
  onAppClick: (app: App) => void;
}

export default function AppBundleCard({
  bundle,
  host,
  isExpert,
  onBundleClick,
  onAppClick,
}: Props) {
  const totalCpu = bundle.apps.reduce((acc, s) => acc + s.minCPU, 0);
  const totalRam = bundle.apps.reduce((acc, s) => acc + s.minRAM, 0);
  const cpuPct = Math.min(Math.round((totalCpu / host.cpuCores) * 100), 999);
  const ramPct = Math.min(Math.round((totalRam / host.memoryRamGb) * 100), 999);
  const cpuClass = cpuPct > 70 ? 'warn' : 'accent';
  const ramClass = ramPct > 70 ? 'warn' : 'accent';

  return (
    <div className="card flex flex-col gap-4 rounded p-5">
      {/* Card Header & Button */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-accent">◈</span>
            <h4 className="text-fg text-sm font-bold">{bundle.name}</h4>
          </div>
          <p className="text-fg-muted text-xs leading-relaxed">
            {bundle.description}
          </p>
        </div>
        <button
          onClick={() => onBundleClick(bundle)}
          className="btn-terminal ml-2 flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-bold transition-all"
          title="View Bundle Details"
        >
          i
        </button>
      </div>

      {/* CPU bar — expert only */}
      {isExpert && (
        <div className="mt-auto flex flex-col gap-1">
          <div className="text-fg-dim flex justify-between text-xs">
            <span className={`text-${cpuClass}`}>CPU</span>
            <span>
              {totalCpu.toFixed(2)}c / {host.cpuCores}c
            </span>
          </div>
          <div className="bg-input flex h-1 overflow-hidden rounded">
            <div
              className={`bar-fill ${cpuClass}`}
              style={{ width: `${cpuPct}%` }}
            />
          </div>
        </div>
      )}

      {/* RAM bar — expert only */}
      {isExpert && (
        <div className="flex flex-col gap-1">
          <div className="text-fg-dim flex justify-between text-xs">
            <span className={`text-${ramClass}`}>RAM</span>
            <span>
              {totalRam.toFixed(2)}GB / {host.memoryRamGb}GB
            </span>
          </div>
          <div className="bg-input flex h-1 overflow-hidden rounded">
            <div
              className={`bar-fill ${ramClass}`}
              style={{ width: `${ramPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Apps list */}
      <div className="mt-2 flex flex-wrap gap-2">
        {bundle.apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppClick(app)}
            className="tag flex cursor-pointer items-center gap-1 transition-all hover:bg-white/10 active:scale-[0.98]"
          >
            {getAppIcon(app.name)} {app.name}
          </button>
        ))}
      </div>
    </div>
  );
}
