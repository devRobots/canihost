import { App } from '@prisma/client';

import { ResourceSpecs } from '@/components/apps/ResourceSpecs';
import { useModeStore } from '@/store/mode';

interface Props {
  app: App;
  onAppClick: (app: App) => void;
}

export default function IndividualAppCard({ app, onAppClick }: Props) {
  const { mode } = useModeStore();

  return (
    <button
      onClick={() => onAppClick(app)}
      className="card hover:border-accent relative flex h-full w-full cursor-pointer flex-col px-3 pt-3 pb-2 transition-all active:scale-[0.98]"
    >
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
        <div className="mt-auto flex w-full flex-col gap-1.5">
          <ResourceSpecs
            cpu={app.recommendedCPU}
            ram={app.recommendedRAM}
            title="Recommended"
          />
          {(app.minCPU !== app.recommendedCPU ||
            app.minRAM !== app.recommendedRAM) && (
            <ResourceSpecs
              cpu={app.minCPU}
              ram={app.minRAM}
              title="Minimum"
            />
          )}
        </div>
      )}
    </button>
  );
}
