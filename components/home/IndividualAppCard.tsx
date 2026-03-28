import { App } from '@prisma/client';
import { Cpu, MemoryStick } from 'lucide-react';

import { useModeStore } from '@/lib/store';

interface Props {
  app: App;
  onAppClick: (app: App) => void;
}

export default function IndividualAppCard({
  app,
  onAppClick,
}: Props) {
  const { mode } = useModeStore();

  return (
    <button
      onClick={() => onAppClick(app)}
      className="card hover:border-accent relative flex h-full w-full cursor-pointer flex-col px-3 pt-3 pb-2 transition-all active:scale-[0.98]"
    >
      {/* Info Button Top Left */}
      <div className="badge-info absolute top-2 left-2 flex h-5 w-5 items-center justify-center text-[10px] font-bold">
        i
      </div>

      <div className="flex flex-1 flex-col items-center gap-2 pt-4 pb-4 text-center">
        <img
          src={app.logoUrl}
          alt={`${app.name} logo`}
          className="h-12 w-12 object-contain"
        />
        <span className="text-fg mt-1 px-1 text-xs leading-tight font-bold">
          {app.name}
        </span>
      </div>
      {mode === 'expert' && (
        <div className="border-default text-fg-dim mt-auto flex w-full justify-center border-t pt-2 font-mono text-[10px]">
          <div className="flex w-full items-center justify-center gap-3">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Cpu size={12} />
              {app.minCPU === app.recommendedCPU
                ? app.recommendedCPU
                : `${app.minCPU}`}{' '}
              cores
            </span>
            <span className="opacity-50">|</span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <MemoryStick size={12} />
              {app.minRAM === app.recommendedRAM
                ? app.recommendedRAM
                : `${app.minRAM}`}{' '}
              GB
            </span>
          </div>
        </div>
      )}
    </button>
  );
}
