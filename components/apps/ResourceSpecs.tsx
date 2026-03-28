import { Cpu, MemoryStick } from 'lucide-react';

interface ResourceSpecsProps {
  title?: string;
  cpu: number | string;
  ram: number | string;
  className?: string;
  showBorder?: boolean;
}

export function ResourceSpecs({
  title,
  cpu,
  ram,
  className = '',
  showBorder = true,
}: ResourceSpecsProps) {
  return (
    <div
      className={`text-fg-dim flex w-full flex-col items-center gap-1 font-mono text-[10px] ${
        showBorder ? 'border-default border-t pt-2' : ''
      } ${className}`}
    >
      {title && (
        <span className="text-[8px] font-bold tracking-widest uppercase">
          {title}
        </span>
      )}
      <div className="flex w-full items-center justify-center gap-3">
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Cpu size={12} />
          {cpu} cores
        </span>
        <span className="opacity-30">|</span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <MemoryStick size={12} />
          {ram} GB
        </span>
      </div>
    </div>
  );
}
