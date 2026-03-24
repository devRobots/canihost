'use client';

import { Service } from '@prisma/client';
import { useRef } from 'react';

import { useAppStore } from '@/lib/store';
import { type AppBundle,type Machine } from '@/types';

export default function StoreInitializer({ 
  machines, 
  allBundles, 
  allServices 
}: { 
  machines: Machine[]; 
  allBundles: AppBundle[]; 
  allServices: Service[]; 
}) {
  const initialized = useRef(false);
  if (!initialized.current) {
    // We silently hydrate the store on mount to avoid the "Cannot update a component while rendering" warning in React 18+
    const state = useAppStore.getState();
    if (state.machines.length === 0) {
      state.setInitialData({ machines, allBundles, allServices });
    }
    initialized.current = true;
  }
  return null;
}
