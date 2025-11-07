import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ niveaux, cycles, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [cycleId, setCycleId] = useState(filters.cycle_id || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);

    // ✅ Options React Select
    const cycleOptions = useMemo(() => [
        { value: '', label: 'Tous les cycles' },
        ...cycles.map((cycle) => ({
            value: cycle.id,
            label: cycle.nom,
            ...cycle
        }))
    ], [cycles]);

    const perPageOptions = [
        { value: '10', label: '10 par page' },
        { value: '20', label: '20 par page' },
        { value: '50', label: '50 par page' },
    ];

    // ✅ Styles personnalisés React Select
    const customStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '52px',
            borderRadius: '12px',
            border: `2px solid ${state.isFocused ? '#8b5cf6' : '#e5e7eb'}`,
            boxShadow: state.isFocused ? '0 0 0 4px rgba(139,92,246,0.2)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#8b5cf6' : '#d1d5db'
            },
            backgroundColor: 'white'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#8b5cf6'
                : state.isFocused
                    ? '#ede9fe'
                    : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
            padding: '12px 16px',
            fontSize: '14px',
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            boxShadow:
                '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            zIndex: 50
        }),
        menuList: (base) => ({
            ...base,
            borderRadius: '10px',
            padding: '4px'
        }),
        placeholder: (base) => ({
            ...base,
            color: '#6b7280',
            fontSize: '14px'
        }),
        singleValue: (base) => ({
            ...base,
            color: '#1f2937',
            fontSize: '14px',
            fontWeight: '500'
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? '#8b5cf6' : '#6b7280',
            '&:hover': { color: '#8b5cf6' }
        }),
        clearIndicator: (base) => ({
            ...base,
            color: '#6b7280',
            '&:hover': { color: '#ef4444' }
        })
    };

    // ✅ Fonction debounce sans `this`
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const updateFilters = (newFilters = {}) => {
        router.get(
            '/niveaux',
            {
                search: newFilters.search ?? search,
                cycle_id: newFilters.cycle_id ?? cycleId,
                perPage: newFilters.perPage ?? perPage
            },
            {
                preserveState: true,
                replace: true
            }
        );
    };

    const handleSearch = debounce((value) => updateFilters({ search: value }), 300);

    const handleCycleChange = (selectedOption) => {
        const value = selectedOption?.value || '';
        setCycleId(value);
        updateFilters({ cycle_id: value });
    };

    const handlePerPageChange = (selectedOption) => {
        const value = selectedOption?.value || '10';
        setPerPage(value);
        updateFilters({ perPage: value });
    };

    const resetFilters = () => {
        setSearch('');
        setCycleId('');
        setPerPage(10);
        router.get('/niveaux', {}, { preserveState: true, replace: true });
    };

    const handleDelete = (niveau) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le niveau "${niveau.nom}" ?`)) {
            router.delete(`/niveaux/${niveau.id}`);
        }
    };

    // ✅ Couleurs dynamiques
    const getNiveauColor = (index) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-orange-500 to-orange-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600',
            'from-teal-500 to-teal-600',
            'from-cyan-500 to-cyan-600',
        ];
        return colors[index % colors.length];
    };

    const getMoyenneColor = (moyenne) => {
        if (moyenne >= 12) return 'text-green-600 bg-green-50 border-green-200';
        if (moyenne >= 10) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (moyenne >= 8) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    // ✅ Valeurs sélectionnées
    const selectedCycle = cycleOptions.find((opt) => opt.value == cycleId) || null;
    const selectedPerPage =
        perPageOptions.find((opt) => opt.value == perPage.toString()) || perPageOptions[0];

    // ✅ Rendu JSX
    return (
        <AppLayout>
            <Head title="Gestion des Niveaux" />

            {/* Flash messages */}
            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 text-green-800 font-medium">
                    ✅ {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 font-medium">
                    ⚠️ {flash.error}
                </div>
            )}
            <div className="max-w-7xl mx-auto">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Gestion des Niveaux
                            </h1>
                            <p className="text-purple-100 mt-2 text-lg">
                                Organisez les niveaux pédagogiques par cycle
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <Link
                                href="/niveaux/create"
                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouveau Niveau
                            </Link>
                        </div>
                    </div>
                </div>

            {/* Filtres et Recherche avec React Select */}
<div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
    <div className="flex flex-col xl:flex-row gap-4 items-end">
        {/* Champ de recherche */}
        <div className="w-full xl:flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Recherche
            </label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Rechercher un niveau ou cycle..."
                    defaultValue={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:border-gray-300"
                />
            </div>
        </div>

        {/* Sélecteur cycle */}
        <div className="w-full xl:w-64">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔄 Cycle
            </label>
            <Select
                options={cycleOptions}
                value={selectedCycle}
                onChange={handleCycleChange}
                styles={customStyles}
                isClearable
                placeholder="Tous les cycles"
            />
        </div>

        {/* Sélecteur résultats par page */}
        <div className="w-full xl:w-40">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                📄 Par page
            </label>
            <Select
                options={perPageOptions}
                value={selectedPerPage}
                onChange={handlePerPageChange}
                styles={customStyles}
                isSearchable={false}
            />
        </div>

        {/* Bouton reset */}
        <div className="w-full xl:w-auto">
            <button
                onClick={resetFilters}
                className="w-full xl:w-auto px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap font-medium h-[52px] group"
            >
                <svg className="w-4 h-4 flex-shrink-0 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser
            </button>
        </div>
    </div>
</div>

{/* Indicateurs de filtres actifs */}
{(search || cycleId) && (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtres actifs :
            </span>
            
            {search && (
                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-purple-800 flex items-center gap-2 border border-purple-200 shadow-sm">
                    <span className="font-medium">Recherche:</span> "{search}"
                    <button
                        onClick={() => {
                            setSearch('');
                            updateFilters({ search: '' });
                        }}
                        className="text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                        title="Supprimer la recherche"
                    >
                        ×
                    </button>
                </span>
            )}
            
            {cycleId && (
                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-purple-800 flex items-center gap-2 border border-purple-200 shadow-sm">
                    <span className="font-medium">Cycle:</span> {cycles.find(c => c.id == cycleId)?.nom}
                    <button
                        onClick={() => {
                            setCycleId('');
                            updateFilters({ cycle_id: '' });
                        }}
                        className="text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                        title="Supprimer le filtre cycle"
                    >
                        ×
                    </button>
                </span>
            )}
            
            <button
                onClick={resetFilters}
                className="ml-auto text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Tout effacer
            </button>
        </div>
    </div>
)}

                {/* Liste des Niveaux */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {niveaux.data.map((niveau, index) => (
                        <div key={niveau.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            {/* En-tête avec gradient */}
                            <div className={`bg-gradient-to-r ${getNiveauColor(index)} p-6 text-white`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold">{niveau.nom}</h3>
                                        <p className="text-purple-100 mt-1 opacity-90">
                                            {niveau.cycle?.nom}
                                        </p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Contenu */}
                            <div className="p-6">
                                {/* Statistiques rapides */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                                        <div className="text-xl font-bold text-gray-900">{niveau.classes?.length || 0}</div>
                                        <div className="text-xs text-gray-600">Classes</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                                        <div className="text-xl font-bold text-gray-900">{niveau.matieres?.length || 0}</div>
                                        <div className="text-xs text-gray-600">Matières</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                                        <div className={`text-xl font-bold ${getMoyenneColor(niveau.moyenne_min_pour_passage).split(' ')[0]}`}>
                                            {niveau.moyenne_min_pour_passage}
                                        </div>
                                        <div className="text-xs text-gray-600">Moy. min</div>
                                    </div>
                                </div>

                                {/* Moyenne minimale */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">Moyenne minimale pour passage</span>
                                        <span className={`text-sm font-bold ${getMoyenneColor(niveau.moyenne_min_pour_passage)} px-2 py-1 rounded-full`}>
                                            {niveau.moyenne_min_pour_passage}/20
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${niveau.moyenne_min_pour_passage >= 12 ? 'bg-green-500' :
                                                niveau.moyenne_min_pour_passage >= 10 ? 'bg-blue-500' :
                                                    niveau.moyenne_min_pour_passage >= 8 ? 'bg-orange-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${(niveau.moyenne_min_pour_passage / 20) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Liste des classes */}
                                {niveau.classes && niveau.classes.length > 0 ? (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Classes :</h4>
                                        {niveau.classes.slice(0, 3).map((classe) => (
                                            <div key={classe.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-900">{classe.nom}</span>
                                                {classe.professeur && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                        {classe.professeur.prenom[0]}. {classe.professeur.nom}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        {niveau.classes.length > 3 && (
                                            <div className="text-center text-xs text-gray-500 py-1">
                                                + {niveau.classes.length - 3} autre(s) classe(s)
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-3">
                                        <svg className="mx-auto h-6 w-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <p className="text-xs text-gray-500">Aucune classe</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                    <Link
                                        href={`/niveaux/${niveau.id}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Détails
                                    </Link>
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/niveaux/${niveau.id}/edit`}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(niveau)}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message vide */}
                {niveaux.data.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-200">
                        <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun niveau trouvé</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {search || cycleId ? 'Aucun niveau ne correspond à vos critères de recherche.' : 'Commencez par créer votre premier niveau.'}
                        </p>
                        <Link
                            href="/niveaux/create"
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Créer le premier niveau
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {niveaux.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{niveaux.from}</span> à <span className="font-semibold">{niveaux.to}</span> sur <span className="font-semibold">{niveaux.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {niveaux.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${link.active
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg'
                                        : link.url
                                            ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-500 hover:text-purple-600'
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