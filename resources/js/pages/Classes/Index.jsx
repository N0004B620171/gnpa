import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ classes, niveaux, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [niveauId, setNiveauId] = useState(filters.niveau_id || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        router.get('/classes', { search: value, niveau_id: niveauId, perPage }, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handleFilterChange = () => {
        router.get('/classes', { search, niveau_id: niveauId, perPage }, {
            preserveState: true,
            replace: true
        });
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        router.get('/classes', { search, niveau_id: niveauId, perPage: value }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (classe) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la classe "${classe.nom}" ?`)) {
            router.delete(`/classes/${classe.id}`);
        }
    };

    const getClasseColor = (index) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-orange-500 to-orange-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600',
            'from-teal-500 to-teal-600',
            'from-cyan-500 to-cyan-600'
        ];
        return colors[index % colors.length];
    };

    const getEffectifColor = (effectif, capacite) => {
        const tauxRemplissage = (effectif / capacite) * 100;
        if (tauxRemplissage >= 90) return 'text-red-600 bg-red-50 border-red-200';
        if (tauxRemplissage >= 75) return 'text-orange-600 bg-orange-50 border-orange-200';
        if (tauxRemplissage >= 50) return 'text-green-600 bg-green-50 border-green-200';
        return 'text-blue-600 bg-blue-50 border-blue-200';
    };

    const calculateTauxRemplissage = (effectif, capacite) => {
        return Math.round((effectif / capacite) * 100);
    };

    return (
        <AppLayout>
            <Head title="Gestion des Classes" />

            {/* Alertes */}
            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                                {flash.success}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">
                                {flash.error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Gestion des Classes
                            </h1>
                            <p className="text-emerald-100 mt-2 text-lg">
                                Organisez les classes par niveau et affectez les professeurs
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <Link
                                href="/classes/create"
                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvelle Classe
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher une classe, niveau ou cycle..."
                                    defaultValue={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                                />
                            </div>
                        </div>
                        <div className="lg:w-64">
                            <select
                                value={niveauId}
                                onChange={(e) => {
                                    setNiveauId(e.target.value);
                                    handleFilterChange();
                                }}
                                className="block w-full pl-4 pr-10 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                            >
                                <option value="">Tous les niveaux</option>
                                {niveaux.map((niveau) => (
                                    <option key={niveau.id} value={niveau.id}>
                                        {niveau.nom} - {niveau.cycle?.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="lg:w-48">
                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(e.target.value)}
                                className="block w-full pl-4 pr-10 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                            >
                                <option value="10">10 par page</option>
                                <option value="20">20 par page</option>
                                <option value="50">50 par page</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des Classes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.data.map((classe, index) => {
                        const effectif = classe.inscriptions?.length || 0;
                        const capacite = classe.capacite || 30;
                        const tauxRemplissage = calculateTauxRemplissage(effectif, capacite);
                        
                        return (
                            <div key={classe.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                {/* En-tête avec gradient */}
                                <div className={`bg-gradient-to-r ${getClasseColor(index)} p-6 text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold">{classe.nom}</h3>
                                            <p className="text-emerald-100 mt-1 opacity-90">
                                                {classe.niveau?.nom} - {classe.niveau?.cycle?.nom}
                                            </p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenu */}
                                <div className="p-6">
                                    {/* Professeur principal */}
                                    <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-xl">
                                        {classe.professeur ? (
                                            <>
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-sm">
                                                        {classe.professeur.prenom[0]}{classe.professeur.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {classe.professeur.prenom} {classe.professeur.nom}
                                                    </div>
                                                    <div className="text-xs text-gray-600">Professeur principal</div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center text-gray-500">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                                <span className="text-sm">Aucun professeur</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Statistiques rapides */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                                            <div className={`text-xl font-bold ${getEffectifColor(effectif, capacite)}`}>
                                                {effectif}/{capacite}
                                            </div>
                                            <div className="text-xs text-gray-600">Élèves</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                                            <div className={`text-xl font-bold ${
                                                tauxRemplissage >= 90 ? 'text-red-600' :
                                                tauxRemplissage >= 75 ? 'text-orange-600' :
                                                tauxRemplissage >= 50 ? 'text-green-600' : 'text-blue-600'
                                            }`}>
                                                {tauxRemplissage}%
                                            </div>
                                            <div className="text-xs text-gray-600">Remplissage</div>
                                        </div>
                                    </div>

                                    {/* Barre de progression */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Effectif</span>
                                            <span>{effectif}/{capacite} élèves</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${
                                                    tauxRemplissage >= 90 ? 'bg-red-500' :
                                                    tauxRemplissage >= 75 ? 'bg-orange-500' :
                                                    tauxRemplissage >= 50 ? 'bg-green-500' : 'bg-blue-500'
                                                }`}
                                                style={{ width: `${tauxRemplissage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Liste des élèves (aperçu) */}
                                    {classe.inscriptions && classe.inscriptions.length > 0 ? (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Élèves :</h4>
                                            {classe.inscriptions.slice(0, 3).map((inscription) => (
                                                <div key={inscription.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {inscription.eleve.prenom} {inscription.eleve.nom}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        inscription.eleve.sexe === 'M' 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-pink-100 text-pink-800'
                                                    }`}>
                                                        {inscription.eleve.sexe === 'M' ? '👦' : '👧'}
                                                    </span>
                                                </div>
                                            ))}
                                            {classe.inscriptions.length > 3 && (
                                                <div className="text-center text-xs text-gray-500 py-1">
                                                    + {classe.inscriptions.length - 3} autre(s) élève(s)
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-3">
                                            <svg className="mx-auto h-6 w-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                            <p className="text-xs text-gray-500">Aucun élève inscrit</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/classes/${classe.id}`}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Détails
                                            </Link>
                                            <Link
                                                href={`/classes/${classe.id}/statistiques`}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                                Stats
                                            </Link>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/classes/${classe.id}/edit`}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(classe)}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Message vide */}
                {classes.data.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-200">
                        <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune classe trouvée</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {search || niveauId ? 'Aucune classe ne correspond à vos critères de recherche.' : 'Commencez par créer votre première classe.'}
                        </p>
                        <Link
                            href="/classes/create"
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-xl hover:from-emerald-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Créer la première classe
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {classes.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{classes.from}</span> à <span className="font-semibold">{classes.to}</span> sur <span className="font-semibold">{classes.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {classes.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg'
                                            : link.url
                                            ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Index;