interface ResourceUsageBarProps {
  label: string;
  current: number;
  total: number;
  unit: string;
  className?: string;
}

export function ResourceUsageBar({
  label,
  current,
  total,
  unit,
  className = '',
}: ResourceUsageBarProps) {
  const pct = Math.min(Math.round((current / total) * 100), 999);
  const isOver = current > total;
  const barClass = isOver ? 'danger' : 'warn';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="text-fg-dim flex justify-between text-xs">
        <span className={`text-accent font-bold`}>{label}</span>
        <div>
          <span className={isOver ? 'text-red-500 font-bold' : 'text-fg-muted'}>
            {current}
          </span> /
          <span className="text-fg-dim ml-1">
            {total}
          </span>
          <span className="text-fg-muted font-bold ml-1">
            {unit}
          </span>
        </div>
      </div>
      <div className="bg-input flex h-1 overflow-hidden rounded">
        <div
          className={`bar-fill ${barClass}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
