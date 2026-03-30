'use client';

import { App } from '@prisma/client';
import { FileCode2, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { getDockerMetadata } from '@/app/actions/docker';

interface Props {
  apps: App[];
  projectName?: string;
  className?: string;
}

export default function DeployScriptButton({
  apps,
  projectName,
  className = '',
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const deployableApps = apps.filter((app) => app.dockerRegistryUrl);

      if (deployableApps.length === 0) {
        alert('No apps with docker registry URL found.');
        return;
      }

      const appMetadatas = await Promise.all(
        deployableApps.map(async (app) => {
          const metadata = await getDockerMetadata(app.dockerRegistryUrl!);
          return { app, metadata };
        })
      );

      const services = appMetadatas
        .map(({ app, metadata }) => {
          const serviceName = app.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
          let serviceBlock = `  ${serviceName}:
    image: ${metadata.imageName}
    container_name: ${serviceName}
    restart: always`;

          // Add Ports - Use Set to avoid duplicates and filter out empty items
          const uniquePorts = Array.from(
            new Set(
              metadata.exposedPorts
                .map((port) => port.split('/')[0])
                .filter((p) => p && p.trim() !== '')
            )
          );

          if (uniquePorts.length > 0) {
            serviceBlock += '\n    ports:';
            uniquePorts.forEach((p) => {
              serviceBlock += `\n      - "${p}:${p}"`;
            });
          }

          // Add Volumes - Filter out empty items and deduplicate
          const uniqueVolumes = Array.from(
            new Set(
              metadata.volumes
                .filter((vol) => vol && vol.trim() !== '')
                .map((vol) => (vol.startsWith('/') ? vol : `/${vol}`))
            )
          );

          if (uniqueVolumes.length > 0) {
            serviceBlock += '\n    volumes:';
            uniqueVolumes.forEach((vol) => {
              serviceBlock += `\n      - "./data/${serviceName}${vol}:${vol}"`;
            });
          }

          // Add Envs (Filtering out some common internal ones and empty items)
          // Also deduplicate environment keys (keeping the last value)
          const usefulEnvsList = metadata.envs.filter(
            (e) =>
              e &&
              e.trim() !== '' &&
              !e.startsWith('PATH=') &&
              !e.startsWith('HOME=')
          );

          const envMap = new Map<string, string>();
          usefulEnvsList.forEach((e) => {
            const [key, ...parts] = e.split('=');
            if (key) {
              envMap.set(key, parts.join('='));
            }
          });

          if (envMap.size > 0) {
            serviceBlock += '\n    environment:';
            envMap.forEach((value, key) => {
              serviceBlock += `\n      - ${key}=${value}`;
            });
          }

          return serviceBlock;
        })
        .join('\n\n');

      const name = projectName || (apps.length === 1 ? apps[0].name : 'custom-stack');
      const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

      const dockerCompose = `name: ${sanitizedName}

services:
${services}
`;

      const blob = new Blob([dockerCompose], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `docker-compose.yml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating docker-compose:', err);
      alert('Failed to generate deployment script.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-md transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
        border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
        color: 'var(--accent)',
      }}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <FileCode2 size={14} />
      )}
      {loading ? 'Generating...' : 'Deploy Script'}
    </button>
  );
}
