
import React, { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Select from 'react-select';

const Index = ({ eleves, classes, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [classeId, setClasseId] = useState(filters.classe_id || '');
    const [statut, setStatut] = useState(filters.statut || '');
    const [inscriptionStatut, setInscriptionStatut] = useState(filters.inscription_statut || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);

    // Préparer les options pour react-select
    const classeOptions = useMemo(() => [
        { value: '', label: 'Toutes les classes' },
        ...classes.map((classe) => ({
            value: classe.id,
            label: ` ${classe.niveau?.nom} ${classe.nom}`,
            ...classe
        }))
    ], [classes]);

    const statutOptions = [
        { value: '', label: 'Tous les statuts' },
        { value: 'avec_parent', label: 'Avec parent' },
        { value: 'sans_parent', label: 'Sans parent' }
    ];

    const inscriptionStatutOptions = [
        { value: '', label: 'Tous les élèves' },
        { value: 'inscrit', label: 'Inscrits' },
        { value: 'non_inscrit', label: 'Non inscrits' }
    ];

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
            border: `2px solid ${state.isFocused ? '#10b981' : '#e5e7eb'}`,
            boxShadow: state.isFocused ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#10b981' : '#d1d5db'
            },
            backgroundColor: 'white'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#d1fae5' : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
            padding: '12px 16px',
            fontSize: '14px',
            '&:active': {
                backgroundColor: state.isSelected ? '#10b981' : '#a7f3d0'
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
            color: state.isFocused ? '#10b981' : '#6b7280',
            '&:hover': {
                color: '#10b981'
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

    const updateFilters = (newFilters) => {
        router.get('/eleves', {
            search: newFilters.search !== undefined ? newFilters.search : search,
            classe_id: newFilters.classe_id !== undefined ? newFilters.classe_id : classeId,
            statut: newFilters.statut !== undefined ? newFilters.statut : statut,
            inscription_statut: newFilters.inscription_statut !== undefined ? newFilters.inscription_statut : inscriptionStatut,
            perPage: newFilters.perPage !== undefined ? newFilters.perPage : perPage
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleClasseChange = (selectedOption) => {
        const value = selectedOption?.value || '';
        setClasseId(value);
        updateFilters({ classe_id: value });
    };

    const handleStatutChange = (selectedOption) => {
        const value = selectedOption?.value || '';
        setStatut(value);
        updateFilters({ statut: value });
    };

    const handleInscriptionStatutChange = (selectedOption) => {
        const value = selectedOption?.value || '';
        setInscriptionStatut(value);
        updateFilters({ inscription_statut: value });
    };

    const handlePerPageChange = (selectedOption) => {
        const value = selectedOption?.value || '10';
        setPerPage(value);
        updateFilters({ perPage: value });
    };

    const resetFilters = () => {
        setSearch('');
        setClasseId('');
        setStatut('');
        setInscriptionStatut('');
        setPerPage(10);
        router.get('/eleves', {}, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (eleve) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${eleve.prenom} ${eleve.nom} ?`)) {
            router.delete(`/eleves/${eleve.id}`);
        }
    };

    const getInscriptionActuelle = (eleve) => {
        return eleve.inscriptions?.find(ins => ins.statut === 'actif');
    };

    // Valeurs sélectionnées pour react-select
    const selectedClasse = classeOptions.find(opt => opt.value == classeId) || null;
    const selectedStatut = statutOptions.find(opt => opt.value == statut) || null;
    const selectedInscriptionStatut = inscriptionStatutOptions.find(opt => opt.value == inscriptionStatut) || null;
    const selectedPerPage = perPageOptions.find(opt => opt.value == perPage.toString()) || perPageOptions[0];

    return (
        <AppLayout>
            <Head title="Liste des Élèves" />

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
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                                </svg>
                                Liste des Élèves
                            </h1>
                            <p className="text-emerald-100 mt-2 text-lg">
                                Gérez les élèves et leurs inscriptions
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <Link
                                href="/eleves/create"
                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvel Élève
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
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Rechercher un élève..."
                    defaultValue={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 hover:border-gray-300"
                />
            </div>
        </div>

        {/* Sélecteur classe */}
        <div className="w-full xl:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏫 Classe
            </label>
            <Select
                options={classeOptions}
                value={selectedClasse}
                onChange={handleClasseChange}
                styles={customStyles}
                isClearable
                placeholder="Toutes"
            />
        </div>

        {/* Sélecteur statut parent */}
        <div className="w-full xl:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                👨‍👩‍👧‍👦 Parent
            </label>
            <Select
                options={statutOptions}
                value={selectedStatut}
                onChange={handleStatutChange}
                styles={customStyles}
                isClearable
                placeholder="Tous"
            />
        </div>

        {/* Sélecteur inscription */}
        <div className="w-full xl:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Inscription
            </label>
            <Select
                options={inscriptionStatutOptions}
                value={selectedInscriptionStatut}
                onChange={handleInscriptionStatutChange}
                styles={customStyles}
                isClearable
                placeholder="Tous"
            />
        </div>

        {/* Sélecteur résultats par page */}
        <div className="w-full xl:w-32">
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
{(search || classeId || statut || inscriptionStatut) && (
    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtres actifs :
            </span>
            
            {search && (
                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-emerald-800 flex items-center gap-2 border border-emerald-200 shadow-sm">
                    <span className="font-medium">Recherche:</span> "{search}"
                    <button
                        onClick={() => {
                            setSearch('');
                            updateFilters({ search: '' });
                        }}
                        className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                        title="Supprimer la recherche"
                    >
                        ×
                    </button>
                </span>
            )}
            
            {classeId && (
                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-emerald-800 flex items-center gap-2 border border-emerald-200 shadow-sm">
                    <span className="font-medium">Classe:</span> {classes.find(c => c.id == classeId)?.nom}
                    <button
                        onClick={() => {
                            setClasseId('');
                            updateFilters({ classe_id: '' });
                        }}
                        className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                        title="Supprimer le filtre classe"
                    >
                        ×
                    </button>
                </span>
            )}
            
            {statut && (
                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-emerald-800 flex items-center gap-2 border border-emerald-200 shadow-sm">
                    <span className="font-medium">Parent:</span> {statut === 'avec_parent' ? 'Avec parent' : 'Sans parent'}
                    <button
                        onClick={() => {
                            setStatut('');
                            updateFilters({ statut: '' });
                        }}
                        className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                        title="Supprimer le filtre parent"
                    >
                        ×
                    </button>
                </span>
            )}
            
            {inscriptionStatut && (
                <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-emerald-800 flex items-center gap-2 border border-emerald-200 shadow-sm">
                    <span className="font-medium">Inscription:</span> {inscriptionStatut === 'inscrit' ? 'Inscrits' : 'Non inscrits'}
                    <button
                        onClick={() => {
                            setInscriptionStatut('');
                            updateFilters({ inscription_statut: '' });
                        }}
                        className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                        title="Supprimer le filtre inscription"
                    >
                        ×
                    </button>
                </span>
            )}
            
            <button
                onClick={resetFilters}
                className="ml-auto text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Tout effacer
            </button>
        </div>
    </div>
)}

                {/* Liste des Élèves */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* En-tête du tableau (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-emerald-50 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        <div className="col-span-3">Élève</div>
                        <div className="col-span-2">Informations</div>
                        <div className="col-span-3">Parent</div>
                        <div className="col-span-2">Classe actuelle</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {eleves.data.map((eleve) => {
                            const inscriptionActuelle = getInscriptionActuelle(eleve);

                            return (
                                <div key={eleve.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                    <div className="px-6 py-6">
                                        {/* Version Mobile */}
                                        <div className="lg:hidden space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                                                        <span className="text-emerald-600 font-bold text-lg">
                                                            {eleve.prenom[0]}{eleve.nom[0]}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {eleve.prenom} {eleve.nom}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {eleve.date_naissance_formatted || 'Date non renseignée'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}
                                                </div>

                                                {eleve.parent_eleve && (
                                                    <div className="text-sm text-gray-600">
                                                        Parent: {eleve.parent_eleve.prenom} {eleve.parent_eleve.nom}
                                                    </div>
                                                )}

                                                {inscriptionActuelle && (
                                                    <div className="flex items-center">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                            {inscriptionActuelle.classe?.niveau?.cycle?.nom} - {inscriptionActuelle.classe?.niveau?.nom} {inscriptionActuelle.classe?.nom}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex justify-end space-x-2 pt-2">
                                                    <Link
                                                        href={`/eleves/${eleve.id}`}
                                                        className="text-emerald-600 hover:text-emerald-800 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        href={`/eleves/${eleve.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(eleve)}
                                                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Version Desktop */}
                                        <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
                                            <div className="col-span-3">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                                                        <span className="text-emerald-600 font-bold text-lg">
                                                            {eleve.prenom[0]}{eleve.nom[0]}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-lg font-semibold text-gray-900">
                                                            {eleve.prenom} {eleve.nom}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {eleve.date_naissance_formatted || 'Date non renseignée'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-span-2">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {eleve.sexe === 'M' ? '👦 Masculin' : '👧 Féminin'}
                                                    </div>
                                                    {eleve.age && (
                                                        <div className="text-xs text-emerald-600">{eleve.age} ans</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-span-3">
                                                {eleve.parent_eleve ? (
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {eleve.parent_eleve.prenom} {eleve.parent_eleve.nom}
                                                        </div>
                                                        <div className="text-sm text-gray-600">{eleve.parent_eleve.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                                        Sans parent
                                                    </span>
                                                )}
                                            </div>

                                            <div className="col-span-2">
                                                {inscriptionActuelle ? (
                                                    <div className="space-y-1">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                                                            {inscriptionActuelle.classe?.niveau?.cycle?.nom} - {inscriptionActuelle.classe?.niveau?.nom}
                                                        </span>
                                                        <div className="text-xs text-gray-600">{inscriptionActuelle.classe?.nom}</div>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                                        Non inscrit
                                                    </span>
                                                )}
                                            </div>

                                            <div className="col-span-2">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={`/eleves/${eleve.id}`}
                                                        className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                                                        title="Voir détails"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <Link
                                                        href={`/eleves/${eleve.id}/edit`}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                                        title="Modifier"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(eleve)}
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
                            );
                        })}
                    </div>

                    {/* Message vide */}
                    {eleves.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun élève trouvé</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search || classeId || statut ? 'Aucun élève ne correspond à vos critères de recherche.' : 'Commencez par créer votre premier élève.'}
                            </p>
                            <Link
                                href="/eleves/create"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl hover:from-emerald-700 hover:to-teal-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer le premier élève
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {eleves.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{eleves.from}</span> à <span className="font-semibold">{eleves.to}</span> sur <span className="font-semibold">{eleves.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {eleves.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${link.active
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg'
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