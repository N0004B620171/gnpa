import React, { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Select from 'react-select';

const Index = ({ trimestres, anneeScolaires, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.q || '');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTrimestre, setSelectedTrimestre] = useState(null);
    const [formData, setFormData] = useState({
        annee_scolaire_id: '',
        numero: '',
        nom: '',
        date_debut: '',
        date_fin: '',
        bareme: 20
    });

    // Préparer les options pour react-select
    const anneeScolaireOptions = useMemo(() => [
        { value: '', label: 'Sélectionnez une année scolaire' },
        ...anneeScolaires.map((annee) => ({
            value: annee.id,
            label: `${annee.nom} ${annee.actif ? '(Active)' : ''}`,
            ...annee
        }))
    ], [anneeScolaires]);

    const numeroOptions = [
        { value: '', label: 'Sélectionnez le numéro' },
        { value: '1', label: '1 - Premier trimestre' },
        { value: '2', label: '2 - Deuxième trimestre' },
        { value: '3', label: '3 - Troisième trimestre' }
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
            zIndex: 9999
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
        router.get('/trimestres', { q: value }, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handleCreate = () => {
        setFormData({
            annee_scolaire_id: '',
            numero: '',
            nom: '',
            date_debut: '',
            date_fin: '',
            bareme: 20
        });
        setShowCreateModal(true);
    };

    const handleEdit = (trimestre) => {
        setSelectedTrimestre(trimestre);
        setFormData({
            annee_scolaire_id: trimestre.annee_scolaire_id,
            numero: trimestre.numero.toString(),
            nom: trimestre.nom,
            date_debut: trimestre.date_debut,
            date_fin: trimestre.date_fin,
            bareme: trimestre.bareme
        });
        setShowEditModal(true);
    };

    const handleSubmitCreate = (e) => {
        e.preventDefault();
        router.post('/trimestres', formData, {
            onSuccess: () => {
                setShowCreateModal(false);
                setFormData({
                    annee_scolaire_id: '',
                    numero: '',
                    nom: '',
                    date_debut: '',
                    date_fin: '',
                    bareme: 20
                });
            }
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        router.put(`/trimestres/${selectedTrimestre.id}`, formData, {
            onSuccess: () => {
                setShowEditModal(false);
                setSelectedTrimestre(null);
            }
        });
    };

    const handleDelete = (trimestre) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le trimestre "${trimestre.nom}" ? Cette action supprimera également toutes les compositions associées.`)) {
            router.delete(`/trimestres/${trimestre.id}`);
        }
    };

    const getStatusColor = (trimestre) => {
        const now = new Date();
        const start = new Date(trimestre.date_debut);
        const end = new Date(trimestre.date_fin);

        if (now < start) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (now > end) return 'bg-gray-100 text-gray-800 border-gray-200';
        return 'bg-green-100 text-green-800 border-green-200';
    };

    const getStatusText = (trimestre) => {
        const now = new Date();
        const start = new Date(trimestre.date_debut);
        const end = new Date(trimestre.date_fin);

        if (now < start) return 'À venir';
        if (now > end) return 'Terminé';
        return 'En cours';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getAnneeScolaireNom = (trimestre) => {
        return trimestre.annee_scolaire?.nom || 'N/A';
    };

    const isAnneeScolaireActive = (trimestre) => {
        return trimestre.annee_scolaire?.actif || false;
    };

    // Valeurs sélectionnées pour react-select
    const selectedAnneeScolaire = anneeScolaireOptions.find(opt => opt.value == formData.annee_scolaire_id) || null;
    const selectedNumero = numeroOptions.find(opt => opt.value == formData.numero) || null;

    return (
        <AppLayout>
            <Head title="Gestion des Trimestres" />

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Gestion des Trimestres
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Organisez les périodes d'évaluation de l'année scolaire
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
                                Nouveau Trimestre
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Champ de recherche */}
                        <div className="lg:w-96">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher un trimestre par nom, année..."
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

                        {/* Légende des statuts */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="font-medium text-green-700">En cours</span>
                            </div>
                            <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <span className="font-medium text-blue-700">À venir</span>
                            </div>
                            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                                <span className="font-medium text-gray-700">Terminé</span>
                            </div>
                        </div>
                    </div>

                    {/* Indicateur de recherche active */}
                    {search && (
                        <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span className="text-sm font-medium text-blue-800">
                                    Recherche : "<span className="font-semibold">{search}</span>"
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    handleSearch('');
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Effacer
                            </button>
                        </div>
                    )}
                </div>

                {/* Liste des Trimestres */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trimestres.data.map((trimestre) => (
                        <div key={trimestre.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            {/* En-tête avec statut */}
                            <div className={`p-6 text-white ${isAnneeScolaireActive(trimestre) ? 'bg-gradient-to-r from-blue-600 to-indigo-700' : 'bg-gradient-to-r from-gray-600 to-gray-700'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold">{trimestre.nom}</h3>
                                        <p className="text-blue-100 mt-1">
                                            {getAnneeScolaireNom(trimestre)}
                                            {isAnneeScolaireActive(trimestre) && (
                                                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                    Active
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trimestre)}`}>
                                        {getStatusText(trimestre)}
                                    </span>
                                </div>
                            </div>

                            {/* Contenu */}
                            <div className="p-6">
                                {/* Numéro et Barème */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-sm text-gray-600">
                                        Trimestre #{trimestre.numero}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Barème: {trimestre.bareme}/20
                                    </div>
                                </div>

                                {/* Période */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                        <span>Période</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-gray-900">Début</div>
                                                <div className="text-lg font-bold text-blue-600">
                                                    {formatDate(trimestre.date_debut)}
                                                </div>
                                            </div>
                                            <div className="text-gray-400 mx-2">→</div>
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-gray-900">Fin</div>
                                                <div className="text-lg font-bold text-blue-600">
                                                    {formatDate(trimestre.date_fin)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Durée */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Durée</span>
                                        <span className="font-medium">
                                            {Math.ceil((new Date(trimestre.date_fin) - new Date(trimestre.date_debut)) / (1000 * 60 * 60 * 24))} jours
                                        </span>
                                    </div>
                                </div>

                                {/* Statistiques (placeholder pour compositions) */}
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-sm text-blue-800 text-center">
                                        {trimestre.compositions_count || 0} composition(s) associée(s)
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <div className="text-xs text-gray-500">
                                        Créé le {formatDate(trimestre.created_at)}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(trimestre)}
                                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200"
                                            title="Modifier"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(trimestre)}
                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200"
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
                    ))}
                </div>

                {/* Message vide */}
                {trimestres.data.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-200">
                        <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun trimestre trouvé</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {search ? 'Aucun trimestre ne correspond à votre recherche.' : 'Commencez par créer votre premier trimestre.'}
                        </p>
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Créer le premier trimestre
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {trimestres.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{trimestres.from}</span> à <span className="font-semibold">{trimestres.to}</span> sur <span className="font-semibold">{trimestres.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {trimestres.links.map((link, index) => (
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


            {/* Modal de création */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                            <h3 className="text-xl font-bold">Nouveau Trimestre</h3>
                            <p className="text-blue-100 mt-1">Ajouter une nouvelle période d'évaluation</p>
                        </div>

                        <form onSubmit={handleSubmitCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Année scolaire *
                                </label>
                                <Select
                                    options={anneeScolaireOptions}
                                    value={selectedAnneeScolaire}
                                    onChange={(selectedOption) => setFormData({ ...formData, annee_scolaire_id: selectedOption?.value || '' })}
                                    styles={customStyles}
                                    placeholder="Sélectionnez une année scolaire"
                                    isClearable
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Numéro du trimestre *
                                </label>
                                <Select
                                    options={numeroOptions}
                                    value={selectedNumero}
                                    onChange={(selectedOption) => setFormData({ ...formData, numero: selectedOption?.value || '' })}
                                    styles={customStyles}
                                    placeholder="Sélectionnez le numéro"
                                    isClearable
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nom du trimestre *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                    placeholder="Ex: Trimestre 1"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date de début *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date_debut}
                                        onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date de fin *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date_fin}
                                        onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Barème
                                </label>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="1"
                                    max="100"
                                    value={formData.bareme}
                                    onChange={(e) => setFormData({ ...formData, bareme: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                />
                                <p className="text-xs text-gray-500 mt-1">Note maximale par défaut pour les évaluations</p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200"
                                >
                                    Créer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal d'édition */}
            {showEditModal && selectedTrimestre && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white rounded-t-2xl">
                            <h3 className="text-xl font-bold">Modifier le Trimestre</h3>
                            <p className="text-green-100 mt-1">Mettre à jour les informations du trimestre</p>
                        </div>

                        <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Numéro du trimestre *
                                </label>
                                <Select
                                    options={numeroOptions.filter(opt => opt.value !== '')}
                                    value={selectedNumero}
                                    onChange={(selectedOption) => setFormData({ ...formData, numero: selectedOption?.value || '' })}
                                    styles={customStyles}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nom du trimestre *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                    placeholder="Ex: Trimestre 1"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date de début *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date_debut}
                                        onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date de fin *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date_fin}
                                        onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Barème
                                </label>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="1"
                                    max="100"
                                    value={formData.bareme}
                                    onChange={(e) => setFormData({ ...formData, bareme: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-200"
                                >
                                    Mettre à jour
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