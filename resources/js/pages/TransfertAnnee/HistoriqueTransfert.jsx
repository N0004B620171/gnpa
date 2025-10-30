import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const HistoriqueTransfert = ({ transferts, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [annulable, setAnnulable] = useState(filters.annulable || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        router.get('/historique-transferts', { 
            search: value,
            annulable,
            perPage 
        }, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handleFilterChange = (filter, value) => {
        const newFilters = {
            search,
            annulable,
            perPage,
            [filter]: value
        };

        if (filter === 'annulable') setAnnulable(value);
        if (filter === 'perPage') setPerPage(value);

        router.get('/historique-transferts', newFilters, {
            preserveState: true,
            replace: true
        });
    };

    const handleAnnulerTransfert = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler ce transfert ?')) {
            return;
        }

        try {
            await router.post(`/historique-transferts/annuler/${id}`);
        } catch (error) {
            console.error('Erreur lors de l\'annulation:', error);
        }
    };

    const getStatutColor = (annulable) => {
        return annulable 
            ? 'text-green-600 bg-green-50 border-green-200' 
            : 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <AppLayout>
            <Head title="Historique des Transferts" />

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Historique des Transferts
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Consultez l'historique des migrations d'année scolaire
                            </p>
                        </div>
                        <Link
                            href="/transfert"
                            className="mt-4 lg:mt-0 inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            Nouveau Transfert
                        </Link>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom d'année scolaire..."
                                    defaultValue={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <select
                                value={annulable}
                                onChange={(e) => handleFilterChange('annulable', e.target.value)}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="true">Annulable</option>
                                <option value="false">Non annulable</option>
                            </select>
                        </div>

                        <div>
                            <select
                                value={perPage}
                                onChange={(e) => handleFilterChange('perPage', e.target.value)}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="10">10/page</option>
                                <option value="20">20/page</option>
                                <option value="50">50/page</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des transferts */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* En-tête du tableau (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        <div className="col-span-3">Transfert</div>
                        <div className="col-span-2">Année de départ</div>
                        <div className="col-span-2">Année d'arrivée</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Statut</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {transferts.data.map((transfert) => (
                            <div key={transfert.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                <div className="px-6 py-6">
                                    {/* Version Mobile */}
                                    <div className="lg:hidden space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Transfert #{transfert.id}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {transfert.ancienne_annee?.nom} → {transfert.nouvelle_annee?.nom}
                                                </p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatutColor(transfert.annulable)}`}>
                                                {transfert.annulable ? 'Annulable' : 'Finalisé'}
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(transfert.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600">
                                                ID: {transfert.uid}
                                            </div>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/historique-transferts/${transfert.id}`}
                                                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                    title="Voir les détails"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                {transfert.annulable && (
                                                    <button
                                                        onClick={() => handleAnnulerTransfert(transfert.id)}
                                                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Annuler le transfert"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Version Desktop */}
                                    <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
                                        <div className="col-span-3">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        T
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        Transfert #{transfert.id}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        ID: {transfert.uid}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-lg font-medium text-gray-900">
                                                {transfert.ancienne_annee?.nom}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-lg font-medium text-gray-900">
                                                {transfert.nouvelle_annee?.nom}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">
                                                {new Date(transfert.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {new Date(transfert.created_at).toLocaleTimeString('fr-FR')}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatutColor(transfert.annulable)}`}>
                                                {transfert.annulable ? 'Annulable' : 'Finalisé'}
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/historique-transferts/${transfert.id}`}
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                                    title="Voir les détails"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                {transfert.annulable && (
                                                    <button
                                                        onClick={() => handleAnnulerTransfert(transfert.id)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                        title="Annuler le transfert"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message vide */}
                    {transferts.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun transfert trouvé</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search 
                                    ? 'Aucun transfert ne correspond à vos critères de recherche.' 
                                    : 'Aucun transfert n\'a été effectué pour le moment.'}
                            </p>
                            <Link
                                href="/transfert"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Effectuer un transfert
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {transferts.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{transferts.from}</span> à <span className="font-semibold">{transferts.to}</span> sur <span className="font-semibold">{transferts.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {transferts.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        link.active
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

export default HistoriqueTransfert;