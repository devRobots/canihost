'use client';

import Modal from '@/components/Modal';
import { getAppIcon } from '@/lib/icons';
import { type AppBundle } from '@/types';

export default function AppBundleModal({
  bundle,
  onClose,
}: {
  bundle: AppBundle | null;
  onClose: () => void;
}) {
  const title = bundle ? bundle.name : 'App Bundle Details';

  return (
    <Modal isOpen={!!bundle} onClose={onClose} title={title}>
      {bundle && (
        <div
          className="flex flex-col gap-6 text-sm"
          style={{ color: 'var(--fg-muted)' }}
        >
          <p className="leading-relaxed" style={{ color: 'var(--fg)' }}>
            {bundle.description || 'No description available for this bundle.'}
          </p>

          <div className="flex gap-6">
            <div>
              <div
                className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--fg-dim)' }}
              >
                Total Min CPU
              </div>
              <div className="font-bold" style={{ color: 'var(--fg)' }}>
                {bundle.apps.reduce((acc, s) => acc + s.minCPU, 0).toFixed(1)}{' '}
                cores
              </div>
            </div>
            <div>
              <div
                className="mb-1 text-[10px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--fg-dim)' }}
              >
                Total Min RAM
              </div>
              <div className="font-bold" style={{ color: 'var(--fg)' }}>
                {bundle.apps.reduce((acc, s) => acc + s.minRAM, 0).toFixed(1)}{' '}
                GB
              </div>
            </div>
          </div>

          <div>
            <div
              className="mb-3 text-[10px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--accent)' }}
            >
              {'// '} Individual Application Roles & Costs
            </div>
            <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-2">
              {bundle.apps.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col gap-1 rounded p-3"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getAppIcon(app.name)}</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: 'var(--fg)' }}
                    >
                      {app.name}
                    </span>
                    <span
                      className="font-mono text-[10px] whitespace-nowrap"
                      style={{ color: 'var(--fg-dim)' }}
                    >
                      {app.minCPU}c | {app.minRAM}G
                    </span>
                  </div>
                  <div
                    className="mt-1 text-[10px] font-bold tracking-widest uppercase opacity-70"
                    style={{ color: 'var(--fg-dim)' }}
                  >
                    CPU: {app.minCPU}C | RAM: {app.minRAM}GB
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
