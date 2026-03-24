import { type AppBundle, type Service, type ActiveMachine } from '@/types';
import AppBundleCard from '@/components/AppBundleCard';

interface Props {
  bundles: AppBundle[];
  machine: ActiveMachine;
  isExpert: boolean;
  onBundleClick: (bundle: AppBundle) => void;
  onServiceClick: (service: Service) => void;
}

export default function AppBundlesPanel({ bundles, machine, isExpert, onBundleClick, onServiceClick }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-fg-muted">
         <span className="text-accent">{'//'}</span>
         Recommended App Bundles
      </div>

      {bundles.length === 0 ? (
        <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-fg-dim border border-dashed border-border rounded-md bg-transparent">
          <span className="text-lg opacity-70">ℹ</span>
          <span className="opacity-80">The selected machine lacks the resources to run app bundles. Try an individual app below.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map(bundle => (
            <AppBundleCard 
              key={bundle.id} 
              bundle={bundle} 
              machine={machine} 
              isExpert={isExpert} 
              onBundleClick={onBundleClick} 
              onServiceClick={onServiceClick} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
