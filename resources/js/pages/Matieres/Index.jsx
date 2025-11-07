
import React, { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Select from 'react-select';

const Index = ({ matieres, niveaux, professeurs, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [niveauId, setNiveauId] = useState(filters.niveau_id || '');
    const [professeurId, setProfesseurId] = useState(filters.professeur_id || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);

    // Préparer les options pour react-select
    const niveauOptions = useMemo(() => [
        { value: '', label: 'Tous les niveaux' },
        ...niveaux.map((niveau) => ({
            value: niveau.id,
            label: `${niveau.nom} - ${niveau.cycle?.nom}`,
            ...niveau
        }))
    ], [niveaux]);

    const professeurOptions = useMemo(() => [
        { value: '', label: 'Tous les professeurs' },
        ...professeurs.map((professeur) => ({
            value: professeur.id,
            label: `${professeur.prenom} ${professeur.nom}`,
            ...professeur
        }))
    ], [professeurs]);

    const perPageOptions = [
        { value: '10', label: '10 par page' },
        { value: '20', label: '20 par page' },
        { value: '50', label: '50 par page' }
    ];

    // Styles personnalisés pour react-select
    const customStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '52px',
            borderRadius: '12px',
            border: `2px solid ${state.isFocused ? '#3b82f6' : '#e5e7eb'}`,
            boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#3b82f6' : '#d1d5db'
            },
            backgroundColor: 'white'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
            padding: '12px 16px',
            fontSize: '14px',
            '&:active': {
                backgroundColor: state.isSelected ? '#3b82f6' : '#bfdbfe'
            }
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
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
        indicatorSeparator: () => ({
            display: 'none'
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? '#3b82f6' : '#6b7280',
            '&:hover': {
                color: '#3b82f6'
            }
        }),
        clearIndicator: (base) => ({
            ...base,
            color: '#6b7280',
            '&:hover': {
                color: '#ef4444'
            }
        })
    };

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        updateFilters({ search: value });
    }, 300);

    const updateFilters = (newFilters = {}) => {
        router.get('/matieres', {
            search: newFilters.search !== undefined ? newFilters.search : search,
            niveau_id: newFilters.niveau_id !== undefined ? newFilters.niveau_id : niveauId,
            professeur_id: newFilters.professeur_id !== undefined ? newFilters.professeur_id : professeurId,
            perPage: newFilters.perPage !== undefined ? newFilters.perPage : perPage
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleNiveauChange = (selectedOption) => {
        const value = selectedOption?.value || '';
        setNiveauId(value);
        updateFilters({ niveau_id: value });
    };

    const handleProfesseurChange = (selectedOption) => {
        const value = selectedOption?.value || '';
        setProfesseurId(value);
        updateFilters({ professeur_id: value });
    };

    const handlePerPageChange = (selectedOption) => {
        const value = selectedOption?.value || '10';
        setPerPage(value);
        updateFilters({ perPage: value });
    };

    const resetFilters = () => {
        setSearch('');
        setNiveauId('');
        setProfesseurId('');
        setPerPage(10);
        router.get('/matieres', {}, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (matiere) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la matière "${matiere.nom}" ?`)) {
            router.delete(`/matieres/${matiere.id}`);
        }
    };

    const getMatiereColor = (index) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-orange-500 to-orange-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600',
            'from-teal-500 to-teal-600',
            'from-cyan-500 to-cyan-600',
            'from-amber-500 to-amber-600',
            'from-emerald-500 to-emerald-600'
        ];
        return colors[index % colors.length];
    };

    const getCoefficientColor = (coefficient) => {
        if (coefficient >= 5) return 'bg-red-100 text-red-800 border-red-200';
        if (coefficient >= 3) return 'bg-orange-100 text-orange-800 border-orange-200';
        if (coefficient >= 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-green-100 text-green-800 border-green-200';
    };

    // Valeurs sélectionnées pour react-select
    const selectedNiveau = niveauOptions.find(opt => opt.value == niveauId) || null;
    const selectedProfesseur = professeurOptions.find(opt => opt.value == professeurId) || null;
    const selectedPerPage = perPageOptions.find(opt => opt.value == perPage.toString()) || perPageOptions[0];

    return (
        <AppLayout>
            <Head title="Gestion des Matières" />

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
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Gestion des Matières
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Organisez les matières par niveau et affectez les professeurs
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <Link
                                href="/matieres/create"
                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvelle Matière
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
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher une matière, niveau ou professeur..."
                                    defaultValue={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Sélecteur niveau */}
                        <div className="w-full xl:w-64">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🎓 Niveau
                            </label>
                            <Select
                                options={niveauOptions}
                                value={selectedNiveau}
                                onChange={handleNiveauChange}
                                styles={customStyles}
                                isClearable
                                placeholder="Tous les niveaux"
                            />
                        </div>

                        {/* Sélecteur professeur */}
                        <div className="w-full xl:w-64">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                👨‍🏫 Professeur
                            </label>
                            <Select
                                options={professeurOptions}
                                value={selectedProfesseur}
                                onChange={handleProfesseurChange}
                                styles={customStyles}
                                isClearable
                                placeholder="Tous les professeurs"
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
                {(search || niveauId || professeurId) && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filtres actifs :
                            </span>

                            {search && (
                                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-blue-800 flex items-center gap-2 border border-blue-200 shadow-sm">
                                    <span className="font-medium">Recherche:</span> "{search}"
                                    <button
                                        onClick={() => {
                                            setSearch('');
                                            updateFilters({ search: '' });
                                        }}
                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                        title="Supprimer la recherche"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            {niveauId && (
                                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-blue-800 flex items-center gap-2 border border-blue-200 shadow-sm">
                                    <span className="font-medium">Niveau:</span> {niveaux.find(n => n.id == niveauId)?.nom}
                                    <button
                                        onClick={() => {
                                            setNiveauId('');
                                            updateFilters({ niveau_id: '' });
                                        }}
                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                        title="Supprimer le filtre niveau"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            {professeurId && (
                                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-blue-800 flex items-center gap-2 border border-blue-200 shadow-sm">
                                    <span className="font-medium">Professeur:</span> {professeurs.find(p => p.id == professeurId)?.prenom} {professeurs.find(p => p.id == professeurId)?.nom}
                                    <button
                                        onClick={() => {
                                            setProfesseurId('');
                                            updateFilters({ professeur_id: '' });
                                        }}
                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                        title="Supprimer le filtre professeur"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            <button
                                onClick={resetFilters}
                                className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Tout effacer
                            </button>
                        </div>
                    </div>
                )}
                {/* Liste des Matières */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matieres.data.map((matiere, index) => {
                        const notesCount = matiere.notes?.length || 0;
                        const compositionsCount = matiere.compositions?.length || 0;

                        return (
                            <div key={matiere.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                {/* En-tête avec gradient */}
                                <div className={`bg-gradient-to-r ${getMatiereColor(index)} p-6 text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold">{matiere.nom}</h3>
                                            <p className="text-blue-100 mt-1 opacity-90">
                                                Coefficient: {matiere.coefficient}
                                            </p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenu */}
                                <div className="p-6">
                                    {/* Informations niveau */}
                                    <div className="flex items-center justify-between mb-4">
                                        {matiere.niveau ? (
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-purple-600 font-bold text-sm">
                                                        {matiere.niveau.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {matiere.niveau.nom}
                                                    </div>
                                                    <div className="text-xs text-gray-600">{matiere.niveau.cycle?.nom}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">Tous niveaux</span>
                                        )}
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">{notesCount}</div>
                                            <div className="text-xs text-gray-600">Notes</div>
                                        </div>
                                    </div>

                                    {/* Coefficient */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Coefficient</span>
                                            <span>Pondération</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-blue-500"
                                                style={{ width: `${(matiere.coefficient / 10) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                                            <span>1</span>
                                            <span>10</span>
                                        </div>
                                    </div>

                                    {/* Professeur */}
                                    <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                                        {matiere.professeur ? (
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-green-600 font-bold text-xs">
                                                        {matiere.professeur.prenom[0]}{matiere.professeur.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {matiere.professeur.prenom} {matiere.professeur.nom}
                                                    </div>
                                                    <div className="text-xs text-gray-600">Professeur</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-gray-500">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                                <span className="text-sm">Aucun professeur</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Statistiques */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-bold text-blue-600">{notesCount}</div>
                                            <div className="text-xs text-gray-600">Notes</div>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-bold text-purple-600">{compositionsCount}</div>
                                            <div className="text-xs text-gray-600">Compositions</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/matieres/${matiere.id}`}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Détails
                                            </Link>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/matieres/${matiere.id}/edit`}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(matiere)}
                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
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
                {matieres.data.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-200">
                        <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune matière trouvée</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {search || niveauId ? 'Aucune matière ne correspond à vos critères de recherche.' : 'Commencez par créer votre première matière.'}
                        </p>
                        <Link
                            href="/matieres/create"
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Créer la première matière
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {matieres.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{matieres.from}</span> à <span className="font-semibold">{matieres.to}</span> sur <span className="font-semibold">{matieres.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {matieres.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${link.active
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                                        : link.url
                                            ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600'
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