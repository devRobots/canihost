import React, { useEffect, useState } from 'react';

interface Props {
  showBarelyUsable: boolean;
  showUnsupported: boolean;
}

const SECTIONS = [
  'section-bundles',
  'section-recommended',
  'section-barely-usable',
  'section-unsupported',
];

export default function RecommendationsSidebar({
  showBarelyUsable,
  showUnsupported,
}: Props) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -80% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [showBarelyUsable, showUnsupported]);

  const getLinkClassName = (sectionId: string) => {
    const isActive = activeSection === sectionId;
    return `text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
      isActive
        ? 'text-accent translate-x-1'
        : 'text-fg-muted hover:text-accent opacity-70 hover:opacity-100'
    }`;
  };

  return (
    <aside className="border-border/50 sticky top-24 hidden w-64 shrink-0 flex-col gap-10 border-l pl-8 xl:flex">
      <div className="flex flex-col gap-8">
        {/* Collections Section */}
        <div className="flex flex-col gap-4">
          <div className="text-fg-muted flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase opacity-70">
            <span className="text-accent">{'//'}</span>
            Bundles
          </div>
          <div className="flex flex-col gap-2 relative">
            <a
              href="#section-bundles"
              className={getLinkClassName('section-bundles') + ' relative'}
            >
              Recommended
              {activeSection === 'section-bundles' && (
                <span className="absolute -left-4 h-3 w-1 bg-accent rounded-full transition-all"></span>
              )}
            </a>
          </div>
        </div>

        {/* Apps Section */}
        <div className="flex flex-col gap-4">
          <div className="text-fg-muted flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase opacity-70">
            <span className="text-accent">{'//'}</span>
            Applications
          </div>
          <div className="flex flex-col gap-2 relative">
            <a
              href="#section-recommended"
              className={getLinkClassName('section-recommended') + ' relative'}
            >
              Recommended
              {activeSection === 'section-recommended' && (
                <span className="absolute -left-4 h-3 w-1 bg-accent rounded-full transition-all"></span>
              )}
            </a>
            {showBarelyUsable && (
              <a
                href="#section-barely-usable"
                className={getLinkClassName('section-barely-usable') + ' relative'}
              >
                Barely usable
                {activeSection === 'section-barely-usable' && (
                  <span className="absolute -left-4 h-3 w-1 bg-accent rounded-full transition-all"></span>
                )}
              </a>
            )}
            {showUnsupported && (
              <a
                href="#section-unsupported"
                className={getLinkClassName('section-unsupported') + ' relative'}
              >
                Unsupported
                {activeSection === 'section-unsupported' && (
                  <span className="absolute -left-8 h-3 w-1 bg-accent rounded-full transition-all"></span>
                )}
              </a>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
