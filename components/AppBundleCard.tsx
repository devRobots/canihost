import { getServiceIcon } from '@/lib/icons';
import { type AppBundle, type Service, type Machine } from '@/types';

interface Props {
  bundle: AppBundle;
  machine: Machine;
  isExpert: boolean;
  onBundleClick: (bundle: AppBundle) => void;
  onServiceClick: (service: Service) => void;
}

export default function AppBundleCard({ bundle, machine, isExpert, onBundleClick, onServiceClick }: Props) {
  const totalCpu = bundle.services.reduce((acc, s) => acc + s.cpuCost, 0);
  const totalRam = bundle.services.reduce((acc, s) => acc + s.ramCostGb, 0);
  const cpuPct = Math.min(Math.round((totalCpu / machine.cpuCores) * 100), 999);
  const ramPct = Math.min(Math.round((totalRam / machine.memoryRamGb) * 100), 999);
  const cpuClass = cpuPct > 70 ? 'warn' : 'accent';
  const ramClass = ramPct > 70 ? 'warn' : 'accent';

  return (
    <div className="card flex flex-col gap-4 p-5 rounded">
      {/* Card Header & Button */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-accent">◈</span>
            <h4 className="font-bold text-sm text-fg">
              {bundle.name}
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-fg-muted">
            {bundle.description}
          </p>
        </div>
        <button
          onClick={() => onBundleClick(bundle)}
          className="w-6 h-6 shrink-0 flex items-center justify-center text-[10px] font-bold transition-all btn-terminal ml-2"
          title="View Bundle Details"
        >
          i
        </button>
      </div>

      {/* CPU bar — expert only */}
      {isExpert && (
        <div className="flex flex-col gap-1 mt-auto">
          <div className="flex justify-between text-xs text-fg-dim">
            <span className={`text-${cpuClass}`}>CPU</span>
            <span>{totalCpu.toFixed(2)}c / {machine.cpuCores}c</span>
          </div>
          <div className="h-1 bg-input rounded overflow-hidden flex">
            <div className={`bar-fill ${cpuClass}`} style={{ width: `${cpuPct}%` }} />
          </div>
        </div>
      )}

      {/* RAM bar — expert only */}
      {isExpert && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-fg-dim">
            <span className={`text-${ramClass}`}>RAM</span>
            <span>{totalRam.toFixed(2)}GB / {machine.memoryRamGb}GB</span>
          </div>
          <div className="h-1 bg-input rounded overflow-hidden flex">
            <div className={`bar-fill ${ramClass}`} style={{ width: `${ramPct}%` }} />
          </div>
        </div>
      )}

      {/* Services list */}
      <div className="flex flex-wrap gap-2 mt-2">
        {bundle.services.map((svc) => (
          <button
            key={svc.id}
            onClick={() => onServiceClick(svc)}
            className="tag flex items-center gap-1 transition-all hover:bg-white/10 active:scale-[0.98] cursor-pointer"
          >
            {getServiceIcon(svc.name)} {svc.name}
          </button>
        ))}
      </div>
    </div>
  );
}
