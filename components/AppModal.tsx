'use client';

import { App } from '@prisma/client';

import Modal from '@/components/Modal';
import { getAppIcon } from '@/lib/icons';

export default function AppModal({
  app,
  onClose,
}: {
  app: App | null;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={!!app} onClose={onClose} title="App Details">
      {app && (
        <div
          className="flex flex-col gap-4 text-sm"
          style={{ color: 'var(--fg-muted)' }}
        >
          <div
            className="flex items-center gap-3 border-b pb-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="text-4xl">{getAppIcon(app.name)}</span>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--fg)' }}>
                {app.name}
              </h3>
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: 'var(--accent)' }}
              >
                {app.category}
              </p>
            </div>
          </div>

          <p className="leading-relaxed" style={{ color: 'var(--fg)' }}>
            {app.description || 'No description available.'}
          </p>

          {app.longDescription && (
            <p
              className="text-xs leading-relaxed opacity-80"
              style={{ color: 'var(--fg)' }}
            >
              {app.longDescription}
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
              <div className="text-xs">{app.minCPU} Cores</div>
              <div className="text-xs">{app.minRAM} GB RAM</div>
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
              <div className="text-xs">{app.recommendedCPU} Cores</div>
              <div className="text-xs">{app.recommendedRAM} GB RAM</div>
            </div>
          </div>

          {/* Action Links */}
          <div className="mt-2 flex flex-col gap-2">
            {app.officialUrl && (
              <a
                href={app.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-accent flex items-center gap-2 text-xs hover:underline"
              >
                🌐 Sitio Oficial
              </a>
            )}
            {app.dockerRegistryUrl && (
              <a
                href={app.dockerRegistryUrl}
                target="_blank"
                rel="noreferrer"
                className="text-info flex items-center gap-2 text-xs hover:underline"
              >
                🐳 Docker Registry
              </a>
            )}
            {app.cubepathUrl && (
              <a
                href={app.cubepathUrl}
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
