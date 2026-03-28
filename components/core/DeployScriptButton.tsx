'use client';

import { App } from '@prisma/client';
import { Terminal } from 'lucide-react';
import React from 'react';

interface Props {
  apps: App[];
  children: React.ReactNode;
  className?: string;
}

export default function DeployScriptButton({ apps, children, className = '' }: Props) {
  const handleGenerate = () => {
    const appNames = apps.map(a => a.name).join(', ');
    const script = `#!/bin/bash
# Auto-generated deployment script for: ${appNames}
# Created via CanIHost.tech

echo "🚀 Starting deployment for ${apps.length} apps..."

${apps.map(app => `
# --- Deploying ${app.name} ---
# Resources: ${app.minCPU} CPU, ${app.minRAM}GB RAM
# TODO: Add specific deployment logic for ${app.name} here
`).join('\n')}

echo "✅ Deployment complete!"
`;

    const blob = new Blob([script], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deploy-${apps.length}-apps.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleGenerate}
      className={`btn-terminal group relative flex items-center justify-center gap-2 overflow-hidden px-6 py-3 text-xs font-black uppercase tracking-widest ring-1 ring-accent transition-all hover:bg-accent hover:text-bg ${className}`}
    >
      <Terminal size={14} className="transition-transform group-hover:rotate-12" />
      {children}
      
      {/* Decorative corners */}
      <span className="absolute left-0 top-0 h-1 w-1 border-l border-t border-accent opacity-0 group-hover:opacity-100" />
      <span className="absolute right-0 top-0 h-1 w-1 border-r border-t border-accent opacity-0 group-hover:opacity-100" />
      <span className="absolute bottom-0 left-0 h-1 w-1 border-l border-b border-accent opacity-0 group-hover:opacity-100" />
      <span className="absolute bottom-0 right-0 h-1 w-1 border-r border-b border-accent opacity-0 group-hover:opacity-100" />
    </button>
  );
}
