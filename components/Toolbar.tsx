'use client';

import dynamic from "next/dynamic";

const ModeToggle = dynamic(() => import("@/components/ModeToggle"), { 
  ssr: false, 
  loading: () => <div style={{ width: 104, height: 28 }} /> 
});

export default function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <ModeToggle />
    </div>
  );
}
