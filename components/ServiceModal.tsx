'use client';

import { Service } from '@prisma/client';

import Modal from '@/components/Modal';
import { getServiceIcon } from '@/lib/icons';

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

          {service.longDescription && (
            <p className="leading-relaxed text-xs opacity-80" style={{ color: 'var(--fg)' }}>
               {service.longDescription}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-3 rounded" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
               <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--accent)' }}>Minimum Requirements</div>
               <div className="text-xs">{service.minCPU} Cores</div>
               <div className="text-xs">{service.minRAM} GB RAM</div>
            </div>
            <div className="p-3 rounded" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
               <div className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--accent)' }}>Recommended</div>
               <div className="text-xs">{service.recommendedCPU} Cores</div>
               <div className="text-xs">{service.recommendedRAM} GB RAM</div>
            </div>
          </div>
          
          {/* Action Links */}
          <div className="flex flex-col gap-2 mt-2">
            {service.officialUrl && (
              <a href={service.officialUrl} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline flex items-center gap-2">
                🌐 Sitio Oficial
              </a>
            )}
            {service.dockerRegistryUrl && (
              <a href={service.dockerRegistryUrl} target="_blank" rel="noreferrer" className="text-xs text-info hover:underline flex items-center gap-2">
                🐳 Docker Registry
              </a>
            )}
            {service.cubepathUrl && (
              <a href={service.cubepathUrl} target="_blank" rel="noreferrer" className="text-xs text-warning hover:underline flex items-center gap-2">
                ⚡ Deploy on CubePath
              </a>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
