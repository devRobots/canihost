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

      // Check if there's any database service in the stack
      const dbServices = appMetadatas.filter(({ app }) =>
        app.name.toLowerCase().match(/(mariadb|mysql|postgres|mongodb)/)
      );
      const mainDbService =
        dbServices.length > 0
          ? dbServices[0].app.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
          : null;

      interface ComposeService {
        container_name: string;
        image: string;
        restart: string;
        depends_on?: string[];
        environment?: Record<string, string>;
        volumes?: string[];
        ports?: string[];
      }

      const servicesObj: Record<string, ComposeService> = {};
      const usedPorts = new Set<number>();
      const internalDbPorts = new Set(['3306', '5432', '27017', '6379']);

      // Predefined DB credentials
      const DB_CREDS = {
        dbName: 'canihostdb',
        user: 'canihostuser',
        dbPass: 'securedbpass',
        rootPass: 'securerootpass',
      };

      const getAppEnvs = (serviceName: string) => {
        const envs: Record<string, string> = {};

        // DB setups
        if (serviceName.includes('mariadb') || serviceName.includes('mysql')) {
          envs.MYSQL_ROOT_PASSWORD = DB_CREDS.rootPass;
          envs.MYSQL_DATABASE = DB_CREDS.dbName;
          envs.MYSQL_USER = DB_CREDS.user;
          envs.MYSQL_PASSWORD = DB_CREDS.dbPass;
        } else if (serviceName.includes('postgres')) {
          envs.POSTGRES_PASSWORD = DB_CREDS.rootPass;
          envs.POSTGRES_USER = DB_CREDS.user;
          envs.POSTGRES_DB = DB_CREDS.dbName;
        }

        // App setups
        if (mainDbService) {
          if (serviceName.includes('wordpress')) {
            envs.WORDPRESS_DB_HOST = mainDbService;
            envs.WORDPRESS_DB_USER = DB_CREDS.user;
            envs.WORDPRESS_DB_PASSWORD = DB_CREDS.dbPass;
            envs.WORDPRESS_DB_NAME = DB_CREDS.dbName;
          } else if (serviceName.includes('nextcloud')) {
            envs.MYSQL_HOST = mainDbService;
            envs.MYSQL_USER = DB_CREDS.user;
            envs.MYSQL_PASSWORD = DB_CREDS.dbPass;
            envs.MYSQL_DATABASE = DB_CREDS.dbName;
          }
        }

        return Object.keys(envs).length > 0 ? envs : undefined;
      };

      appMetadatas.forEach(({ app, metadata }) => {
        const serviceName = app.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        const serviceDef: ComposeService = {
          container_name: serviceName,
          image: metadata.imageName,
          restart: 'always',
        };

        // Depends On logic
        if (mainDbService && serviceName !== mainDbService && !serviceName.match(/(mariadb|mysql|postgres|mongodb)/)) {
          serviceDef.depends_on = [mainDbService];
        }

        // Environments
        const appEnvs = getAppEnvs(serviceName);
        if (appEnvs) {
          serviceDef.environment = appEnvs;
        }

        // Volumes
        const uniqueVolumes = Array.from(
          new Set(
            metadata.volumes
              .filter((vol) => vol && vol.trim() !== '')
              .map((vol) => (vol.startsWith('/') ? vol : `/${vol}`))
          )
        );
        if (uniqueVolumes.length > 0) {
          serviceDef.volumes = uniqueVolumes.map(
            (vol) => `./data/${serviceName}${vol}:${vol}`
          );
        }

        // Ports
        const isDb = serviceName.match(/(mariadb|mysql|postgres|mongodb)/);
        const uniquePorts = Array.from(
          new Set(
            metadata.exposedPorts
              .map((port) => port.split('/')[0])
              .filter((p) => p && p.trim() !== '')
          )
        );

        if (uniquePorts.length > 0) {
          const mappedPorts: string[] = [];
          uniquePorts.forEach((p) => {
            if (isDb && internalDbPorts.has(p)) {
              // Do not expose internal database ports to host
              return;
            }
            
            let hostPort = parseInt(p, 10);
            if (!isNaN(hostPort)) {
              while (usedPorts.has(hostPort)) {
                hostPort++;
              }
              usedPorts.add(hostPort);
              mappedPorts.push(`${hostPort}:${p}`);
            }
          });
          
          if (mappedPorts.length > 0) {
            serviceDef.ports = mappedPorts;
          }
        }

        servicesObj[serviceName] = serviceDef;
      });

      const name = projectName || (apps.length === 1 ? apps[0].name : 'custom-stack');
      const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

      const dockerComposeObj = {
        name: sanitizedName,
        services: servicesObj,
      };

      // Import right before usage so it works correctly on client
      const YAML = (await import('yaml')).default;
      const dockerComposeYml = YAML.stringify(dockerComposeObj);

      const blob = new Blob([dockerComposeYml], { type: 'text/yaml' });
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
