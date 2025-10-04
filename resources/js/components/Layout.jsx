import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const Layout = ({ children, title }) => {
    const { url } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Tableau de bord', href: '/', icon: '📊', current: url === '/' },
        { name: 'Élèves', href: route('eleves.index'), icon: '👨‍🎓', current: url.startsWith('/eleves') },
        { name: 'Parents', href: route('parent-eleves.index'), icon: '👨‍👩‍👧‍👦', current: url.startsWith('/parent-eleves') },
        { name: 'Professeurs', href: route('professeurs.index'), icon: '👨‍🏫', current: url.startsWith('/professeurs') },
        { name: 'Classes', href: route('classes.index'), icon: '🏫', current: url.startsWith('/classes') },
        { name: 'Inscriptions', href: route('inscriptions.index'), icon: '📝', current: url.startsWith('/inscriptions') },
        { name: 'Niveaux', href: route('niveaux.index'), icon: '📚', current: url.startsWith('/niveaux') },
        { name: 'Cycles', href: route('cycles.index'), icon: '🔄', current: url.startsWith('/cycles') },
        { name: 'Années Scolaires', href: route('annees.index'), icon: '📅', current: url.startsWith('/annees') },
        { name: 'Trimestres', href: route('trimestres.index'), icon: '📋', current: url.startsWith('/trimestres') },
    ];

    return (
        <>
            {/* Styles CSS pour résoudre les problèmes de visibilité */}
            <style jsx global>{`
                /* Assurer la visibilité du texte sur tous les fonds */
                .text-white {
                    color: #ffffff !important;
                }
                
                .text-gray-900 {
                    color: #111827 !important;
                }
                
                .text-gray-700 {
                    color: #374151 !important;
                }
                
                .text-gray-600 {
                    color: #4b5563 !important;
                }
                
                .text-gray-500 {
                    color: #6b7280 !important;
                }
                
                /* Boutons avec contraste suffisant */
                .bg-blue-600 {
                    background-color: #2563eb !important;
                }
                
                .bg-green-600 {
                    background-color: #059669 !important;
                }
                
                .bg-red-600 {
                    background-color: #dc2626 !important;
                }
                
                .bg-indigo-600 {
                    background-color: #4f46e5 !important;
                }
                
                .bg-purple-600 {
                    background-color: #7c3aed !important;
                }
                
                .bg-teal-600 {
                    background-color: #0d9488 !important;
                }
                
                .bg-amber-600 {
                    background-color: #d97706 !important;
                }
                
                /* États de survol */
                .hover\:bg-blue-700:hover {
                    background-color: #1d4ed8 !important;
                }
                
                .hover\:bg-green-700:hover {
                    background-color: #047857 !important;
                }
                
                .hover\:bg-red-700:hover {
                    background-color: #b91c1c !important;
                }
                
                .hover\:bg-indigo-700:hover {
                    background-color: #4338ca !important;
                }
                
                .hover\:bg-purple-700:hover {
                    background-color: #6d28d9 !important;
                }
                
                .hover\:bg-teal-700:hover {
                    background-color: #0f766e !important;
                }
                
                .hover\:bg-amber-700:hover {
                    background-color: #b45309 !important;
                }

                /* Couleurs pour les inscriptions */
                .bg-cyan-600 {
                    background-color: #0891b2 !important;
                }
                
                .hover\:bg-cyan-700:hover {
                    background-color: #0e7490 !important;
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Navigation principale */}
                <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-3">
                            {/* Logo */}
                            <Link
                                href="/"
                                className="flex items-center space-x-3 group"
                            >
                                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                                    <span className="text-white font-bold text-lg">🎓</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                        EduManager
                                    </span>
                                    <span className="text-xs text-gray-500 -mt-1">Système Académique</span>
                                </div>
                            </Link>

                            {/* Navigation desktop */}
                            <div className="hidden lg:flex items-center space-x-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${item.current
                                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-inner'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'
                                            }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-gray-900">{item.name}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/60">
                            <div className="px-4 py-3 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${item.current
                                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="text-gray-900">{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>

                {/* En-tête de page avec titre */}
                {title && (
                    <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border-b border-blue-200/30">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white text-xl">📝</span>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                                        <p className="text-gray-600 mt-1">
                                            {title === 'Inscriptions' && 'Gérez les inscriptions des élèves aux classes'}
                                            {title === 'Gestion des Inscriptions' && 'Gérez les inscriptions des élèves aux classes'}
                                            {title === 'Créer une Inscription' && 'Inscrire un élève dans une classe'}
                                            {title === 'Modifier l\'Inscription' && 'Modifiez les informations de l\'inscription'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Actions rapides selon la page */}
                                {title === 'Inscriptions' || title === 'Gestion des Inscriptions' ? (
                                    <Link
                                        href={route('inscriptions.create')}
                                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span className="font-semibold">Nouvelle Inscription</span>
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                {/* Contenu principal */}
                <main className="flex-1">
                    <div className={`${title ? 'py-8' : 'py-8'} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
                        {children}
                    </div>
                </main>

                {/* Pied de page */}
                <footer className="bg-white/60 backdrop-blur-md border-t border-gray-200/60 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-3 mb-4 md:mb-0">
                                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">🎓</span>
                                </div>
                                <span className="text-gray-700 font-medium">EduManager</span>
                            </div>
                            <div className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} Système de Gestion Académique. Tous droits réservés.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Layout;