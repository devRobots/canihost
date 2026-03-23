import type { Metadata } from "next";
import "@/app/globals.css";
import Toolbar from "@/components/Toolbar";

export const metadata: Metadata = {
  title: "CanIHost.tech",
  description: "Check what services can run on your Machine or VPS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="scanlines min-h-screen flex flex-col">
          {/* NAV */}
          <nav
            className="sticky top-0 z-50 w-full"
            style={{
              background: 'var(--bg)',
              borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--accent)', fontSize: 18, fontWeight: 700 }}>▶</span>
                <span
                  className="font-bold tracking-widest text-sm uppercase glow-text"
                  style={{ color: 'var(--fg)', letterSpacing: '0.12em' }}
                >
                  CanIHost<span style={{ color: 'var(--accent)' }}>.tech</span>
                </span>
              </div>

              {/* Toolbar */}
              <Toolbar />
            </div>
          </nav>

          {/* CONTENT */}
          <div className="flex-1 flex flex-col">
            {children}
          </div>
      </body>
    </html>
  );
}
