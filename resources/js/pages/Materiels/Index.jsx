import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ materiels, filters }) => {
    const [search, setSearch] = useState(filters.search || '');

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        router.get('/materiels', { search: value }, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handleDelete = (materiel) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le matériel "${materiel.nom}" ?`)) {
            router.delete(`/materiels/${materiel.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Gestion des Matériels" />

            <div className="max-w-7xl mx-auto">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-orange-600 to-amber-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Gestion des Matériels
                            </h1>
                            <p className="text-orange-100 mt-2 text-lg">
                                Gérez l'inventaire des matériels et équipements
                            </p>
                        </div>
                        <Link
                            href="/materiels/create"
                            className="mt-4 lg:mt-0 inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Nouveau Matériel
                        </Link>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher un matériel par nom ou référence..."
                                    defaultValue={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-xl">
                                {materiels.total} matériel{materiels.total > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Liste des Matériels */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* En-tête du tableau (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        <div className="col-span-4">Matériel</div>
                        <div className="col-span-3">Référence</div>
                        <div className="col-span-3">Description</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {materiels.data.map((materiel) => (
                            <div key={materiel.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                <div className="px-6 py-6">
                                    {/* Version Mobile */}
                                    <div className="lg:hidden space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {materiel.nom}
                                                    </h3>
                                                    {materiel.reference && (
                                                        <p className="text-sm text-gray-600">Ref: {materiel.reference}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {materiel.description && (
                                                <div className="text-sm text-gray-600 line-clamp-2">
                                                    {materiel.description}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-500">
                                                    ID: {materiel.uid}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={`/materiels/${materiel.id}/edit`}
                                                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(materiel)}
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
                                        <div className="col-span-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {materiel.nom}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {materiel.uid}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <div className="text-lg font-medium text-gray-900">
                                                {materiel.reference || (
                                                    <span className="text-gray-400 italic">Non renseignée</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <div className="text-sm text-gray-900 line-clamp-2">
                                                {materiel.description || (
                                                    <span className="text-gray-400 italic">Aucune description</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/materiels/${materiel.id}/edit`}
                                                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(materiel)}
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
                    {materiels.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun matériel trouvé</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search 
                                    ? 'Aucun matériel ne correspond à vos critères de recherche.' 
                                    : 'Commencez par ajouter vos premiers matériels à l\'inventaire.'}
                            </p>
                            <Link
                                href="/materiels/create"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-700 text-white rounded-xl hover:from-orange-700 hover:to-amber-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Ajouter un Matériel
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {materiels.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{materiels.from}</span> à <span className="font-semibold">{materiels.to}</span> sur <span className="font-semibold">{materiels.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {materiels.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        link.active
                                            ? 'bg-gradient-to-r from-orange-600 to-amber-700 text-white shadow-lg'
                                            : link.url
                                            ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-500 hover:text-orange-600'
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