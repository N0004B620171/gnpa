
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Select from 'react-select';

const BulletinIndex = ({ bulletins, classes, trimestres, anneesScolaires, compositions, filters, stats }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [classeId, setClasseId] = useState(filters.classe_id || '');
    const [trimestreId, setTrimestreId] = useState(filters.trimestre_id || '');
    const [anneeScolaireId, setAnneeScolaireId] = useState(filters.annee_scolaire_id || '');
    const [compositionId, setCompositionId] = useState(filters.composition_id || '');
    const [annuel, setAnnuel] = useState(filters.annuel || false);
    const [perPage, setPerPage] = useState(filters.perPage || 20);
    const [showBulkGenerate, setShowBulkGenerate] = useState(false);
    const [showBulkPrint, setShowBulkPrint] = useState(false);
    const [selectedBulletins, setSelectedBulletins] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [bulkForm, setBulkForm] = useState({
        classe_id: '',
        trimestre_id: '',
        annuel: false
    });

    const [bulkPrintForm, setBulkPrintForm] = useState({
        classe_id: '',
        trimestre_id: '',
        composition_id: '',
        annuel: false,
        format: 'pdf'
    });

    // Préparer les options pour React Select
    const classeOptions = useMemo(() => [
        { value: '', label: 'Toutes les classes' },
        ...classes.map((classe) => ({
            value: classe.id,
            label: `${classe.nom} - ${classe.niveau?.nom}`,
            ...classe
        }))
    ], [classes]);

    const trimestreOptions = useMemo(() => [
        { value: '', label: 'Tous les trimestres' },
        ...trimestres.map((trimestre) => ({
            value: trimestre.id,
            label: `${trimestre.nom} - ${trimestre.annee_scolaire?.nom}`,
            ...trimestre
        }))
    ], [trimestres]);

    const anneeScolaireOptions = useMemo(() => [
        { value: '', label: 'Toutes les années' },
        ...anneesScolaires.map((annee) => ({
            value: annee.id,
            label: annee.nom,
            ...annee
        }))
    ], [anneesScolaires]);

    const compositionOptions = useMemo(() => [
        { value: '', label: 'Toutes les compositions' },
        ...compositions.map((composition) => ({
            value: composition.id,
            label: `${composition.nom} - ${composition.classe?.nom}`,
            ...composition
        }))
    ], [compositions]);

    // Styles personnalisés pour React Select
    const customStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '44px',
            borderRadius: '10px',
            border: `2px solid ${state.isFocused ? '#3b82f6' : '#e5e7eb'}`,
            boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#3b82f6' : '#d1d5db'
            },
            backgroundColor: 'white',
            fontSize: '14px'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
            padding: '8px 12px',
            fontSize: '14px',
            '&:active': {
                backgroundColor: state.isSelected ? '#3b82f6' : '#e5e7eb'
            }
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 50
        }),
        menuList: (base) => ({
            ...base,
            borderRadius: '8px',
            padding: '2px'
        }),
        placeholder: (base) => ({
            ...base,
            color: '#6b7280',
            fontSize: '14px'
        }),
        singleValue: (base) => ({
            ...base,
            color: '#1f2937',
            fontSize: '14px'
        }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? '#3b82f6' : '#6b7280',
            padding: '8px',
            '&:hover': {
                color: '#3b82f6'
            }
        }),
        clearIndicator: (base) => ({
            ...base,
            color: '#6b7280',
            padding: '8px',
            '&:hover': {
                color: '#ef4444'
            }
        })
    };

    // Fonction de filtrage avec useCallback pour éviter les re-renders inutiles
    const handleFilter = useCallback(() => {
        router.get('/bulletins', {
            search,
            classe_id: classeId,
            trimestre_id: trimestreId,
            annee_scolaire_id: anneeScolaireId,
            composition_id: compositionId,
            annuel: annuel,
            perPage
        }, {
            preserveState: true,
            replace: true
        });
    }, [search, classeId, trimestreId, anneeScolaireId, compositionId, annuel, perPage]);

    // Déclencher le filtrage automatiquement quand les filtres changent
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleFilter();
        }, 300); // Délai de 300ms pour éviter trop de requêtes

        return () => clearTimeout(timeoutId);
    }, [handleFilter]);

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        setSearch(value);
    }, 500);

    // Handlers spécifiques pour les React Select
    const handleClasseChange = (selectedOption) => {
        setClasseId(selectedOption?.value || '');
    };

    const handleTrimestreChange = (selectedOption) => {
        setTrimestreId(selectedOption?.value || '');
    };

    const handleAnneeScolaireChange = (selectedOption) => {
        setAnneeScolaireId(selectedOption?.value || '');
    };

    const handleCompositionChange = (selectedOption) => {
        setCompositionId(selectedOption?.value || '');
    };

    const handleAnnuelChange = (e) => {
        setAnnuel(e.target.checked);
    };

    const handlePerPageChange = (e) => {
        setPerPage(e.target.value);
    };

    const handleBulkGenerate = (e) => {
        e.preventDefault();
        if (!bulkForm.classe_id || (!bulkForm.trimestre_id && !bulkForm.annuel)) {
            alert('Veuillez sélectionner une classe et un trimestre');
            return;
        }

        router.post('/bulletins/bulk-generate', bulkForm, {
            onSuccess: () => {
                setShowBulkGenerate(false);
                setBulkForm({ classe_id: '', trimestre_id: '', annuel: false });
            }
        });
    };

    const handleBulkPrint = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (bulkPrintForm.classe_id) params.append('classe_id', bulkPrintForm.classe_id);
        if (bulkPrintForm.trimestre_id) params.append('trimestre_id', bulkPrintForm.trimestre_id);
        if (bulkPrintForm.composition_id) params.append('composition_id', bulkPrintForm.composition_id);
        if (bulkPrintForm.annuel) params.append('annuel', 'true');
        params.append('format', bulkPrintForm.format);

        window.open(`/bulletins/bulk-download?${params.toString()}`, '_blank');
        setShowBulkPrint(false);
    };

    const handleDelete = (bulletinId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce bulletin ?')) {
            return;
        }
        router.delete(`/bulletins/${bulletinId}`);
    };

    const downloadPDF = (bulletinId) => {
        window.open(`/bulletins/${bulletinId}/download`, '_blank');
    };

    const toggleBulletinSelection = (bulletinId) => {
        setSelectedBulletins(prev =>
            prev.includes(bulletinId)
                ? prev.filter(id => id !== bulletinId)
                : [...prev, bulletinId]
        );
    };

    const downloadSelectedBulletins = () => {
        if (selectedBulletins.length === 0) {
            alert('Veuillez sélectionner au moins un bulletin');
            return;
        }
        const ids = selectedBulletins.join(',');
        window.open(`/bulletins/bulk-download?ids=${ids}`, '_blank');
    };

    const getMoyenneColor = (moyenne) => {
        if (moyenne >= 16) return 'text-green-700 bg-green-100 border-green-300';
        if (moyenne >= 14) return 'text-blue-700 bg-blue-100 border-blue-300';
        if (moyenne >= 12) return 'text-indigo-700 bg-indigo-100 border-indigo-300';
        if (moyenne >= 10) return 'text-orange-700 bg-orange-100 border-orange-300';
        return 'text-red-700 bg-red-100 border-red-300';
    };

    const getRangColor = (rang) => {
        if (rang === 1) return 'text-yellow-700 bg-yellow-100 border-yellow-300';
        if (rang <= 3) return 'text-green-700 bg-green-100 border-green-300';
        if (rang <= 10) return 'text-blue-700 bg-blue-100 border-blue-300';
        return 'text-gray-700 bg-gray-100 border-gray-300';
    };

    // Valeurs sélectionnées pour React Select
    const selectedClasse = classeOptions.find(opt => opt.value == classeId) || null;
    const selectedTrimestre = trimestreOptions.find(opt => opt.value == trimestreId) || null;
    const selectedAnneeScolaire = anneeScolaireOptions.find(opt => opt.value == anneeScolaireId) || null;
    const selectedComposition = compositionOptions.find(opt => opt.value == compositionId) || null;

    useEffect(() => {
        if (flash?.success) {
            console.log(flash.success);
        }
        if (flash?.error) {
            console.error(flash?.error);
        }
    }, [flash]);

    return (
        <AppLayout>
            <Head title="Gestion des Bulletins" />

            {/* Alertes */}
            {flash?.success && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
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
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-6 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Gestion des Bulletins
                            </h1>
                            <p className="text-blue-100 mt-1">
                                Gérez et consultez les bulletins des élèves
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
                            <button
                                onClick={() => setShowBulkPrint(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/30 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Impression Groupée
                            </button>
                            <button
                                onClick={() => setShowBulkGenerate(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/30 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Génération Groupée
                            </button>
                            <Link
                                href="/bulletins/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nouveau Bulletin
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Bulletins</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Trimestriels</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.trimestriels}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Annuels</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.annuels}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Moyenne Générale</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {parseFloat(stats.moyenne_generale).toFixed(2)}/20
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Bouton filtre mobile */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg"
                    >
                        <span className="font-medium">Filtres</span>
                        <svg className={`h-5 w-5 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                <div
                    className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 transition-all duration-300 ${isFilterOpen ? 'block' : 'hidden lg:block'
                        }`}
                >
                    {/* Ligne 1 : Recherche + filtres principaux */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                        {/* Recherche */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🔍 Recherche
                            </label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Élève, classe, année..."
                                    defaultValue={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Classe */}
                        <div>
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

                        {/* Trimestre */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📅 Trimestre
                            </label>
                            <Select
                                options={trimestreOptions}
                                value={selectedTrimestre}
                                onChange={handleTrimestreChange}
                                styles={customStyles}
                                isClearable
                                placeholder="Tous"
                            />
                        </div>

                        {/* Année scolaire */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🎓 Année
                            </label>
                            <Select
                                options={anneeScolaireOptions}
                                value={selectedAnneeScolaire}
                                onChange={handleAnneeScolaireChange}
                                styles={customStyles}
                                isClearable
                                placeholder="Toutes"
                            />
                        </div>
                    </div>

                    {/* Ligne 2 : Filtres secondaires + actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                        {/* Composition */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📝 Composition
                            </label>
                            <Select
                                options={compositionOptions}
                                value={selectedComposition}
                                onChange={handleCompositionChange}
                                styles={customStyles}
                                isClearable
                                placeholder="Toutes"
                            />
                        </div>

                        {/* Options */}
                        <div className="flex items-center space-x-6">
                            <label className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={annuel}
                                    onChange={handleAnnuelChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 font-medium">
                                    📊 Bulletin annuel
                                </span>
                            </label>
                        </div>

                        {/* Pagination */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📄 Par page
                            </label>
                            <select
                                value={perPage}
                                onChange={handlePerPageChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="10">10 éléments</option>
                                <option value="20">20 éléments</option>
                                <option value="50">50 éléments</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setClasseId('');
                                    setTrimestreId('');
                                    setAnneeScolaireId('');
                                    setCompositionId('');
                                    setAnnuel(false);
                                }}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 font-medium text-sm"
                            >
                                🔄 Réinitialiser
                            </button>
                            <button
                                type="button"
                                onClick={handleFilter}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm"
                            >
                                ✅ Appliquer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal de génération groupée */}
                {showBulkGenerate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Génération Groupée de Bulletins
                            </h3>
                            <form onSubmit={handleBulkGenerate}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Classe *
                                        </label>
                                        <Select
                                            options={classeOptions.filter(opt => opt.value !== '')}
                                            value={classeOptions.find(opt => opt.value === bulkForm.classe_id)}
                                            onChange={(selectedOption) => setBulkForm({ ...bulkForm, classe_id: selectedOption?.value || '' })}
                                            styles={customStyles}
                                            placeholder="Sélectionnez une classe"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={bulkForm.annuel}
                                                onChange={(e) => setBulkForm({ ...bulkForm, annuel: e.target.checked, trimestre_id: '' })}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">Bulletin Annuel</span>
                                        </label>
                                    </div>

                                    {!bulkForm.annuel && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Trimestre *
                                            </label>
                                            <Select
                                                options={trimestreOptions.filter(opt => opt.value !== '')}
                                                value={trimestreOptions.find(opt => opt.value === bulkForm.trimestre_id)}
                                                onChange={(selectedOption) => setBulkForm({ ...bulkForm, trimestre_id: selectedOption?.value || '' })}
                                                styles={customStyles}
                                                placeholder="Sélectionnez un trimestre"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowBulkGenerate(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Générer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal d'impression groupée */}
                {showBulkPrint && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Impression Groupée de Bulletins
                            </h3>
                            <form onSubmit={handleBulkPrint}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Classe
                                        </label>
                                        <Select
                                            options={classeOptions}
                                            value={classeOptions.find(opt => opt.value === bulkPrintForm.classe_id)}
                                            onChange={(selectedOption) => setBulkPrintForm({ ...bulkPrintForm, classe_id: selectedOption?.value || '' })}
                                            styles={customStyles}
                                            placeholder="Toutes les classes"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Composition
                                        </label>
                                        <Select
                                            options={compositionOptions}
                                            value={compositionOptions.find(opt => opt.value === bulkPrintForm.composition_id)}
                                            onChange={(selectedOption) => setBulkPrintForm({ ...bulkPrintForm, composition_id: selectedOption?.value || '' })}
                                            styles={customStyles}
                                            placeholder="Toutes les compositions"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={bulkPrintForm.annuel}
                                                onChange={(e) => setBulkPrintForm({ ...bulkPrintForm, annuel: e.target.checked, trimestre_id: '' })}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">Bulletin Annuel</span>
                                        </label>
                                    </div>

                                    {!bulkPrintForm.annuel && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Trimestre
                                            </label>
                                            <Select
                                                options={trimestreOptions}
                                                value={trimestreOptions.find(opt => opt.value === bulkPrintForm.trimestre_id)}
                                                onChange={(selectedOption) => setBulkPrintForm({ ...bulkPrintForm, trimestre_id: selectedOption?.value || '' })}
                                                styles={customStyles}
                                                placeholder="Tous les trimestres"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Format
                                        </label>
                                        <select
                                            value={bulkPrintForm.format}
                                            onChange={(e) => setBulkPrintForm({ ...bulkPrintForm, format: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="pdf">PDF</option>
                                            <option value="excel">Excel</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowBulkPrint(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                                    >
                                        Imprimer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Actions groupées */}
                {selectedBulletins.length > 0 && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-2">
                                <span className="text-blue-700 font-medium">
                                    {selectedBulletins.length} bulletin(s) sélectionné(s)
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={downloadSelectedBulletins}
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Télécharger sélection
                                </button>
                                <button
                                    onClick={() => setSelectedBulletins([])}
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Liste des Bulletins */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    {/* En-tête du tableau (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        <div className="col-span-1"></div>
                        <div className="col-span-2">Élève</div>
                        <div className="col-span-2">Classe & Année</div>
                        <div className="col-span-2">Période</div>
                        <div className="col-span-2">Résultats</div>
                        <div className="col-span-3 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {bulletins.data.map((bulletin) => (
                            <div key={bulletin.id} className="hover:bg-gray-50 transition-colors">
                                <div className="px-4 py-4">
                                    {/* Version Desktop */}
                                    <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedBulletins.includes(bulletin.id)}
                                                onChange={() => toggleBulletinSelection(bulletin.id)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-sm">
                                                        {bulletin.eleve_nom.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {bulletin.eleve_nom}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {bulletin.niveau_nom}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm font-medium text-gray-900">
                                                {bulletin.classe_nom}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {bulletin.annee_scolaire_nom}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm font-medium text-gray-900">
                                                {bulletin.trimestre_nom}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {bulletin.annuel ? 'Annuel' : 'Trimestriel'}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center space-x-2">
                                                <div className={`px-2 py-1 rounded text-xs font-bold ${getMoyenneColor(bulletin.moyenne_eleve)}`}>
                                                    {bulletin.moyenne_eleve}/20
                                                </div>
                                                <div className={`px-2 py-1 rounded text-xs font-medium ${getRangColor(bulletin.rang)}`}>
                                                    #{bulletin.rang}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-600 mt-1">
                                                Classe: {bulletin.moyenne_classe}/20
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <div className="flex items-center justify-end space-x-1">
                                                <Link
                                                    href={`/bulletins/${bulletin.id}`}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Détails
                                                </Link>
                                                <button
                                                    onClick={() => downloadPDF(bulletin.id)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    PDF
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bulletin.id)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Version Mobile */}
                                    <div className="lg:hidden space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBulletins.includes(bulletin.id)}
                                                    onChange={() => toggleBulletinSelection(bulletin.id)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                                                />
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-sm">
                                                        {bulletin.eleve_nom.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        {bulletin.eleve_nom}
                                                    </h3>
                                                    <p className="text-xs text-gray-600">{bulletin.classe_nom}</p>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-bold ${getMoyenneColor(bulletin.moyenne_eleve)}`}>
                                                {bulletin.moyenne_eleve}/20
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="font-medium">Année:</span> {bulletin.annee_scolaire_nom}
                                            </div>
                                            <div>
                                                <span className="font-medium">Période:</span> {bulletin.trimestre_nom}
                                            </div>
                                            <div>
                                                <span className="font-medium">Type:</span> {bulletin.annuel ? 'Annuel' : 'Trimestriel'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Rang:</span>
                                                <span className={`ml-1 px-1 rounded ${getRangColor(bulletin.rang)}`}>
                                                    #{bulletin.rang}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                            <div className="text-xs text-gray-600">
                                                Classe: {bulletin.moyenne_classe}/20
                                            </div>
                                            <div className="flex space-x-1">
                                                <Link
                                                    href={`/bulletins/${bulletin.id}`}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Détails
                                                </Link>
                                                <button
                                                    onClick={() => downloadPDF(bulletin.id)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    PDF
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bulletin.id)}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    {bulletins.data.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun bulletin</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Aucun bulletin trouvé avec les critères de recherche actuels.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {bulletins.data.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-medium">{bulletins.from}</span> à <span className="font-medium">{bulletins.to}</span> sur <span className="font-medium">{bulletins.total}</span> résultats
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {bulletins.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                            ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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

export default BulletinIndex;