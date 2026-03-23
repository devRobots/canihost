'use client';

export default function PieChart({
  used,
  total,
  colorClass = 'accent',
}: {
  used: number;
  total: number;
  colorClass?: 'accent' | 'warn' | 'danger';
}) {
  const percentage = Math.min(Math.round((used / total) * 100), 100);
  
  // Calculate SVG stroke dashes for a pie chart effect
  // Circle circumference: 2 * pi * r. With r=15.9155, C = ~100
  const radius = 15.9155;
  const circumference = 100;
  const strokeDasharray = `${percentage} ${circumference - percentage}`;

  let strokeColor = 'var(--accent)';
  if (colorClass === 'warn') strokeColor = 'var(--yellow)';
  if (colorClass === 'danger') strokeColor = 'var(--red)';

  return (
    <div className="relative w-16 h-16 shrink-0" title={`${percentage}% used`}>
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full transform -rotate-90 rounded-full"
        style={{
          background: 'var(--bg-input)',
          boxShadow: `inset 0 0 8px rgba(0,0,0,0.5), 0 0 10px ${
            colorClass === 'accent' ? 'var(--accent-glow)' : 'transparent'
          }`,
        }}
      >
        {/* Background Circle */}
        <circle r={radius} cx="16" cy="16" fill="transparent" stroke="var(--border)" strokeWidth="3" />
        {/* Foreground (Used) Circle */}
        <circle
          r={radius}
          cx="16"
          cy="16"
          fill="transparent"
          stroke={strokeColor}
          strokeWidth="3"
          strokeDasharray={strokeDasharray}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      {/* Center Label (terminal vibe) */}
      <div
        className="absolute inset-0 flex items-center justify-center font-bold text-[10px]"
        style={{ color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}
      >
        {percentage}%
      </div>
    </div>
  );
}
