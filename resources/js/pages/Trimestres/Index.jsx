import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '@/Components/Layout';

const TrimestresIndex = ({ trimestres }) => {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAnnee, setFilterAnnee] = useState('');

    // Filtrer les trimestres
    const filteredTrimestres = trimestres.filter(trimestre =>
        trimestre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trimestre.annee_scolaire?.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Années uniques pour le filtre
    const annees = [...new Set(trimestres.map(t => t.annee_scolaire).filter(Boolean))];

    // Calculer le statut
    const getStatut = (trimestre) => {
        const aujourdhui = new Date();
        const debut = new Date(trimestre.date_debut);
        const fin = new Date(trimestre.date_fin);

        if (aujourdhui >= debut && aujourdhui <= fin) return 'en_cours';
        if (aujourdhui < debut) return 'a_venir';
        return 'termine';
    };

    const getStatutColor = (statut) => {
        const colors = {
            en_cours: 'bg-green-100 text-green-800 border-green-200',
            a_venir: 'bg-blue-100 text-blue-800 border-blue-200',
            termine: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[statut] || colors.termine;
    };

    const getStatutLabel = (statut) => {
        const labels = {
            en_cours: 'En cours',
            a_venir: 'À venir',
            termine: 'Terminé',
        };
        return labels[statut] || 'Terminé';
    };

    // Statistiques
    const stats = {
        total: trimestres.length,
        enCours: trimestres.filter(t => getStatut(t) === 'en_cours').length,
        aVenir: trimestres.filter(t => getStatut(t) === 'a_venir').length,
        termines: trimestres.filter(t => getStatut(t) === 'termine').length,
    };

    return (
        <Layout title="Gestion des Trimestres">
            <Head title="Trimestres" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête avec statistiques */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Gestion des Trimestres
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">
                                Gérez les périodes trimestrielles de votre établissement
                            </p>
                        </div>

                        <Link
                            href={route('trimestres.create')}
                            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:from-teal-700 hover:to-cyan-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="font-semibold">Nouveau Trimestre</span>
                        </Link>
                    </div>

                    {/* Cartes de statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-teal-800">Total Trimestres</p>
                                    <p className="text-2xl font-bold text-teal-900">{stats.total}</p>
                                </div>
                                <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800">En cours</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.enCours}</p>
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
                                    <p className="text-2xl font-bold text-blue-900">{stats.aVenir}</p>
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
                                    <p className="text-sm font-medium text-gray-800">Terminés</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.termines}</p>
                                </div>
                                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtres et recherche */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher un trimestre ou une année..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 bg-white"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={filterAnnee}
                                onChange={(e) => setFilterAnnee(e.target.value)}
                                className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 bg-white appearance-none"
                            >
                                <option value="">Toutes les années</option>
                                {annees.map((annee) => (
                                    <option key={annee.id} value={annee.id}>
                                        {annee.nom}
                                    </option>
                                ))}
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>

                        <div className="bg-teal-50 rounded-xl p-3 flex items-center justify-center border border-teal-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-semibold text-teal-700">
                                {filteredTrimestres.length} trimestre(s)
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

                {/* Grille des trimestres */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTrimestres.length > 0 ? (
                        filteredTrimestres.map((trimestre) => {
                            const statut = getStatut(trimestre);
                            const statutColor = getStatutColor(statut);
                            const statutLabel = getStatutLabel(statut);
                            const duree = Math.ceil((new Date(trimestre.date_fin) - new Date(trimestre.date_debut)) / (1000 * 60 * 60 * 24));

                            return (
                                <div
                                    key={trimestre.id}
                                    className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="p-6">
                                        {/* En-tête de la carte */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-sm">
                                                    <span className="text-white font-bold text-sm">
                                                        {trimestre.nom.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                ID: {trimestre.id}
                                            </div>
                                        </div>

                                        {/* Nom du trimestre */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {trimestre.nom}
                                        </h3>

                                        {/* Année scolaire */}
                                        <div className="mb-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                {trimestre.annee_scolaire?.nom}
                                            </span>
                                        </div>

                                        {/* Période */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        Du {new Date(trimestre.date_debut).toLocaleDateString('fr-FR')}
                                                    </div>
                                                    <div className="text-sm text-gray-900">
                                                        Au {new Date(trimestre.date_fin).toLocaleDateString('fr-FR')}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Durée */}
                                            <div className="flex items-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="text-sm text-gray-600">
                                                    {duree} jours
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
                                                <div className="text-xs text-gray-500">Évaluations</div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="text-xs text-gray-500">
                                                Créé le {new Date(trimestre.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={route('trimestres.edit', trimestre.id)}
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
                                                    href={route('trimestres.destroy', trimestre.id)}
                                                    onClick={() => confirm('Êtes-vous sûr de vouloir supprimer ce trimestre ?')}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun trimestre trouvé</h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm || filterAnnee ?
                                        "Aucun trimestre ne correspond à vos critères de recherche." :
                                        "Commencez par créer votre premier trimestre."
                                    }
                                </p>
                                {(searchTerm || filterAnnee) ? (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterAnnee('');
                                        }}
                                        className="text-teal-600 hover:text-teal-700 font-medium"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                ) : (
                                    <Link
                                        href={route('trimestres.create')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Créer un trimestre
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

export default TrimestresIndex;