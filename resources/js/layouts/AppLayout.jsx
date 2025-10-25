import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, usePage } from "@inertiajs/react";

/**
 * Layout principal — Inertia React
 * - Surligne le lien actif
 * - Conserve le scroll de la sidebar
 * - Ouvre la bonne section selon l'URL
 * - Scroll vers le lien actif après navigation
 */
const AppLayout = ({ children }) => {
  const { url, flash, auth } = usePage().props;
  const sidebarRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Sections ouvertes/fermées (persistées en localStorage)
  const [openSections, setOpenSections] = useState(() => {
    if (typeof window === "undefined") {
      return {
        gestionEleves: true,
        organisation: true,
        scolarite: true,
        finances: true,
        transport: true,
      };
    }
    const saved = window.localStorage.getItem("openSections");
    return (
      (saved && JSON.parse(saved)) || {
        gestionEleves: true,
        organisation: true,
        scolarite: true,
        finances: true,
        transport: true,
      }
    );
  });

  // ✅ Persister l'état des sections
  useEffect(() => {
    try {
      localStorage.setItem("openSections", JSON.stringify(openSections));
    } catch (_) {}
  }, [openSections]);

  // ✅ Restaurer le scroll de la sidebar (si présent)
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("sidebarScroll");
    if (sidebarRef.current && savedScroll) {
      // Petit délai pour s'assurer que le DOM est prêt
      setTimeout(() => {
        sidebarRef.current.scrollTop = parseInt(savedScroll, 10) || 0;
      }, 50);
    }
  }, []);

  // ✅ Sauvegarder le scroll pendant qu'on scrolle
  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    
    const onScroll = () => {
      try {
        sessionStorage.setItem("sidebarScroll", String(el.scrollTop));
      } catch (_) {}
    };
    
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Ouvrir automatiquement la section qui correspond à l'URL
  useEffect(() => {
    if (!url) return;
    
    setOpenSections((prev) => ({
      ...prev,
      transport:
        prev.transport ||
        url.includes("/buses") ||
        url.includes("/itineraires-transports") ||
        url.includes("/arrets") ||
        url.includes("/affectations-transports"),
      finances:
        prev.finances ||
        url.includes("/services") ||
        url.includes("/factures") ||
        url.includes("/paiements"),
      gestionEleves:
        prev.gestionEleves ||
        url.includes("/eleves") ||
        url.includes("/parents") ||
        url.includes("/inscriptions"),
      organisation:
        prev.organisation ||
        url.includes("/professeurs") ||
        url.includes("/classes") ||
        url.includes("/matieres") ||
        url.includes("/cycles") ||
        url.includes("/niveaux") ||
        url.includes("/annees-scolaires") ||
        url.includes("/trimestres"),
      scolarite:
        prev.scolarite ||
        url.includes("/compositions") ||
        url.includes("/notes") ||
        url.includes("/bulletins"),
    }));
  }, [url]);

  // ✅ Scroll vers le lien actif après navigation - CORRIGÉ
  useEffect(() => {
    const timer = setTimeout(() => {
      const container = sidebarRef.current;
      if (!container) return;
      
      const active = container.querySelector('[data-active="true"]');
      if (active) {
        // Sauvegarder la position actuelle
        const currentScroll = container.scrollTop;
        
        // Scroll vers l'élément actif
        active.scrollIntoView({ block: "center", behavior: "smooth" });
        
        // Restaurer partiellement la position si le scroll est trop important
        setTimeout(() => {
          const newScroll = container.scrollTop;
          if (Math.abs(newScroll - currentScroll) > 300) {
            container.scrollTop = currentScroll + 150;
          }
        }, 100);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [url, sidebarOpen]);

  const toggleSection = useCallback((key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Helpers
  const isActiveLink = (path, exact = false) => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0];
    return exact ? cleanUrl === path : cleanUrl.startsWith(path);
  };

  const FlashMessages = () => {
    if (!flash) return null;
    return (
      <>
        {flash?.success && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 animate-fade-in shadow-sm">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="ml-3 text-sm font-medium text-green-800">
                {flash.success}
              </p>
            </div>
          </div>
        )}
        {flash?.error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 animate-fade-in shadow-sm">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-red-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="ml-3 text-sm font-medium text-red-800">
                {flash.error}
              </p>
            </div>
          </div>
        )}
      </>
    );
  };

  // Composant de lien de navigation
  const NavLink = ({ href, icon, children, exact = false }) => {
    const active = isActiveLink(href, exact);
    
    const handleClick = () => {
      setSidebarOpen(false);
      // Scroll vers le haut de la page principale
      window.scrollTo(0, 0);
    };

    return (
      <div data-active={active}>
        <Link
          href={href}
          onClick={handleClick}
          className={`group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
            active
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
          }`}
        >
          <div className="flex items-center">
            <span className={`mr-3 transition-transform duration-200 ${
              active ? "scale-110" : "group-hover:scale-105"
            }`}>
              {icon}
            </span>
            {children}
          </div>
        </Link>
      </div>
    );
  };

  // Composant de section
  const Section = ({ title, icon, openKey, children }) => (
    <div className="mb-4">
      <button
        onClick={() => toggleSection(openKey)}
        className="flex items-center justify-between w-full px-3 py-3 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-100/80 transition-colors duration-200"
      >
        <div className="flex items-center">
          <span className="mr-3 text-gray-500">
            {icon}
          </span>
          {title}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            openSections[openKey] ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {openSections[openKey] && (
        <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
          {children}
        </div>
      )}
    </div>
  );

  // Icônes SVG pour une meilleure cohérence
  const Icons = {
    Dashboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    Students: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    Organization: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    Education: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    Finance: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Transport: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    Statistics: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    User: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    Settings: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    Logout: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    )
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Sidebar */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">🏫</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">École Primaire</h1>
                  <p className="text-xs text-gray-500">Gestion Scolaire</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div 
              ref={sidebarRef}
              className="h-full overflow-y-auto custom-scrollbar"
            >
              <nav className="p-4 space-y-2">
                <NavLink href="/dashboard" exact icon={Icons.Dashboard}>
                  Tableau de bord
                </NavLink>

                <Section title="Gestion des Élèves" icon={Icons.Students} openKey="gestionEleves">
                  <NavLink href="/eleves" icon="👧">
                    Liste des élèves
                  </NavLink>
                  <NavLink href="/parents" icon="👨‍👩‍👧">
                    Parents d'élèves
                  </NavLink>
                  <NavLink href="/inscriptions" icon="📝">
                    Inscriptions
                  </NavLink>
                </Section>

                <Section title="Organisation" icon={Icons.Organization} openKey="organisation">
                  <NavLink href="/professeurs" icon="👩‍🏫">
                    Professeurs
                  </NavLink>
                  <NavLink href="/classes" icon="🏠">
                    Classes
                  </NavLink>
                  <NavLink href="/matieres" icon="📚">
                    Matières
                  </NavLink>
                  <NavLink href="/cycles" icon="🔁">
                    Cycles
                  </NavLink>
                  <NavLink href="/niveaux" icon="📈">
                    Niveaux
                  </NavLink>
                  <NavLink href="/annees-scolaires" icon="🗓️">
                    Années scolaires
                  </NavLink>
                  <NavLink href="/trimestres" icon="🕒">
                    Trimestres
                  </NavLink>
                </Section>

                <Section title="Scolarité" icon={Icons.Education} openKey="scolarite">
                  <NavLink href="/compositions" icon="🧾">
                    Compositions
                  </NavLink>
                  <NavLink href="/notes" icon="🧮">
                    Notes
                  </NavLink>
                  <NavLink href="/notes/multiple/create" exact icon="✏️">
                    Saisie groupée
                  </NavLink>
                  <NavLink href="/bulletins" icon="📊">
                    Bulletins
                  </NavLink>
                </Section>

                <Section title="Finances" icon={Icons.Finance} openKey="finances">
                  <NavLink href="/services" icon="🛠️">
                    Services
                  </NavLink>
                  <NavLink href="/factures" icon="🧾">
                    Factures
                  </NavLink>
                  <NavLink href="/paiements" icon="💳">
                    Paiements
                  </NavLink>
                </Section>

                <Section title="Transport" icon={Icons.Transport} openKey="transport">
                  <NavLink href="/buses" icon="🚍">
                    Bus
                  </NavLink>
                  <NavLink href="/itineraires-transports" icon="🗺️">
                    Itinéraires
                  </NavLink>
                  <NavLink href="/arrets" icon="📍">
                    Arrêts
                  </NavLink>
                  <NavLink href="/affectations-transports" icon="👥">
                    Affectations
                  </NavLink>
                </Section>

                <NavLink href="/statistiques" icon={Icons.Statistics}>
                  Statistiques
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Profil utilisateur */}
          <div className="flex-shrink-0 border-t border-gray-200/50 p-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center w-full p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors group"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <span className="text-white font-bold text-sm">
                      {auth?.user?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                </div>
                <div className="ml-3 text-left flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {auth?.user?.name || 'Administrateur'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {auth?.user?.role || 'Administrateur'}
                  </p>
                </div>
                <svg 
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200/50 py-2 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSidebarOpen(false);
                    }}
                  >
                    {Icons.User}
                    <span className="ml-3">Mon Profil</span>
                  </Link>
                  <Link
                    href="/parametres"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSidebarOpen(false);
                    }}
                  >
                    {Icons.Settings}
                    <span className="ml-3">Paramètres</span>
                  </Link>
                  <div className="border-t border-gray-200/50 my-1"></div>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSidebarOpen(false);
                    }}
                  >
                    {Icons.Logout}
                    <span className="ml-3">Déconnexion</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors mr-4"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {getPageTitle(url)}
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Bienvenue, {auth?.user?.name || "Administrateur"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 0-6 6v2.25l-2.47 2.47a.75.75 0 0 0 .53 1.28h15.88a.75.75 0 0 0 .53-1.28L16.5 12V9.75a6 6 0 0 0-6-6z" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">1,248</div>
                  <div className="text-gray-500">Élèves</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">64</div>
                  <div className="text-gray-500">Professeurs</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">24</div>
                  <div className="text-gray-500">Classes</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 min-h-0 overflow-auto custom-scrollbar">
          <div className="p-4 lg:p-8 fade-in">
            <FlashMessages />
            {children}
          </div>
        </main>
      </div>

      {/* Styles */}
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>

      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

// 🧭 Titre de page selon l'URL - CORRIGÉ
const getPageTitle = (url) => {
  if (!url) return "Tableau de Bord";
  
  const pages = {
    "/dashboard": "Tableau de Bord",
    "/eleves": "Gestion des Élèves",
    "/parents": "Parents d'Élèves",
    "/inscriptions": "Inscriptions",
    "/professeurs": "Gestion des Professeurs",
    "/classes": "Gestion des Classes",
    "/matieres": "Gestion des Matières",
    "/cycles": "Gestion des Cycles",
    "/niveaux": "Gestion des Niveaux",
    "/annees-scolaires": "Années Scolaires",
    "/trimestres": "Gestion des Trimestres",
    "/compositions": "Compositions",
    "/notes": "Gestion des Notes",
    "/notes/multiple/create": "Saisie Groupée des Notes",
    "/bulletins": "Bulletins Scolaires",
    "/services": "Services et Tarifs",
    "/factures": "Gestion des Factures",
    "/paiements": "Paiements",
    "/buses": "Gestion des Bus", // ✅ Correction ici
    "/itineraires-transports": "Itinéraires de Transport",
    "/arrets": "Arrêts de Bus",
    "/affectations-transports": "Affectations de Transport", // ✅ Correction ici
    "/statistiques": "Statistiques et Rapports",
    "/profile": "Mon Profil",
    "/parametres": "Paramètres",
  };

  // Nettoyer l'URL des paramètres
  const cleanUrl = url.split('?')[0];
  
  // Vérifier d'abord les correspondances exactes
  if (pages[cleanUrl]) {
    return pages[cleanUrl];
  }
  
  // Ensuite vérifier les correspondances par préfixe
  for (const [path, title] of Object.entries(pages)) {
    if (cleanUrl.startsWith(path)) {
      return title;
    }
  }

  return "Tableau de Bord";
};

export default AppLayout;