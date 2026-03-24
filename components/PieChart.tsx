'use client';

export default function PieChart({
  cpuPct,
  ramPct,
  size = 180,
  strokeWidth = 18,
}: {
  cpuPct: number;
  ramPct: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius1 = 40;
  const radius2 = 28;
  const circumference1 = 2 * Math.PI * radius1;
  const circumference2 = 2 * Math.PI * radius2;

  const dash1 = `${(cpuPct / 100) * circumference1} ${circumference1}`;
  const dash2 = `${(ramPct / 100) * circumference2} ${circumference2}`;

  const getStrokeClass = (pct: number) => {
    if (pct > 85) return 'text-red-500';
    if (pct > 70) return 'text-yellow-500';
    return 'text-accent';
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="bg-input h-full w-full -rotate-90 transform rounded-full shadow-inner drop-shadow-xl"
      >
        {/* Backgrounds */}
        <circle
          r={radius1}
          cx="50"
          cy="50"
          fill="transparent"
          stroke="currentColor"
          className="text-border"
          strokeWidth={strokeWidth}
        />
        <circle
          r={radius2}
          cx="50"
          cy="50"
          fill="transparent"
          stroke="currentColor"
          className="text-border"
          strokeWidth={strokeWidth}
        />

        {/* Foreground (Used) CPU */}
        <circle
          r={radius1}
          cx="50"
          cy="50"
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={dash1}
          className={`transition-all duration-500 ease-out ${getStrokeClass(cpuPct)}`}
        />

        {/* Foreground (Used) RAM */}
        <circle
          r={radius2}
          cx="50"
          cy="50"
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={dash2}
          className={`transition-all duration-500 ease-out ${getStrokeClass(ramPct)}`}
        />
      </svg>
      {/* Center Label */}
      <div className="text-fg absolute inset-0 flex flex-col items-center justify-center font-mono font-bold">
        <span className="text-xs">
          {cpuPct}%<span className="text-fg-dim text-[8px]">C</span>
        </span>
        <span className="text-xs">
          {ramPct}%<span className="text-fg-dim text-[8px]">R</span>
        </span>
      </div>
    </div>
  );
}
