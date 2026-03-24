'use client';

import Modal from '@/components/Modal';
import { getServiceIcon } from '@/lib/icons';


import { type AppBundle } from '@/types';

export default function AppBundleModal({ bundle, onClose }: { bundle: AppBundle | null, onClose: () => void }) {
  const title = bundle ? bundle.name : 'App Bundle Details';

  return (
    <Modal
      isOpen={!!bundle}
      onClose={onClose}
      title={title}
    >
      {bundle && (
        <div className="flex flex-col gap-6 text-sm" style={{ color: 'var(--fg-muted)' }}>
          <p className="leading-relaxed" style={{ color: 'var(--fg)' }}>
             {bundle.description || 'No description available for this bundle.'}
          </p>

          <div className="flex gap-6">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--fg-dim)' }}>Total Min CPU</div>
              <div className="font-bold" style={{ color: 'var(--fg)' }}>
                {bundle.services.reduce((acc, s) => acc + s.minCPU, 0).toFixed(1)} cores
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--fg-dim)' }}>Total Min RAM</div>
              <div className="font-bold" style={{ color: 'var(--fg)' }}>
                {bundle.services.reduce((acc, s) => acc + s.minRAM, 0).toFixed(1)} GB
              </div>
            </div>
          </div>

          <div>
             <div className="text-[10px] uppercase font-bold tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
                {'// '} Individual Application Roles & Costs
             </div>
             <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2">
                {bundle.services.map(svc => (
                   <div key={svc.id} className="p-3 rounded flex flex-col gap-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2">
                         <span className="text-xl">{getServiceIcon(svc.name)}</span>
                         <span className="font-bold text-xs" style={{ color: 'var(--fg)' }}>{svc.name}</span>
                         <span className="text-[10px] font-mono whitespace-nowrap" style={{ color: 'var(--fg-dim)' }}>
                    {svc.minCPU}c | {svc.minRAM}G
                  </span>
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-70" style={{ color: 'var(--fg-dim)' }}>
                        CPU: {svc.minCPU}C | RAM: {svc.minRAM}GB
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
