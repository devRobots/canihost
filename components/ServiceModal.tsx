'use client';

import { Service } from '@prisma/client';

import Modal from '@/components/Modal';
import { getServiceIcon } from '@/lib/icons';

export default function ServiceModal({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={!!service} onClose={onClose} title="Service Details">
      {service && (
        <div
          className="flex flex-col gap-4 text-sm"
          style={{ color: 'var(--fg-muted)' }}
        >
          <div
            className="flex items-center gap-3 border-b pb-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="text-4xl">{getServiceIcon(service.name)}</span>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--fg)' }}>
                {service.name}
              </h3>
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: 'var(--accent)' }}
              >
                {service.category}
              </p>
            </div>
          </div>

          <p className="leading-relaxed" style={{ color: 'var(--fg)' }}>
            {service.description || 'No description available.'}
          </p>

          {service.longDescription && (
            <p
              className="text-xs leading-relaxed opacity-80"
              style={{ color: 'var(--fg)' }}
            >
              {service.longDescription}
            </p>
          )}

          <div className="mt-2 grid grid-cols-2 gap-4">
            <div
              className="rounded p-3"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--accent)' }}
              >
                Minimum Requirements
              </div>
              <div className="text-xs">{service.minCPU} Cores</div>
              <div className="text-xs">{service.minRAM} GB RAM</div>
            </div>
            <div
              className="rounded p-3"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--accent)' }}
              >
                Recommended
              </div>
              <div className="text-xs">{service.recommendedCPU} Cores</div>
              <div className="text-xs">{service.recommendedRAM} GB RAM</div>
            </div>
          </div>

          {/* Action Links */}
          <div className="mt-2 flex flex-col gap-2">
            {service.officialUrl && (
              <a
                href={service.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-accent flex items-center gap-2 text-xs hover:underline"
              >
                🌐 Sitio Oficial
              </a>
            )}
            {service.dockerRegistryUrl && (
              <a
                href={service.dockerRegistryUrl}
                target="_blank"
                rel="noreferrer"
                className="text-info flex items-center gap-2 text-xs hover:underline"
              >
                🐳 Docker Registry
              </a>
            )}
            {service.cubepathUrl && (
              <a
                href={service.cubepathUrl}
                target="_blank"
                rel="noreferrer"
                className="text-warning flex items-center gap-2 text-xs hover:underline"
              >
                ⚡ Deploy on CubePath
              </a>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
