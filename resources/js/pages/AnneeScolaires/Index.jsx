import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ annees, filters, stats }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [statut, setStatut] = useState(filters?.statut || '');
    const [periode, setPeriode] = useState(filters?.periode || '');
    const [perPage, setPerPage] = useState(filters?.perPage || 10);
    const [viewMode, setViewMode] = useState('grid');

    const handleFilterChange = (filterName, value) => {
        const newFilters = {
            search: filterName === 'search' ? value : search,
            statut: filterName === 'statut' ? value : statut,
            periode: filterName === 'periode' ? value : periode,
            perPage: filterName === 'perPage' ? value : perPage,
        };

        router.get('/annees-scolaires', newFilters, {
            preserveState: true,
            replace: true
        });
    };

    const handleSearch = (value) => {
        setSearch(value);
        // Debounce search
        setTimeout(() => handleFilterChange('search', value), 500);
    };

    const handleDelete = (annee) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'année scolaire "${annee.nom}" ? Cette action est irréversible.`)) {
            router.delete(`/annees-scolaires/${annee.id}`);
        }
    };

    const handleActiver = (annee) => {
        if (confirm(`Voulez-vous activer l'année scolaire "${annee.nom}" ? L'année active actuelle sera désactivée.`)) {
            router.post(`/annees-scolaires/${annee.id}/activer`);
        }
    };

    const getStatusColor = (actif) => {
        return actif
            ? 'bg-green-100 text-green-800 border-green-200'
            : 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const calculateProgress = (annee) => {
        const now = new Date();
        const start = new Date(annee.date_debut);
        const end = new Date(annee.date_fin);
        const total = end - start;
        const current = now - start;

        if (current < 0) return 0;
        if (current > total) return 100;

        return Math.round((current / total) * 100);
    };

    const getProgressColor = (progress) => {
        if (progress >= 90) return 'bg-red-500';
        if (progress >= 75) return 'bg-orange-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getProgressStatus = (progress) => {
        if (progress === 0) return 'Non commencée';
        if (progress === 100) return 'Terminée';
        if (progress >= 90) return 'Bientôt terminée';
        if (progress >= 75) return 'Bien avancée';
        if (progress >= 50) return 'En milieu';
        if (progress >= 25) return 'Débutée';
        return 'Très débutée';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getAnneeColor = (index) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
            'from-indigo-500 to-indigo-600',
            'from-teal-500 to-teal-600',
        ];
        return colors[index % colors.length];
    };

    const clearFilters = () => {
        setSearch('');
        setStatut('');
        setPeriode('');
        router.get('/annees-scolaires', { perPage }, {
            preserveState: true,
            replace: true
        });
    };

    const hasActiveFilters = search || statut || periode;

    return (
        <AppLayout>
            <Head title="Gestion des Années Scolaires" />

            {/* Alertes */}
            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium text-green-800">{flash?.success}</p>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium text-red-800">{flash?.error}</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Gestion des Années Scolaires
                            </h1>
                            <p className="text-indigo-100 mt-2 text-lg">
                                Organisez les années scolaires et les périodes d'enseignement
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex items-center gap-3">
                            <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-2 rounded-lg transition-all ${viewMode === 'grid'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 rounded-lg transition-all ${viewMode === 'list'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                            <Link
                                href="/annees-scolaires/create"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvelle Année
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total des années</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Années actives</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.actives || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avec inscriptions</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.avec_inscriptions || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Années futures</p>
                                <p className="text-2xl font-bold text-gray-900">{stats?.futures || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
                        {/* Champ de recherche principal */}
                        <div className="flex-1">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher une année scolaire par nom..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                                />
                                {/* Bouton effacer intégré */}
                                {search && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            onClick={() => handleSearch('')}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors p-1.5 rounded-full hover:bg-indigo-50"
                                            title="Effacer la recherche"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Filtres avancés */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:w-2/3">
                            {/* Filtre statut */}
                            <div className="relative">
                                <select
                                    value={statut}
                                    onChange={(e) => handleFilterChange('statut', e.target.value)}
                                    className="block w-full pl-4 pr-10 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 appearance-none hover:border-gray-300"
                                >
                                    <option value="">📊 Tous les statuts</option>
                                    <option value="actif">🟢 Actives</option>
                                    <option value="inactif">⚪ Inactives</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Filtre période */}
                            <div className="relative">
                                <select
                                    value={periode}
                                    onChange={(e) => handleFilterChange('periode', e.target.value)}
                                    className="block w-full pl-4 pr-10 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 appearance-none hover:border-gray-300"
                                >
                                    <option value="">📅 Toutes les périodes</option>
                                    <option value="passees">⏪ Passées</option>
                                    <option value="courantes">🎯 En cours</option>
                                    <option value="futures">⏩ Futures</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Filtre pagination */}
                            <div className="relative">
                                <select
                                    value={perPage}
                                    onChange={(e) => handleFilterChange('perPage', e.target.value)}
                                    className="block w-full pl-4 pr-10 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 appearance-none hover:border-gray-300"
                                >
                                    <option value="10">📄 10 par page</option>
                                    <option value="20">📄 20 par page</option>
                                    <option value="50">📄 50 par page</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bouton réinitialiser */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Réinitialiser les filtres
                            </button>
                        </div>
                    )}
                </div>

                {/* Indicateurs de filtres actifs */}
                {(search || statut || periode) && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Filtres actifs :
                            </span>

                            {search && (
                                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-indigo-800 flex items-center gap-2 border border-indigo-200 shadow-sm">
                                    <span className="font-medium">Recherche:</span> "{search}"
                                    <button
                                        onClick={() => handleSearch('')}
                                        className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                        title="Supprimer la recherche"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            {statut && (
                                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-indigo-800 flex items-center gap-2 border border-indigo-200 shadow-sm">
                                    <span className="font-medium">Statut:</span> {statut === 'actif' ? 'Actives' : 'Inactives'}
                                    <button
                                        onClick={() => handleFilterChange('statut', '')}
                                        className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                        title="Supprimer le filtre statut"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            {periode && (
                                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-indigo-800 flex items-center gap-2 border border-indigo-200 shadow-sm">
                                    <span className="font-medium">Période:</span>
                                    {periode === 'passees' ? 'Passées' : periode === 'courantes' ? 'En cours' : 'Futures'}
                                    <button
                                        onClick={() => handleFilterChange('periode', '')}
                                        className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                        title="Supprimer le filtre période"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Liste des Années Scolaires */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {annees.data.map((annee, index) => (
                            <div key={annee.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                {/* En-tête avec gradient */}
                                <div className={`bg-gradient-to-r ${getAnneeColor(index)} p-6 text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold">{annee.nom}</h3>
                                            <p className="text-white/90 mt-1 opacity-90">
                                                {formatDate(annee.date_debut)} - {formatDate(annee.date_fin)}
                                            </p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenu */}
                                <div className="p-6">
                                    {/* Statut */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(annee.actif)}`}>
                                            <svg className={`w-4 h-4 mr-1 ${annee.actif ? 'text-green-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {annee.actif ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                )}
                                            </svg>
                                            {annee.actif ? 'Active' : 'Inactive'}
                                        </span>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">{annee.inscriptions_count}</div>
                                            <div className="text-xs text-gray-600">Inscriptions</div>
                                        </div>
                                    </div>

                                    {/* Barre de progression */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>{getProgressStatus(calculateProgress(annee))}</span>
                                            <span>{calculateProgress(annee)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(calculateProgress(annee))}`}
                                                style={{ width: `${calculateProgress(annee)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Statistiques */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                                            <div className="text-lg font-bold text-blue-600">{annee.trimestres_count}</div>
                                            <div className="text-xs text-blue-800">Trimestres</div>
                                        </div>
                                        <div className="text-center p-2 bg-green-50 rounded-lg">
                                            <div className="text-lg font-bold text-green-600">{annee.inscriptions_count}</div>
                                            <div className="text-xs text-green-800">Inscriptions</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/annees-scolaires/${annee.id}`}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Détails
                                            </Link>
                                        </div>
                                        <div className="flex space-x-2">
                                            {!annee.actif && (
                                                <button
                                                    onClick={() => handleActiver(annee)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Activer cette année"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </button>
                                            )}
                                            <Link
                                                href={`/annees-scolaires/${annee.id}/edit`}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            {!annee.actif && (
                                                <button
                                                    onClick={() => handleDelete(annee)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Année Scolaire
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Période
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Progression
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Inscriptions
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {annees.data.map((annee) => (
                                        <tr key={annee.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{annee.nom}</div>
                                                    {annee.description && (
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">{annee.description}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(annee.date_debut)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(annee.date_fin)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(annee.actif)}`}>
                                                    {annee.actif ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${getProgressColor(calculateProgress(annee))}`}
                                                            style={{ width: `${calculateProgress(annee)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-8">{calculateProgress(annee)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-semibold">
                                                    {annee.inscriptions_count}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/annees-scolaires/${annee.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Détails
                                                    </Link>
                                                    <Link
                                                        href={`/annees-scolaires/${annee.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    {!annee.actif && (
                                                        <button
                                                            onClick={() => handleActiver(annee)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Activer
                                                        </button>
                                                    )}
                                                    {!annee.actif && (
                                                        <button
                                                            onClick={() => handleDelete(annee)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Message vide */}
                {annees.data.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-200">
                        <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune année scolaire trouvée</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {hasActiveFilters
                                ? 'Aucune année scolaire ne correspond à vos critères de recherche.'
                                : 'Commencez par créer votre première année scolaire.'
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Réinitialiser les filtres
                                </button>
                            )}
                            <Link
                                href="/annees-scolaires/create"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer la première année
                            </Link>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {annees.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{annees.from}</span> à <span className="font-semibold">{annees.to}</span> sur <span className="font-semibold">{annees.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {annees.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${link.active
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg'
                                        : link.url
                                            ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-500 hover:text-indigo-600'
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