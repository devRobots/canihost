'use client';

import { useEffect, useRef, useState } from 'react';

import CpuSelector from '@/components/hostpicker/CpuSelector';
import HostDropdown from '@/components/hostpicker/HostDropdown';
import ModeToggle from '@/components/hostpicker/ModeToggle';
import RamSelector from '@/components/hostpicker/RamSelector';
import VariantDropdown from '@/components/hostpicker/VariantDropdown';
import { useDbStore } from '@/lib/store/db';
import { useHostStore } from '@/lib/store/host';

export default function HostPicker() {
  const { hosts } = useDbStore();
  const { selectedHostId } = useHostStore();

  const [openDropdown, setOpenDropdown] = useState<
    'host' | 'variant' | 'cpu' | 'ram' | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, {
      passive: true,
    });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const selectedHost = hosts.find((m) => m.id === selectedHostId);

  return (
    <div className="flex w-full flex-col items-end justify-center gap-4 font-mono md:flex-row">
      <div
        ref={containerRef}
        className="border-line-accent bg-card flex w-full flex-col items-stretch justify-center gap-2 rounded-md border px-4 py-3 md:w-auto md:flex-row md:items-center md:gap-4 md:py-2"
      >
        <HostDropdown
          isOpen={openDropdown === 'host'}
          onToggle={() =>
            setOpenDropdown(openDropdown === 'host' ? null : 'host')
          }
          onClose={() => setOpenDropdown(null)}
        />

        {selectedHost && (
          <>
            <div className="bg-border my-1 h-px w-full opacity-50 md:mx-auto md:my-0 md:h-8 md:w-px" />

            <VariantDropdown
              isOpen={openDropdown === 'variant'}
              onToggle={() =>
                setOpenDropdown(openDropdown === 'variant' ? null : 'variant')
              }
              onClose={() => setOpenDropdown(null)}
            />

            <div className="bg-border my-1 h-px w-full opacity-50 md:mx-auto md:my-0 md:h-8 md:w-px" />

            <div className="flex flex-row items-center gap-4">
              <CpuSelector
                isOpen={openDropdown === 'cpu'}
                onToggle={() =>
                  setOpenDropdown(openDropdown === 'cpu' ? null : 'cpu')
                }
                onClose={() => setOpenDropdown(null)}
              />

              <div className="bg-border h-8 w-px opacity-50 md:mx-auto" />

              <RamSelector
                isOpen={openDropdown === 'ram'}
                onToggle={() =>
                  setOpenDropdown(openDropdown === 'ram' ? null : 'ram')
                }
                onClose={() => setOpenDropdown(null)}
              />
            </div>
          </>
        )}
      </div>

      <ModeToggle />
    </div>
  );
}
