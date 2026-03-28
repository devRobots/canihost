'use client';

import { App } from '@prisma/client';
import { FileCode2, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import { getDockerMetadata } from '@/app/actions/docker';

interface Props {
  apps: App[];
  children: React.ReactNode;
  className?: string;
}

export default function DeployScriptButton({
  apps,
  children,
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

          // Add Ports
          if (metadata.exposedPorts.length > 0) {
            serviceBlock += '\n    ports:';
            metadata.exposedPorts.forEach((port) => {
              const p = port.split('/')[0];
              serviceBlock += `\n      - "${p}:${p}"`;
            });
          }

          // Add Volumes
          if (metadata.volumes.length > 0) {
            serviceBlock += '\n    volumes:';
            metadata.volumes.forEach((vol) => {
              serviceBlock += `\n      - "./data/${serviceName}${vol}:${vol}"`;
            });
          }

          // Add Envs (Filtering out some common internal ones)
          const usefulEnvs = metadata.envs.filter(
            (e) => !e.startsWith('PATH=') && !e.startsWith('HOME=')
          );
          if (usefulEnvs.length > 0) {
            serviceBlock += '\n    environment:';
            usefulEnvs.forEach((env) => {
              serviceBlock += `\n      - ${env}`;
            });
          }

          return serviceBlock;
        })
        .join('\n\n');

      const dockerCompose = `version: '3.8'

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
      {loading ? 'Generating...' : children}
    </button>
  );
}
