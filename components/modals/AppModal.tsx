'use client';

import { App } from '@prisma/client';
import { Cpu, Globe, MemoryStick, Monitor, Zap } from 'lucide-react';

import DeployScriptButton from '@/components/core/DeployScriptButton';
import Modal from '@/components/modals/Modal';
import { useModeStore } from '@/store/mode';

export default function AppModal({
  app,
  onClose,
}: {
  app: App | null;
  onClose: () => void;
}) {
  const { mode } = useModeStore();

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
            <img
              src={app.logoUrl}
              alt={`${app.name} logo`}
              className="h-12 w-12 object-contain"
            />
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

            {app.officialUrl && (
              <a
                href={app.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-auto flex items-center gap-1 rounded-sm px-3 py-1 text-xs font-bold opacity-50 transition-opacity hover:opacity-90"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--fg)',
                  background: 'var(--bg-input)',
                }}
              >
                <Globe size={14} /> Visit
              </a>
            )}
          </div>

          {!app.isCloudRecommended && (
            <span className="relative ml-1 inline-flex">
              <span
                title="Local Only"
                className="group inline-flex cursor-default items-center justify-center gap-2 rounded-sm p-1 text-xs"
                style={{
                  background: 'color-mix(in srgb, #f59e0b 18%, transparent)',
                  border:
                    '1px solid color-mix(in srgb, #f59e0b 45%, transparent)',
                  color: '#f59e0b',
                }}
              >
                <Monitor size={11} /> Local Only
              </span>
            </span>
          )}

          <p className="leading-relaxed" style={{ color: 'var(--fg)' }}>
            {app.description || 'No description available.'}
          </p>

          {mode === 'expert' && (
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div
                className="rounded-sm p-3"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="mb-2 text-[10px] font-bold tracking-widest uppercase opacity-70"
                  style={{ color: 'var(--accent)' }}
                >
                  Minimum
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Cpu size={14} style={{ color: 'var(--accent)' }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: 'var(--fg)' }}
                    >
                      {app.minCPU}
                      <span className="ml-1 font-normal opacity-50">Cores</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MemoryStick size={14} style={{ color: 'var(--accent)' }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: 'var(--fg)' }}
                    >
                      {app.minRAM}
                      <span className="ml-1 font-normal opacity-50">GB</span>
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-sm p-3"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="mb-2 text-[10px] font-bold tracking-widest uppercase opacity-70"
                  style={{ color: 'var(--accent)' }}
                >
                  Recommended
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Cpu size={14} style={{ color: 'var(--accent)' }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: 'var(--fg)' }}
                    >
                      {app.recommendedCPU}
                      <span className="ml-1 font-normal opacity-50">Cores</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MemoryStick size={14} style={{ color: 'var(--accent)' }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: 'var(--fg)' }}
                    >
                      {app.recommendedRAM}
                      <span className="ml-1 font-normal opacity-50">GB</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {app.longDescription && (
            <p
              className="text-xs leading-relaxed opacity-80"
              style={{ color: 'var(--fg)' }}
            >
              {app.longDescription}
            </p>
          )}

          {(app.dockerRegistryUrl || app.cubepathUrl) && (
            <div className="mt-2 flex gap-2">
              {app.dockerRegistryUrl && (
                <DeployScriptButton
                  apps={[app]}
                  className="flex-1 px-4 py-2.5 text-xs font-bold"
                >
                  Deployment Script
                </DeployScriptButton>
              )}
              {app.cubepathUrl && app.isCloudRecommended && (
                <a
                  href={app.cubepathUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-center text-xs font-bold transition-opacity hover:opacity-80"
                  style={{
                    background:
                      'color-mix(in srgb, var(--green) 15%, transparent)',
                    border:
                      '1px solid color-mix(in srgb, var(--green) 40%, transparent)',
                    color: 'var(--green)',
                  }}
                >
                  <Zap size={14} />
                  Deploy on CubePath
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
