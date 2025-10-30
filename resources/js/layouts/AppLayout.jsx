import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";

const AppLayout = ({ children }) => {
  const { url, flash, auth } = usePage().props;
  const sidebarRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Une seule section ouverte à la fois
  const [openSection, setOpenSection] = useState(() => {
    if (typeof window === "undefined") return "organisation";

    const saved = window.localStorage.getItem("openSection");
    return saved || "organisation";
  });


  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success, {
        duration: 4000,
        position: "top-right",
      });
    } else if (flash?.error) {
      toast.error(flash.error, {
        duration: 4000,
        position: "top-right",
      });
    }
  }, [flash]);

  // ✅ Persister la section ouverte
  useEffect(() => {
    try {
      localStorage.setItem("openSection", openSection);
    } catch (_) { }
  }, [openSection]);

  // ✅ Restaurer le scroll de la sidebar
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("sidebarScroll");
    if (sidebarRef.current && savedScroll) {
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
      } catch (_) { }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Ouvrir automatiquement la section qui correspond à l'URL
  useEffect(() => {
    if (!url) return;

    if (url.includes("/eleves") || url.includes("/parents") || url.includes("/inscriptions")) {
      setOpenSection("gestionEleves");
    } else if (url.includes("/professeurs") || url.includes("/classes") || url.includes("/matieres") ||
      url.includes("/cycles") || url.includes("/niveaux") || url.includes("/annees-scolaires") ||
      url.includes("/trimestres") || url.includes("/transfert") || url.includes("/historique-transferts")) {
      setOpenSection("organisation");
    } else if (url.includes("/compositions") || url.includes("/notes") || url.includes("/bulletins")) {
      setOpenSection("scolarite");
    } else if (url.includes("/services") || url.includes("/factures") || url.includes("/paiements")) {
      setOpenSection("finances");
    } else if (url.includes("/buses") || url.includes("/itineraires-transports") ||
      url.includes("/arrets") || url.includes("/affectations-transports")) {
      setOpenSection("transport");
    } else if (url.includes("/materiels") || url.includes("/inventaires-classes") ||
      url.includes("/inventaires-enseignants")) {
      setOpenSection("inventaire");
    }
  }, [url]);

  // ✅ Scroll vers le lien actif après navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      const container = sidebarRef.current;
      if (!container) return;

      const active = container.querySelector('[data-active="true"]');
      if (active) {
        const currentScroll = container.scrollTop;
        active.scrollIntoView({ block: "center", behavior: "smooth" });

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
    setOpenSection(prev => prev === key ? "" : key);
  }, []);

  // ✅ CORRECTION : Fonction isActiveLink réparée
  const isActiveLink = (path, exact = false) => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0];

    if (exact) {
      return cleanUrl === path;
    }

    // Pour les liens non-exacts, vérifier si l'URL commence par le chemin
    return cleanUrl.startsWith(path);
  };



  // Composant de lien de navigation
  const NavLink = ({ href, icon, children, exact = false }) => {
    const active = isActiveLink(href, exact);

    const handleClick = () => {
      setSidebarOpen(false);
      window.scrollTo(0, 0);
    };

    return (
      <div data-active={active}>
        <Link
          href={href}
          onClick={handleClick}
          className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
  ${active
              ? "bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-l-4 hover:border-blue-300"
            }`}

        >
          <span className={`mr-3 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-105"
            }`}>
            {icon}
          </span>
          <span className="truncate">{children}</span>
        </Link>
      </div>
    );
  };

  // Composant de section avec accordéon
  const Section = ({ title, icon, sectionKey, children }) => (
    <div className="mb-2">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full px-3 py-3 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-100/80 transition-colors duration-200"
      >
        <div className="flex items-center">
          <span className="mr-3 text-gray-500 text-lg">
            {icon}
          </span>
          <span className="truncate">{title}</span>
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openSection === sectionKey ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {openSection === sectionKey && (
        <div className="mt-1 ml-2 space-y-1 border-l-2 border-gray-200 pl-3">
          {children}
        </div>
      )}
    </div>
  );

  // Icônes simplifiées (emojis pour gagner de l'espace)
  const Icons = {
    Dashboard: "📊",
    Students: "👨‍🎓",
    Organization: "🏢",
    Education: "📚",
    Finance: "💰",
    Transport: "🚌",
    Inventory: "📦",
    Statistics: "📈",
    User: "👤",
    Settings: "⚙️",
    Logout: "🚪"
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

      {/* SIDEBAR RÉDUITE */}
      <aside
        className={`fixed inset-y-0 left-0 z-50  bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Sidebar compact */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">🏫</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 truncate">École Primaire</h1>
                  <p className="text-xs text-gray-500 truncate">Gestion Scolaire</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation compacte */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div
              ref={sidebarRef}
              className="h-full overflow-y-auto custom-scrollbar"
            >
              <nav className="p-3 space-y-1">
                <NavLink href="/dashboard" exact icon={Icons.Dashboard}>
                  Tableau de bord
                </NavLink>

                <Section title="Élèves" icon={Icons.Students} sectionKey="gestionEleves">
                  <NavLink href="/eleves" icon="👧">
                    Élèves
                  </NavLink>
                  <NavLink href="/parents" icon="👨‍👩‍👧">
                    Parents
                  </NavLink>
                  <NavLink href="/inscriptions" icon="📝">
                    Inscriptions
                  </NavLink>
                </Section>

                <Section title="Organisation" icon={Icons.Organization} sectionKey="organisation">
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
                    Années
                  </NavLink>
                  <NavLink href="/trimestres" icon="🕒">
                    Trimestres
                  </NavLink>
                  <NavLink href="/transfert" icon="🔄">
                    Transfert
                  </NavLink>
                  <NavLink href="/historique-transferts" icon="📋">
                    Historique
                  </NavLink>
                </Section>

                <Section title="Scolarité" icon={Icons.Education} sectionKey="scolarite">
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

                <Section title="Finances" icon={Icons.Finance} sectionKey="finances">
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

                <Section title="Transport" icon={Icons.Transport} sectionKey="transport">
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

                <Section title="Inventaire" icon={Icons.Inventory} sectionKey="inventaire">
                  <NavLink href="/materiels" icon="📦">
                    Matériels
                  </NavLink>
                  <NavLink href="/inventaires-classes" icon="🏫">
                    Classes
                  </NavLink>
                  <NavLink href="/inventaires-enseignants" icon="👨‍🏫">
                    Enseignants
                  </NavLink>
                </Section>

                <NavLink href="/statistiques" icon={Icons.Statistics}>
                  Statistiques
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Profil utilisateur compact */}
          <div className="flex-shrink-0 border-t border-gray-200/50 p-3">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center w-full p-2 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors group"
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <span className="text-white font-bold text-xs">
                      {auth?.user?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                </div>
                <div className="ml-2 text-left flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {auth?.user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {auth?.user?.role || 'Admin'}
                  </p>
                </div>
                <svg
                  className={`h-3 w-3 text-gray-400 transition-transform duration-200 flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200/50 py-1 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="text-lg mr-2">{Icons.User}</span>
                    <span className="text-xs">Mon Profil</span>
                  </Link>
                  <Link
                    href="/parametres"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="text-lg mr-2">{Icons.Settings}</span>
                    <span className="text-xs">Paramètres</span>
                  </Link>
                  <div className="border-t border-gray-200/50 my-1"></div>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="text-lg mr-2">{Icons.Logout}</span>
                    <span className="text-xs">Déconnexion</span>
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
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors mr-3"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {getPageTitle(url)}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Bienvenue, {auth?.user?.name || "Administrateur"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-1.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 0-6 6v2.25l-2.47 2.47a.75.75 0 0 0 .53 1.28h15.88a.75.75 0 0 0 .53-1.28L16.5 12V9.75a6 6 0 0 0-6-6z" />
                </svg>
                <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
              </button>

              {/* Quick Stats compactes */}
              <div className="hidden md:flex items-center space-x-4 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">1,248</div>
                  <div className="text-gray-500">Élèves</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">64</div>
                  <div className="text-gray-500">Profs</div>
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
          <div className="p-4 lg:p-6 fade-in">
            {children}
          </div>
        </main>
        {/* Conteneur des toasts */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4200,
            className: "shadow-xl border border-gray-100 backdrop-blur-md font-medium",
            style: {
              background: "rgba(255,255,255,0.95)",
              color: "#1F2937",
              borderRadius: "14px",
              padding: "14px 18px",
              fontSize: "0.95rem",
              lineHeight: 1.4,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              animation: "toastSlideIn 0.35s ease, toastFadeOut 0.4s ease 3.8s forwards",
            },
            success: {
              icon: "✅",
              style: {
                borderLeft: "5px solid #10B981",
                background: "linear-gradient(to right, #ECFDF5, #D1FAE5)",
              },
            },
            error: {
              icon: "❌",
              style: {
                borderLeft: "5px solid #EF4444",
                background: "linear-gradient(to right, #FEF2F2, #FEE2E2)",
              },
            },
            warning: {
              icon: "⚠️",
              style: {
                borderLeft: "5px solid #F59E0B",
                background: "linear-gradient(to right, #FFFBEB, #FEF3C7)",
              },
            },
            info: {
              icon: "ℹ️",
              style: {
                borderLeft: "5px solid #3B82F6",
                background: "linear-gradient(to right, #EFF6FF, #DBEAFE)",
              },
            },
          }}
          containerStyle={{
            top: 16,
            right: 16,
          }}
        />


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
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

// Titre de page selon l'URL
const getPageTitle = (url) => {
  if (!url) return "Tableau de Bord";

  const pages = {
    "/dashboard": "Tableau de Bord",
    "/eleves": "Élèves",
    "/parents": "Parents",
    "/inscriptions": "Inscriptions",
    "/professeurs": "Professeurs",
    "/classes": "Classes",
    "/matieres": "Matières",
    "/cycles": "Cycles",
    "/niveaux": "Niveaux",
    "/annees-scolaires": "Années Scolaires",
    "/trimestres": "Trimestres",
    "/transfert": "Transfert d'Année",
    "/historique-transferts": "Historique Transferts",
    "/compositions": "Compositions",
    "/notes": "Notes",
    "/notes/multiple/create": "Saisie Groupée",
    "/bulletins": "Bulletins",
    "/services": "Services",
    "/factures": "Factures",
    "/paiements": "Paiements",
    "/buses": "Bus",
    "/itineraires-transports": "Itinéraires",
    "/arrets": "Arrêts",
    "/affectations-transports": "Affectations Transport",
    "/materiels": "Matériels",
    "/inventaires-classes": "Inventaire Classes",
    "/inventaires-enseignants": "Inventaire Enseignants",
    "/statistiques": "Statistiques",
    "/profile": "Mon Profil",
    "/parametres": "Paramètres",
  };

  const cleanUrl = url.split('?')[0];

  if (pages[cleanUrl]) {
    return pages[cleanUrl];
  }

  for (const [path, title] of Object.entries(pages)) {
    if (cleanUrl.startsWith(path)) {
      return title;
    }
  }

  return "Tableau de Bord";
};

export default AppLayout;