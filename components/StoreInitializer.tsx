'use client';

import { useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { type Machine, type AppSet, type Service } from '@/types';

export default function StoreInitializer({ 
  machines, 
  allSets, 
  allServices 
}: { 
  machines: Machine[]; 
  allSets: AppSet[]; 
  allServices: Service[]; 
}) {
  const initialized = useRef(false);
  if (!initialized.current) {
    // We silently hydrate the store on mount to avoid the "Cannot update a component while rendering" warning in React 18+
    const state = useAppStore.getState();
    if (state.machines.length === 0) {
      Object.assign(state, { machines, allSets, allServices });
    }
    initialized.current = true;
  }
  return null;
}
