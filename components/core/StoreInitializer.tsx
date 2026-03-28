'use client';

import { App } from '@prisma/client';
import { useRef } from 'react';

import { useDbStore } from '@/store/db';
import { HostState, useHostStore } from '@/store/host';
import { type AppBundle, type Host } from '@/types';

function initializeHostState(hosts: Host[], hostState: HostState) {
  if (!hostState.activeHost && hosts.length > 0) {
    const defaultHost = hosts.find((h) => h.name === 'CubePath') || hosts[0];

    if (defaultHost) {
      hostState.setActiveHost(defaultHost);

      if (defaultHost.name === 'CubePath') {
        const variant = defaultHost.variants.find(
          (v) => v.name === 'gp.starter',
        );
        if (variant) hostState.setVariant(variant.id);
      }
    }
  } else if (hostState.activeHost && hosts.length > 0) {
    const hostExists = hosts.find((h) => h.id === hostState.activeHost?.id);
    if (!hostExists) {
      hostState.setActiveHost(hosts[0]);
    }
  }
}

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
    }

    initializeHostState(hosts, hostState);

    initialized.current = true;
  }

  return null;
}
