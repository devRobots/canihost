'use client';

import { App } from '@prisma/client';
import { useRef } from 'react';

import { useDbStore, useHostStore } from '@/lib/store';
import { type AppBundle, type Host } from '@/types';

export default function StoreInitializer({
  hosts,
  allBundles,
  allApps,
}: {
  hosts: Host[];
  allBundles: AppBundle[];
  allApps: App[];
}) {
  const initialized = useRef(false);
  if (!initialized.current) {
    const dbState = useDbStore.getState();
    const hostState = useHostStore.getState();

    if (dbState.hosts.length === 0) {
      dbState.setInitialData({ hosts, bundles: allBundles, apps: allApps });

      const hostId = hostState.selectedHostId;
      const variantId = hostState.selectedVariantId;

      const hostExists = hosts.find((m) => m.id === hostId);
      if (!hostExists) {
        hostState.setSelectedHostId(hosts[0]?.id || null, hosts);
      } else {
        const variantExists = hostExists.variants.find((v) => v.id === variantId);
        if (!variantExists) {
          useHostStore.setState({ selectedVariantId: hostExists.variants[0]?.id || null });
        }
      }
    }
    initialized.current = true;
  }
  return null;
}
