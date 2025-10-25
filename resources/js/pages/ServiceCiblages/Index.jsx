import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ service, ciblages, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.perPage || 20);
    const [serviceFilter, setServiceFilter] = useState(filters.service_id || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleFilter = debounce(() => {
        router.get('/service-ciblages', { 
            service_id: serviceFilter,
            type: typeFilter,
            perPage 
        }, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handlePerPageChange = (value) => {
        setPerPage(value);
        router.get('/service-ciblages', { 
            service_id: serviceFilter,
            type: typeFilter,
            perPage: value 
        }, {
            preserveState: true,
            replace: true
        });
    };

    const getTypeLabel = (type) => {
        const labels = {
            'App\\Models\\Cycle': 'Cycle',
            'App\\Models\\Niveau': 'Niveau',
            'App\\Models\\Classe': 'Classe',
            'App\\Models\\Inscription': 'Élève'
        };
        return labels[type] || type;
    };

    const getCiblableName = (ciblage) => {
        if (!ciblage.ciblable) return 'N/A';
        
        switch (ciblage.ciblable_type) {
            case 'App\\Models\\Cycle':
                return ciblage.ciblable.nom;
            case 'App\\Models\\Niveau':
                return `${ciblage.ciblable.nom} (${ciblage.ciblable.cycle?.nom || 'N/A'})`;
            case 'App\\Models\\Classe':
                return `${ciblage.ciblable.nom} - ${ciblage.ciblable.niveau?.nom || 'N/A'}`;
            case 'App\\Models\\Inscription':
                return `${ciblage.ciblable.eleve?.prenom || ''} ${ciblage.ciblable.eleve?.nom || ''} - ${ciblage.ciblable.classe?.nom || 'N/A'}`;
            default:
                return 'N/A';
        }
    };

    const handleDelete = (ciblage) => {
        const targetName = getCiblableName(ciblage);
        if (confirm(`Êtes-vous sûr de vouloir supprimer le ciblage pour "${targetName}" ?`)) {
            router.delete(`/service-ciblages/${ciblage.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Gestion des Ciblages de Services" />

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
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                {service ? `Ciblages - ${service.nom}` : 'Gestion des Ciblages de Services'}
                            </h1>
                            <p className="text-purple-100 mt-2 text-lg">
                                Gérez les cibles associées aux services
                            </p>
                            {service && (
                                <div className="flex flex-wrap gap-4 mt-4 text-purple-200 text-sm">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        Code: {service.code}
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        Montant: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(service.montant)}
                                    </div>
                                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${
                                        service.obligatoire 
                                            ? 'text-green-600 bg-green-50 border-green-200' 
                                            : 'text-blue-600 bg-blue-50 border-blue-200'
                                    }`}>
                                        {service.obligatoire ? 'Obligatoire' : 'Optionnel'}
                                    </div>
                                </div>
                            )}
                        </div>
                        <Link
                            href={service ? `/service-ciblages/create?service_id=${service.id}` : '/service-ciblages/create'}
                            className="mt-4 lg:mt-0 inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Nouveau Ciblage
                        </Link>
                    </div>
                </div>

                {/* Filtres */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Type de cible
                            </label>
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value);
                                    handleFilter();
                                }}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                            >
                                <option value="">Tous les types</option>
                                <option value="App\\Models\\Cycle">Cycles</option>
                                <option value="App\\Models\\Niveau">Niveaux</option>
                                <option value="App\\Models\\Classe">Classes</option>
                                <option value="App\\Models\\Inscription">Élèves</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Éléments par page
                            </label>
                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(e.target.value)}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                            >
                                <option value="10">10/page</option>
                                <option value="20">20/page</option>
                                <option value="50">50/page</option>
                                <option value="100">100/page</option>
                            </select>
                        </div>

                        {!service && (
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Service
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={serviceFilter}
                                        onChange={(e) => {
                                            setServiceFilter(e.target.value);
                                            handleFilter();
                                        }}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                                    >
                                        <option value="">Tous les services</option>
                                        {/* Les options seraient chargées via props */}
                                    </select>
                                    {serviceFilter && (
                                        <button
                                            onClick={() => {
                                                setServiceFilter('');
                                                handleFilter();
                                            }}
                                            className="px-4 py-3 text-gray-600 hover:text-gray-800 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Liste des Ciblages */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* En-tête du tableau (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-purple-50 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        <div className="col-span-3">Service</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-5">Cible</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {ciblages.data.map((ciblage) => (
                            <div key={ciblage.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                <div className="px-6 py-6">
                                    {/* Version Mobile */}
                                    <div className="lg:hidden space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-purple-600 font-bold text-lg">
                                                        {getTypeLabel(ciblage.ciblable_type)[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {ciblage.service?.nom}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{getTypeLabel(ciblage.ciblable_type)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Cible:</span> {getCiblableName(ciblage)}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-600">
                                                    Créé le: {new Date(ciblage.created_at).toLocaleDateString('fr-FR')}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleDelete(ciblage)}
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
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-purple-600 font-bold text-lg">
                                                        {ciblage.service?.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {ciblage.service?.nom}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {ciblage.service?.code}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                {getTypeLabel(ciblage.ciblable_type)}
                                            </div>
                                        </div>
                                        <div className="col-span-5">
                                            <div className="text-lg font-medium text-gray-900">
                                                {getCiblableName(ciblage)}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Ajouté le {new Date(ciblage.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleDelete(ciblage)}
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
                    {ciblages.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun ciblage trouvé</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {serviceFilter || typeFilter 
                                    ? 'Aucun ciblage ne correspond à vos critères de filtrage.' 
                                    : 'Commencez par créer vos premiers ciblages de services.'}
                            </p>
                            <Link
                                href={service ? `/service-ciblages/create?service_id=${service.id}` : '/service-ciblages/create'}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouveau Ciblage
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {ciblages.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{ciblages.from}</span> à <span className="font-semibold">{ciblages.to}</span> sur <span className="font-semibold">{ciblages.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {ciblages.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        link.active
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