'use client';

import { App } from '@prisma/client';
import { useRef } from 'react';

import { useAppStore } from '@/lib/store';
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
    // We silently hydrate the store on mount to avoid the "Cannot update a component while rendering" warning in React 18+
    const state = useAppStore.getState();
    if (state.hosts.length === 0) {
      state.setInitialData({ hosts, allBundles, allApps });
    }
    initialized.current = true;
  }
  return null;
}
