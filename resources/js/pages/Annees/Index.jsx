import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '@/Components/Layout';

const AnneesIndex = ({ annees }) => {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatut, setFilterStatut] = useState('');

    // Filtrer les années
    const filteredAnnees = annees.filter(annee =>
        annee.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        annee.statut_custom?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Trouver l'année active
    const anneeActive = annees.find(a => a.actif);

    // Statistiques
    const stats = {
        total: annees.length,
        active: annees.filter(a => a.actif).length,
        inactives: annees.filter(a => !a.actif).length,
        terminees: annees.filter(a => new Date(a.date_fin) < new Date()).length,
    };

    // Calculer le statut personnalisé
    const getStatut = (annee) => {
        const aujourdhui = new Date();
        const debut = new Date(annee.date_debut);
        const fin = new Date(annee.date_fin);

        if (annee.actif) return 'active';
        if (aujourdhui < debut) return 'future';
        if (aujourdhui > fin) return 'terminee';
        return 'inactive';
    };

    const getStatutColor = (statut) => {
        const colors = {
            active: 'bg-green-100 text-green-800 border-green-200',
            future: 'bg-blue-100 text-blue-800 border-blue-200',
            terminee: 'bg-gray-100 text-gray-800 border-gray-200',
            inactive: 'bg-orange-100 text-orange-800 border-orange-200',
        };
        return colors[statut] || colors.inactive;
    };

    const getStatutLabel = (statut) => {
        const labels = {
            active: 'En cours',
            future: 'À venir',
            terminee: 'Terminée',
            inactive: 'Inactive',
        };
        return labels[statut] || 'Inactive';
    };

    return (
        <Layout title="Gestion des Années Scolaires">
            <Head title="Années Scolaires" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête avec statistiques */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Années Scolaires
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">
                                Gérez les années académiques de votre établissement
                            </p>
                        </div>

                        <Link
                            href={route('annees.create')}
                            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-xl hover:from-amber-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="font-semibold">Nouvelle Année</span>
                        </Link>
                    </div>

                    {/* Cartes de statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Total Années</p>
                                    <p className="text-2xl font-bold text-amber-900">{stats.total}</p>
                                </div>
                                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800">Active</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                                </div>
                                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-800">À venir</p>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {annees.filter(a => getStatut(a) === 'future').length}
                                    </p>
                                </div>
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Terminées</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.terminees}</p>
                                </div>
                                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Année active */}
                    {anneeActive && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-green-800">
                                            Année scolaire active
                                        </div>
                                        <div className="text-sm text-green-700">
                                            {anneeActive.nom} • Du {new Date(anneeActive.date_debut).toLocaleDateString('fr-FR')} au {new Date(anneeActive.date_fin).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    En cours
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filtres et recherche */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher une année scolaire..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={filterStatut}
                                onChange={(e) => setFilterStatut(e.target.value)}
                                className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white appearance-none"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="active">En cours</option>
                                <option value="future">À venir</option>
                                <option value="terminee">Terminée</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-3 flex items-center justify-center border border-amber-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-semibold text-amber-700">
                                {filteredAnnees.length} année(s)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Message de succès */}
                {flash?.success && (
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{flash.success}</span>
                        </div>
                    </div>
                )}

                {/* Grille des années */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAnnees.length > 0 ? (
                        filteredAnnees.map((annee) => {
                            const statut = getStatut(annee);
                            const statutColor = getStatutColor(statut);
                            const statutLabel = getStatutLabel(statut);

                            return (
                                <div
                                    key={annee.id}
                                    className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                                        annee.actif 
                                            ? 'border-green-300 ring-2 ring-green-500/20' 
                                            : 'border-gray-200 hover:border-amber-300'
                                    }`}
                                >
                                    <div className="p-6">
                                        {/* En-tête de la carte */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ${
                                                    annee.actif 
                                                        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                                        : 'bg-gradient-to-br from-amber-500 to-orange-600'
                                                }`}>
                                                    <span className="text-white font-bold text-sm">
                                                        {annee.nom.split('-')[0]?.slice(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                ID: {annee.id}
                                            </div>
                                        </div>

                                        {/* Nom de l'année */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {annee.nom}
                                        </h3>

                                        {/* Période */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        Du {new Date(annee.date_debut).toLocaleDateString('fr-FR')}
                                                    </div>
                                                    <div className="text-sm text-gray-900">
                                                        Au {new Date(annee.date_fin).toLocaleDateString('fr-FR')}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Durée */}
                                            <div className="flex items-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="text-sm text-gray-600">
                                                    {Math.ceil((new Date(annee.date_fin) - new Date(annee.date_debut)) / (1000 * 60 * 60 * 24))} jours
                                                </div>
                                            </div>
                                        </div>

                                        {/* Statut et indicateurs */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className={`rounded-lg p-2 text-center border ${statutColor}`}>
                                                <div className="text-sm font-bold">{statutLabel}</div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-2 text-center">
                                                <div className="text-lg font-bold text-gray-900">0</div>
                                                <div className="text-xs text-gray-500">Classes</div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="text-xs text-gray-500">
                                                Créée le {new Date(annee.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={route('annees.edit', annee.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                                                    title="Modifier"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>

                                                <Link
                                                    as="button"
                                                    method="delete"
                                                    href={route('annees.destroy', annee.id)}
                                                    onClick={() => confirm('Êtes-vous sûr de vouloir supprimer cette année scolaire ?')}
                                                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                                    title="Supprimer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full">
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune année scolaire trouvée</h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm || filterStatut ? 
                                        "Aucune année ne correspond à vos critères de recherche." :
                                        "Commencez par créer votre première année scolaire."
                                    }
                                </p>
                                {(searchTerm || filterStatut) ? (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterStatut('');
                                        }}
                                        className="text-amber-600 hover:text-amber-700 font-medium"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                ) : (
                                    <Link
                                        href={route('annees.create')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Créer une année
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AnneesIndex;