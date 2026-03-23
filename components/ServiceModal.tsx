'use client';

import Modal from '@/components/Modal';
import { getServiceIcon } from '@/lib/icons';


import { type Service } from '@/types';

export default function ServiceModal({ service, onClose }: { service: Service | null, onClose: () => void }) {
  return (
    <Modal
      isOpen={!!service}
      onClose={onClose}
      title="Service Details"
    >
      {service && (
        <div className="flex flex-col gap-4 text-sm" style={{ color: 'var(--fg-muted)' }}>
          <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
             <span className="text-4xl">{getServiceIcon(service.name)}</span>
             <div>
               <h3 className="font-bold text-lg" style={{ color: 'var(--fg)' }}>{service.name}</h3>
               <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{service.category}</p>
             </div>
          </div>
          
          <p className="leading-relaxed" style={{ color: 'var(--fg)' }}>
             {service.description || 'No description available.'}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-3 rounded" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
               <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--accent)' }}>Minimum Requirements</div>
               <div className="text-xs">{service.minRequirements || 'N/A'}</div>
            </div>
            <div className="p-3 rounded" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
               <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--accent)' }}>Recommended Requirements</div>
               <div className="text-xs">{service.recRequirements || 'N/A'}</div>
            </div>
            <div>
               <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--fg-dim)' }}>CPU Cost</div>
               <div className="font-bold" style={{ color: 'var(--fg)' }}>{service.cpuCost.toFixed(2)} cores</div>
            </div>
            <div>
               <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--fg-dim)' }}>RAM Cost</div>
               <div className="font-bold" style={{ color: 'var(--fg)' }}>{service.ramCostGb.toFixed(2)} GB</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
