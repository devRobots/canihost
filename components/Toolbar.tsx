'use client';

import dynamic from "next/dynamic";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ModeToggle = dynamic(() => import("@/components/ModeToggle"), { 
  ssr: false, 
  loading: () => <div style={{ width: 104, height: 28 }} /> 
});

const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), { 
  ssr: false, 
  loading: () => <div className="w-9 h-9" /> 
});

export default function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <ModeToggle />
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
