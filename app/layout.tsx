import "@/app/globals.css";

import type { Metadata } from "next";

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
          <div className="flex-1 flex flex-col">
            {children}
          </div>

          {/* FOOTER */}
          <footer className="w-full py-6 mt-10 border-t border-line-accent/30 bg-card/30 flex justify-center items-center font-mono text-[10px] sm:text-xs text-fg-dim tracking-widest uppercase relative z-10 backdrop-blur-sm">
            <div className="flex items-center">
              Made with <span className="text-accent font-bold mx-2">code</span> by 
              <a
                href="https://github.com/devRobots"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-fg hover:text-accent transition-all duration-300 ml-2 relative group"
              >
                devRobots
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </footer>
      </body>
    </html>
  );
}
