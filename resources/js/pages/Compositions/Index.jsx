import React, { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Select from 'react-select';

const Index = ({ compositions, trimestres, classes, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.q || '');
    const [selectedTrimestre, setSelectedTrimestre] = useState(filters?.trimestre_id || '');
    const [selectedClasse, setSelectedClasse] = useState(filters?.classe_id || '');
    const [selectedType, setSelectedType] = useState(filters?.is_controle || '');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingComposition, setEditingComposition] = useState(null);
    const [formData, setFormData] = useState({
        trimestre_id: '',
        classe_id: '',
        nom: '',
        date: '',
        langue: 'fr',
        is_controle: false
    });

    // Préparer les options pour les filtres
    const trimestreOptions = useMemo(() => [
        { value: '', label: 'Tous les trimestres' },
        ...trimestres.map((trimestre) => ({
            value: trimestre.id,
            label: trimestre.nom,
            ...trimestre
        }))
    ], [trimestres]);

    const classeOptions = useMemo(() => [
        { value: '', label: 'Toutes les classes' },
        ...classes.map((classe) => ({
            value: classe.id,
            label: classe.nom,
            ...classe
        }))
    ], [classes]);

    const typeOptions = [
        { value: '', label: 'Tous les types' },
        { value: 'false', label: 'Composition normale' },
        { value: 'true', label: 'Contrôle continu' }
    ];

    const langueOptions = [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'Anglais' },
        { value: 'ar', label: 'Arabe' }
    ];

    // Styles personnalisés pour react-select
    const customStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '48px',
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
            padding: '10px 16px',
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
        const filters = {
            q: value,
            trimestre_id: selectedTrimestre,
            classe_id: selectedClasse,
            is_controle: selectedType
        };
        router.get('/compositions', filters, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handleFilterChange = (filterType, value) => {
        const newFilters = {
            q: search,
            trimestre_id: filterType === 'trimestre' ? value : selectedTrimestre,
            classe_id: filterType === 'classe' ? value : selectedClasse,
            is_controle: filterType === 'type' ? value : selectedType
        };

        if (filterType === 'trimestre') setSelectedTrimestre(value);
        if (filterType === 'classe') setSelectedClasse(value);
        if (filterType === 'type') setSelectedType(value);

        router.get('/compositions', newFilters, {
            preserveState: true,
            replace: true
        });
    };

    const resetFilters = () => {
        setSearch('');
        setSelectedTrimestre('');
        setSelectedClasse('');
        setSelectedType('');
        router.get('/compositions', {}, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (composition) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la composition "${composition.nom}" ?`)) {
            router.delete(`/compositions/${composition.id}`);
        }
    };

    const handleCreate = () => {
        setFormData({
            trimestre_id: '',
            classe_id: '',
            nom: '',
            date: '',
            langue: 'fr',
            is_controle: false
        });
        setShowCreateModal(true);
    };

    const handleEdit = (composition) => {
        setFormData({
            trimestre_id: composition.trimestre_id,
            classe_id: composition.classe_id,
            nom: composition.nom,
            date: composition.date,
            langue: composition.langue || 'fr',
            is_controle: composition.is_controle || false
        });
        setEditingComposition(composition);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingComposition) {
            router.put(`/compositions/${editingComposition.id}`, formData, {
                onSuccess: () => {
                    setEditingComposition(null);
                    setFormData({ trimestre_id: '', classe_id: '', nom: '', date: '', langue: 'fr', is_controle: false });
                }
            });
        } else {
            router.post('/compositions', formData, {
                onSuccess: () => {
                    setShowCreateModal(false);
                    setFormData({ trimestre_id: '', classe_id: '', nom: '', date: '', langue: 'fr', is_controle: false });
                }
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const resetForm = () => {
        setFormData({ trimestre_id: '', classe_id: '', nom: '', date: '', langue: 'fr', is_controle: false });
        setEditingComposition(null);
        setShowCreateModal(false);
    };

    // Valeurs sélectionnées pour les filtres
    const selectedTrimestreValue = trimestreOptions.find(opt => opt.value == selectedTrimestre) || null;
    const selectedClasseValue = classeOptions.find(opt => opt.value == selectedClasse) || null;
    const selectedTypeValue = typeOptions.find(opt => opt.value == selectedType) || null;

    return (
        <AppLayout>
            <Head title="Gestion des Compositions" />

            {/* Alertes */}
            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium text-green-800">{flash.success}</p>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium text-red-800">{flash.error}</p>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Gestion des Compositions
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Organisez les compositions et évaluations
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvelle Composition
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6 space-y-4 lg:space-y-0">
                        {/* Champ de recherche */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                                    placeholder="Rechercher une composition par nom, matière..."
                                    defaultValue={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                    className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                                />
                                {/* Bouton effacer intégré */}
                                {search && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            onClick={() => {
                                                setSearch('');
                                                handleSearch('');
                                            }}
                                            className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-full hover:bg-blue-50"
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

                        {/* Sélecteur trimestre */}
                        <div className="w-full lg:w-64">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                📅 Trimestre
                            </label>
                            <Select
                                options={trimestreOptions}
                                value={selectedTrimestreValue}
                                onChange={(selectedOption) => handleFilterChange('trimestre', selectedOption?.value || '')}
                                styles={customStyles}
                                isClearable
                                placeholder="Tous les trimestres"
                            />
                        </div>

                        {/* Sélecteur classe */}
                        <div className="w-full lg:w-64">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                🏫 Classe
                            </label>
                            <Select
                                options={classeOptions}
                                value={selectedClasseValue}
                                onChange={(selectedOption) => handleFilterChange('classe', selectedOption?.value || '')}
                                styles={customStyles}
                                isClearable
                                placeholder="Toutes les classes"
                            />
                        </div>

                        {/* Sélecteur type */}
                        <div className="w-full lg:w-64">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                📝 Type
                            </label>
                            <Select
                                options={typeOptions}
                                value={selectedTypeValue}
                                onChange={(selectedOption) => handleFilterChange('type', selectedOption?.value || '')}
                                styles={customStyles}
                                isClearable
                                placeholder="Tous les types"
                            />
                        </div>

                        {/* Bouton réinitialiser */}
                        <div className="w-full lg:w-auto">
                            <button
                                onClick={resetFilters}
                                className="w-full lg:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Réinitialiser
                            </button>
                        </div>
                    </div>

                    {/* Indicateurs de filtres actifs */}
                    {(search || selectedTrimestreValue || selectedClasseValue || selectedTypeValue) && (
                        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
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
                                                handleSearch('');
                                            }}
                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                            title="Supprimer la recherche"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}

                                {selectedTrimestreValue && (
                                    <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-blue-800 flex items-center gap-2 border border-blue-200 shadow-sm">
                                        <span className="font-medium">Trimestre:</span> {trimestreOptions.find(t => t.value === selectedTrimestreValue)?.label}
                                        <button
                                            onClick={() => handleFilterChange('trimestre', '')}
                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                            title="Supprimer le filtre trimestre"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}

                                {selectedClasseValue && (
                                    <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-blue-800 flex items-center gap-2 border border-blue-200 shadow-sm">
                                        <span className="font-medium">Classe:</span> {classeOptions.find(c => c.value === selectedClasseValue)?.label}
                                        <button
                                            onClick={() => handleFilterChange('classe', '')}
                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                            title="Supprimer le filtre classe"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}

                                {selectedTypeValue && (
                                    <span className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-blue-800 flex items-center gap-2 border border-blue-200 shadow-sm">
                                        <span className="font-medium">Type:</span> {typeOptions.find(t => t.value === selectedTypeValue)?.label}
                                        <button
                                            onClick={() => handleFilterChange('type', '')}
                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors ml-1"
                                            title="Supprimer le filtre type"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Liste des Compositions */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Liste des Compositions ({compositions.total})
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Classe</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trimestre</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Langue</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Matières</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {compositions.data.map((composition) => (
                                    <tr key={composition.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{composition.nom}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {composition.matieres_count} matière(s)
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${composition.is_controle
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {composition.is_controle ? (
                                                    <>
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Contrôle
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Composition
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {composition.classe?.nom || 'N/A'}
                                                {composition.classe?.niveau && (
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({composition.classe.niveau.nom})
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {composition.trimestre?.nom || 'N/A'}
                                                {composition.trimestre?.annee_scolaire && (
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({composition.trimestre.annee_scolaire.nom})
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {formatDate(composition.date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {composition.langue ? composition.langue.toUpperCase() : 'FR'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {composition.matieres_count} matière(s)
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {composition.notes_count} note(s) saisie(s)
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/compositions/${composition.id}`}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Voir détails"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleEdit(composition)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(composition)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Message vide */}
                    {compositions.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune composition trouvée</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search || selectedTrimestre || selectedClasse || selectedType
                                    ? 'Aucune composition ne correspond à vos critères de recherche.'
                                    : 'Commencez par créer votre première composition.'}
                            </p>
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer la première composition
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {compositions.data.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="text-sm text-gray-700">
                                Affichage de <span className="font-semibold">{compositions.from}</span> à <span className="font-semibold">{compositions.to}</span> sur <span className="font-semibold">{compositions.total}</span> résultats
                            </div>
                            <div className="flex space-x-1">
                                {compositions.links.map((link, index) => (
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
            </div>

            {/* Modal de création/édition */}
            {(showCreateModal || editingComposition) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                            <h2 className="text-2xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                {editingComposition ? 'Modifier la Composition' : 'Nouvelle Composition'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom de la composition *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    placeholder="Ex: Composition de Mathématiques"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Type de composition
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="is_controle"
                                            checked={!formData.is_controle}
                                            onChange={() => setFormData({ ...formData, is_controle: false })}
                                            className="hidden"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 ${!formData.is_controle ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                            }`}>
                                            {!formData.is_controle && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <span className="text-gray-700">Composition normale</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="is_controle"
                                            checked={formData.is_controle}
                                            onChange={() => setFormData({ ...formData, is_controle: true })}
                                            className="hidden"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 ${formData.is_controle ? 'border-green-500 bg-green-500' : 'border-gray-300'
                                            }`}>
                                            {formData.is_controle && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <span className="text-gray-700">Contrôle continu</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Trimestre *
                                </label>
                                <select
                                    value={formData.trimestre_id}
                                    onChange={(e) => setFormData({ ...formData, trimestre_id: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    required
                                >
                                    <option value="">Sélectionner un trimestre</option>
                                    {trimestres && trimestres.map((trimestre) => (
                                        <option key={trimestre.id} value={trimestre.id}>
                                            {trimestre.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Classe *
                                </label>
                                <select
                                    value={formData.classe_id}
                                    onChange={(e) => setFormData({ ...formData, classe_id: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    required
                                >
                                    <option value="">Sélectionner une classe</option>
                                    {classes && classes.map((classe) => (
                                        <option key={classe.id} value={classe.id}>
                                            {classe.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Langue *
                                </label>
                                <select
                                    value={formData.langue}
                                    onChange={(e) => setFormData({ ...formData, langue: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    required
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">Anglais</option>
                                    <option value="ar">Arabe</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {editingComposition ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
};

export default Index;