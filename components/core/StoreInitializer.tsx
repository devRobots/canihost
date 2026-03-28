'use client';

import { App } from '@prisma/client';
import { useRef } from 'react';

import { useDbStore } from '@/store/db';
import { useHostStore } from '@/store/host';
import { type AppBundle, type Host } from '@/types';

export default function StoreInitializer({
  hosts,
  bundles,
  apps,
}: {
  hosts: Host[];
  bundles: AppBundle[];
  apps: App[];
}) {
  const initialized = useRef(false);
  if (!initialized.current) {
    const dbState = useDbStore.getState();
    const hostState = useHostStore.getState();

    if (dbState.hosts.length === 0) {
      dbState.setInitialData({ hosts, bundles, apps });

      if (!hostState.activeHost) {
        if (hosts.length > 0) {
          hostState.setActiveHost(hosts[0]);
        }
      } else {
        // Opcional: Validar que el host persistido aún sea válido
        const hostExists = hosts.find((h) => h.id === hostState.activeHost?.id);
        if (!hostExists && hosts.length > 0) {
          hostState.setActiveHost(hosts[0]);
        }
      }
    }

    initialized.current = true;
  }
  return null;
}
