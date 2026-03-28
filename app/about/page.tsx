'use client';

import { Box, Cpu, HardDrive, List, Server, Terminal } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<string>('problema');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    // Configuramos el IntersectionObserver para detectar qué sección está en el viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      // Usamos rootMargin para que active la sección cuando llega cerca al top
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="bg-page flex min-h-screen flex-col font-mono text-fg">
      <main className="container mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Main Content Column */}
          <div className="flex-1 space-y-12 lg:w-3/4">
            {/* Header */}
            <div className="border-b border-border pb-8 text-center sm:text-left">
              <h1 className="glow-text text-accent mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                <span className="prompt"></span> Sobre CanIHost
              </h1>
              <p className="text-fg text-lg leading-relaxed opacity-90">
                Nuestra misión es devolverle el control a los entusiastas del self-hosting, eliminando la incertidumbre a la hora de desplegar aplicaciones.
              </p>
            </div>

            {/* Motivation Section */}
            <section id="problema" className="card scroll-mt-24 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-border pb-4">
                <Server className="text-accent h-8 w-8" />
                <h2 className="text-2xl font-semibold text-fg">El problema del Self-Hosting</h2>
              </div>
              <div className="text-fg space-y-4 leading-relaxed opacity-90">
                <p>
                  Autohospedar (self-host) tus propios servicios es una experiencia increíble que te otorga total soberanía sobre tus datos. Sin embargo, cuando empiezas a desplegar grupos de aplicaciones simultáneamente, el proceso se vuelve rápidamente caótico.
                </p>
                <p>
                  El mayor obstáculo es <strong className="font-bold text-fg">desconocer los requerimientos y límites reales</strong> de cada servicio antes de instalarlo. ¿Qué sucede cuando despliegas Nextcloud, Jellyfin y un servidor de bases de datos al mismo tiempo sin planificar los recursos?
                </p>
                <ul className="mb-4 mt-2 list-inside list-disc space-y-2 text-fg">
                  <li>
                    <strong className="text-accent font-medium">Cuelgues inesperados:</strong> La memoria RAM se agota (Out-Of-Memory) tirando todos tus servicios abruptamente.
                  </li>
                  <li>
                    <strong className="text-accent font-medium">Gasto innecesario:</strong> Terminas alquilando un servidor mucho más potente (y costoso) de lo que realmente necesitas por miedo a quedarte corto.
                  </li>
                  <li>
                    <strong className="text-accent font-medium">Sub-aprovisionamiento:</strong> Tus aplicaciones se vuelven exasperantemente lentas e inestables porque el hardware simplemente no da abasto.
                  </li>
                </ul>
                <p>
                  CanIHost nace exactamente para resolver este dolor de cabeza: permitirte saber con certeza qué puedes correr y dónde, sin sorpresas, antes de escribir tu primer comando.
                </p>
              </div>
            </section>

            {/* Docker Compose / Architecture Section */}
            <section id="docker-compose" className="card scroll-mt-24 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4 border-b border-border pb-4">
                <Box className="text-accent2 h-8 w-8" />
                <h2 className="text-2xl font-semibold text-fg">El poder de Docker Compose</h2>
              </div>
              <div className="text-fg space-y-4 leading-relaxed opacity-90">
                <p>
                  Para lograr despliegues robustos y reproducibles, nos apoyamos en <strong>Docker Compose</strong>. Es una herramienta estándar de la industria, ampliamente conocida y utilizada por desarrolladores de todo el mundo para orquestar y administrar aplicaciones que dependen de múltiples contenedores.
                </p>
                <p>
                  Se usa constantemente en la comunidad porque, con un simple archivo YAML, puedes interconectar aplicaciones con bases de datos y redes internas (como un frontal web junto a un Redis y un PostgreSQL) sin enredos.
                  <strong> ¿Y por qué lo usamos aquí?</strong> Porque es la forma ideal de entregarte una configuración estructurada, limpia y completamente funcional, evitando errores humanos de mapeo de puertos y volúmenes a la hora de desplegar tu stack.
                </p>
                <div className="bg-input border-line my-5 shadow-inner rounded p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-medium text-fg">
                    <Terminal className="text-accent h-[18px] w-[18px]" /> ¿Cómo construimos tu Compose?
                  </h3>
                  <p className="text-sm">
                    Detrás de escena, CanIHost no se inventa los datos. La aplicación se conecta directamente a la{' '}
                    <a
                      href="https://docs.docker.com/registry/spec/api/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      API de Docker Registry V2
                    </a>{' '}
                    para leer la metadata real de las imágenes. Extraemos configuraciones clave como puertos expuestos, volúmenes requeridos y variables de entorno directamente desde la fuente para generar un <code>docker-compose.yml</code> preciso y listo para usar en tu servidor.
                  </p>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Cubepath integration */}
              <section id="despliegue-nube" className="card scroll-mt-24 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <HardDrive className="text-accent h-6 w-6" />
                  <h2 className="text-xl font-semibold text-fg">Despliegue rápido en la nube</h2>
                </div>
                <p className="text-fg mb-3 leading-relaxed opacity-90">
                  Sabemos que armar, configurar y mantener tu propio servidor físico en casa o utilizar la consola puede resultar intimidante. Para solucionar esto y hacer el self-hosting accesible a todos, decidí integrar la posibilidad de desplegar aplicaciones directamente en los VPS de <strong>Cubepath</strong>.
                </p>
                <p className="text-fg mb-3 leading-relaxed opacity-90">
                  Los usuarios menos experimentados pueden aprovisionar sus aplicaciones validadas con unos pocos clics.
                </p>
              </section>

              {/* Mini PCs */}
              <section id="mini-pcs" className="card scroll-mt-24 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Cpu className="text-accent2 h-6 w-6" />
                  <h2 className="text-xl font-semibold text-fg">Hardware: MINI PCs</h2>
                </div>
                <p className="text-fg leading-relaxed opacity-90">
                  Si prefieres la ruta genuina de tener tu propio hardware local, el simulador de recursos está a tu disposición. Los modelos de <strong>MINI PCs</strong> que evaluamos y recomendamos en la plataforma no han sido puestos al azar.
                </p>
                <p className="text-fg mt-4 leading-relaxed opacity-90">
                  Estos equipos corresponden a algunos de los perfiles más populares, eficientes y probados del mercado actual para el <em>self-hosting</em>. Ofrecen el equilibrio perfecto entre bajo consumo de energía (ideal para funcionar 24/7), factor de forma super reducido y potencia de sobra para gestionar tus contenedores sin sudar.
                </p>
              </section>
            </div>
          </div>

          {/* Sticky Sidebar Right */}
          <aside className="relative lg:w-1/4 lg:shrink-0 lg:pl-4 hidden lg:block">
            <div className="bg-card border-line sticky top-24 rounded p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-fg">
                <List className="text-accent h-5 w-5" /> Índice
              </h2>
              <ul className="text-fg-muted flex flex-col gap-4 text-sm font-medium">
                <li>
                  <a
                    href="#problema"
                    className={`transition-all duration-300 block border-l-2 pl-3 py-1 ${
                      activeSection === 'problema'
                        ? 'border-accent text-accent font-bold scale-105 origin-left'
                        : 'border-transparent hover:border-accent/40 hover:text-fg'
                    }`}
                  >
                    El Problema del Self-Hosting
                  </a>
                </li>
                <li>
                  <a
                    href="#docker-compose"
                    className={`transition-all duration-300 block border-l-2 pl-3 py-1 ${
                      activeSection === 'docker-compose'
                        ? 'border-accent text-accent font-bold scale-105 origin-left'
                        : 'border-transparent hover:border-accent/40 hover:text-fg'
                    }`}
                  >
                    El Poder de Docker Compose
                  </a>
                </li>
                <li>
                  <a
                    href="#despliegue-nube"
                    className={`transition-all duration-300 block border-l-2 pl-3 py-1 ${
                      activeSection === 'despliegue-nube'
                        ? 'border-accent text-accent font-bold scale-105 origin-left'
                        : 'border-transparent hover:border-accent/40 hover:text-fg'
                    }`}
                  >
                    Despliegue Rápido en la Nube
                  </a>
                </li>
                <li>
                  <a
                    href="#mini-pcs"
                    className={`transition-all duration-300 block border-l-2 pl-3 py-1 ${
                      activeSection === 'mini-pcs'
                        ? 'border-accent text-accent font-bold scale-105 origin-left'
                        : 'border-transparent hover:border-accent/40 hover:text-fg'
                    }`}
                  >
                    Hardware: MINI PCs
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
