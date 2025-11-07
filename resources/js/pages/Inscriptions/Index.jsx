import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Select from 'react-select';

const Index = ({ inscriptions, classes, niveaux, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [classeId, setClasseId] = useState(filters.classe_id || '');
    const [niveauId, setNiveauId] = useState(filters.niveau_id || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);
    const [filtersChanged, setFiltersChanged] = useState(false);

    // Préparer les options pour react-select
    const niveauOptions = useMemo(() => [
        { value: '', label: 'Tous les niveaux' },
        ...niveaux.map((niveau) => ({
            value: niveau.id,
            label: `${niveau.nom} - ${niveau.cycle?.nom}`,
            ...niveau
        }))
    ], [niveaux]);

    const classeOptions = useMemo(() => {
        const filteredClasses = niveauId
            ? classes.filter(classe => classe.niveau_id == niveauId)
            : classes;

        return [
            { value: '', label: 'Toutes les classes' },
            ...filteredClasses.map((classe) => ({
                value: classe.id,
                label: `${classe.nom} - ${classe.niveau?.nom}`,
                ...classe
            }))
        ];
    }, [classes, niveauId]);

    const perPageOptions = [
        { value: '10', label: '10/page' },
        { value: '20', label: '20/page' },
        { value: '50', label: '50/page' }
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

    // Fonction pour mettre à jour les filtres
    const updateFilters = () => {
        if (!filtersChanged) return;

        router.get('/inscriptions', {
            search: search || '',
            classe_id: classeId || '',
            niveau_id: niveauId || '',
            perPage
        }, {
            preserveState: true,
            replace: true
        });

        setFiltersChanged(false);
    };

    // Debounce pour la recherche
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        setSearch(value);
        setFiltersChanged(true);
    }, 500);

    // Effet pour mettre à jour les filtres quand ils changent
    useEffect(() => {
        if (filtersChanged) {
            const timeoutId = setTimeout(() => {
                updateFilters();
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [filtersChanged]);

    // Effet séparé pour perPage (déclenche immédiatement)
    useEffect(() => {
        if (perPage !== (filters.perPage || 10)) {
            router.get('/inscriptions', {
                search: search || '',
                classe_id: classeId || '',
                niveau_id: niveauId || '',
                perPage
            }, {
                preserveState: true,
                replace: true
            });
        }
    }, [perPage]);

    const handlePerPageChange = (selectedOption) => {
        setPerPage(selectedOption.value);
    };

    const handleClasseChange = (selectedOption) => {
        setClasseId(selectedOption?.value || '');
        setFiltersChanged(true);
    };

    const handleNiveauChange = (selectedOption) => {
        setNiveauId(selectedOption?.value || '');
        setClasseId(''); // Réinitialiser la classe quand le niveau change
        setFiltersChanged(true);
    };

    // Réinitialiser tous les filtres
    const resetFilters = () => {
        setSearch('');
        setClasseId('');
        setNiveauId('');
        setPerPage(10);
        setFiltersChanged(true);
    };

    // Fonction pour supprimer un filtre individuel
    const removeFilter = (filterType) => {
        switch (filterType) {
            case 'search':
                setSearch('');
                break;
            case 'classe':
                setClasseId('');
                break;
            case 'niveau':
                setNiveauId('');
                break;
        }
        setFiltersChanged(true);
    };

    const getStatusColor = (statut) => {
        return statut === 'actif'
            ? 'text-green-600 bg-green-50 border-green-200'
            : 'text-red-600 bg-red-50 border-red-200';
    };

    const handleDelete = (inscription) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'inscription de ${inscription.eleve.prenom} ${inscription.eleve.nom} ?`)) {
            router.delete(`/inscriptions/${inscription.id}`);
        }
    };

    // Valeurs sélectionnées pour react-select
    const selectedNiveau = niveauOptions.find(opt => opt.value == niveauId) || null;
    const selectedClasse = classeOptions.find(opt => opt.value == classeId) || null;
    const selectedPerPage = perPageOptions.find(opt => opt.value == perPage.toString()) || perPageOptions[0];

    return (
        <AppLayout>
            <Head title="Gestion des Inscriptions" />

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Gestion des Inscriptions
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Gérez les inscriptions des élèves aux classes
                            </p>
                        </div>
                        <Link
                            href="/inscriptions/create"
                            className="mt-4 lg:mt-0 inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Nouvelle Inscription
                        </Link>
                    </div>
                </div>

                {/* Filtres et Recherche - Version avec largeurs proportionnelles */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col xl:flex-row gap-4 items-end">
                        {/* Champ de recherche - Plus large */}
                        <div className="w-full xl:flex-1 xl:min-w-64">
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
                                    placeholder="Élève, classe, année..."
                                    defaultValue={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Sélecteur niveau */}
                        <div className="w-full xl:w-56">
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

                        {/* Sélecteur classe */}
                        <div className="w-full xl:w-56">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🏫 Classe
                            </label>
                            <Select
                                options={classeOptions}
                                value={selectedClasse}
                                onChange={handleClasseChange}
                                styles={customStyles}
                                isClearable
                                placeholder="Toutes les classes"
                                isDisabled={niveauId && classeOptions.length === 1}
                            />
                        </div>

                        {/* Sélecteur résultats par page */}
                        <div className="w-full xl:w-40">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📄 Affichage
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
                                <svg className="w-4 h-4 flex-shrink-0 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>

                {/* Indicateurs de filtres actifs */}
                {(search || classeId || niveauId) && (
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
                                        onClick={() => removeFilter('search')}
                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                        title="Supprimer ce filtre"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {classeId && (
                                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-blue-800 flex items-center gap-2 border border-blue-200 shadow-sm">
                                    <span className="font-medium">Classe:</span> {classes.find(c => c.id == classeId)?.nom}
                                    <button
                                        onClick={() => removeFilter('classe')}
                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                        title="Supprimer ce filtre"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {niveauId && (
                                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-blue-800 flex items-center gap-2 border border-blue-200 shadow-sm">
                                    <span className="font-medium">Niveau:</span> {niveaux.find(n => n.id == niveauId)?.nom}
                                    <button
                                        onClick={() => removeFilter('niveau')}
                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                        title="Supprimer ce filtre"
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Tout effacer
                            </button>
                        </div>
                    </div>
                )}
                {/* Liste des Inscriptions */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* En-tête du tableau (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        <div className="col-span-3">Élève</div>
                        <div className="col-span-2">Classe</div>
                        <div className="col-span-2">Année Scolaire</div>
                        <div className="col-span-2">Date d'inscription</div>
                        <div className="col-span-2">Statut</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {inscriptions.data.map((inscription) => (
                            <div key={inscription.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                <div className="px-6 py-6">
                                    {/* Version Mobile */}
                                    <div className="lg:hidden space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        {inscription.eleve?.prenom[0]}{inscription.eleve?.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {inscription.eleve?.prenom} {inscription.eleve?.nom}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{inscription.classe?.nom}</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(inscription.statut)}`}>
                                                {inscription.statut === 'actif' ? 'Actif' : 'Inactif'}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {inscription.annee_scolaire?.nom}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-600">
                                                    Niveau: {inscription.classe?.niveau?.nom}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={`/inscriptions/${inscription.id}`}
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                        title="Voir les détails"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        href={`/inscriptions/${inscription.id}/edit`}
                                                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(inscription)}
                                                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Version Desktop */}
                                    <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
                                        <div className="col-span-3">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        {inscription.eleve?.prenom[0]}{inscription.eleve?.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {inscription.eleve?.prenom} {inscription.eleve?.nom}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Niveau: {inscription.classe?.niveau?.nom}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-lg font-medium text-gray-900">
                                                {inscription.classe?.nom}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-lg font-medium text-gray-900">
                                                {inscription.annee_scolaire?.nom}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">
                                                {new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {new Date(inscription.date_inscription).toLocaleTimeString('fr-FR')}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(inscription.statut)}`}>
                                                {inscription.statut === 'actif' ? 'Actif' : 'Inactif'}
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/inscriptions/${inscription.id}`}
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                                    title="Voir les détails"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={`/inscriptions/${inscription.id}/edit`}
                                                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(inscription)}
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                    title="Supprimer"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message vide */}
                    {inscriptions.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune inscription trouvée</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search
                                    ? 'Aucune inscription ne correspond à vos critères de recherche.'
                                    : 'Commencez par inscrire vos premiers élèves.'}
                            </p>
                            <Link
                                href="/inscriptions/create"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvelle Inscription
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {inscriptions.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{inscriptions.from}</span> à <span className="font-semibold">{inscriptions.to}</span> sur <span className="font-semibold">{inscriptions.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {inscriptions.links.map((link, index) => (
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