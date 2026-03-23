'use client';

import MachinePicker from '@/components/MachinePicker';
import { useAppStore } from '@/lib/store';
import Hero from '@/components/Hero';
import RecommendationsPanel from '@/components/RecommendationsPanel';

type Props = {
  t: {
    title: string;
    subtitle: string;
    selectMachine: string;
    recommendations: string;
    builder: string;
    noRecommendations: string;
    cpuLabel: string;
    ramLabel: string;
    cloudWarning: string;
  };
};

export default function HomeClient({ t }: Props) {
  const { selectedMachineId } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col font-mono bg-page">
      {/* ─── HERO ─── */}
      <Hero subtitle={t.subtitle} builder={t.builder} />

      {/* ─── BODY ─── */}
      <div className="container mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">
        
        {/* ─── MACHINE SELECTOR ─── */}
        <section>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest mb-4 text-fg-muted">
            <span className="text-accent">{'//'}</span>
            {t.selectMachine}
          </div>

          <MachinePicker 
            onSelect={() => {
              setTimeout(() => document.getElementById('recommendations-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
            }} 
          />
        </section>

        {/* ─── RECOMMENDATIONS ─── */}
        {selectedMachineId ? (
          <RecommendationsPanel t={t} />
        ) : (
          <div className="text-center py-16 text-sm text-fg-dim">
            <div className="text-4xl mb-4">_</div>
            <span className="prompt">Select a machine above to see recommendations</span>
          </div>
        )}
      </div>
    </div>
  );
}
