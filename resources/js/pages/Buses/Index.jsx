    import React, { useState } from 'react';
    import { Head, Link, router, usePage } from '@inertiajs/react';
    import AppLayout from '@/Layouts/AppLayout';

    const Index = ({ buses, filters }) => {
        const { flash } = usePage().props;
        const [search, setSearch] = useState(filters.q || '');
        const [perPage, setPerPage] = useState(15);

        const debounce = (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };

        const handleSearch = debounce((value) => {
            router.get('/buses', { 
                q: value,
                perPage 
            }, {
                preserveState: true,
                replace: true
            });
        }, 300);

        const handlePerPageChange = (value) => {
            setPerPage(value);
            router.get('/buses', { 
                q: search,
                perPage: value 
            }, {
                preserveState: true,
                replace: true
            });
        };

        const getEtatColor = (etat) => {
            const colors = {
                'actif': 'text-green-600 bg-green-50 border-green-200',
                'maintenance': 'text-orange-600 bg-orange-50 border-orange-200',
                'hors_service': 'text-red-600 bg-red-50 border-red-200'
            };
            return colors[etat] || 'text-gray-600 bg-gray-50 border-gray-200';
        };

        const getEtatLabel = (etat) => {
            const labels = {
                'actif': 'Actif',
                'maintenance': 'En Maintenance',
                'hors_service': 'Hors Service'
            };
            return labels[etat] || etat;
        };

        const getEtatIcon = (etat) => {
            const icons = {
                'actif': (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                'maintenance': (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                ),
                'hors_service': (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )
            };
            return icons[etat] || null;
        };

        const handleDelete = (bus) => {
            if (confirm(`Êtes-vous sûr de vouloir supprimer le bus "${bus.immatriculation}" ?`)) {
                router.delete(`/buses/${bus.id}`);
            }
        };

        return (
            <AppLayout>
                <Head title="Gestion des Bus" />

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
                    <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-8 text-white mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Gestion des Bus
                                </h1>
                                <p className="text-amber-100 mt-2 text-lg">
                                    Gérez le parc automobile de transport scolaire
                                </p>
                            </div>
                            <Link
                                href="/buses/create"
                                className="mt-4 lg:mt-0 inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouveau Bus
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
                                        placeholder="Rechercher un bus par immatriculation ou chauffeur..."
                                        defaultValue={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
                                        className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <select
                                    value={perPage}
                                    onChange={(e) => handlePerPageChange(e.target.value)}
                                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
                                >
                                    <option value="10">10/page</option>
                                    <option value="15">15/page</option>
                                    <option value="20">20/page</option>
                                    <option value="50">50/page</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques rapides */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Bus Actifs</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {buses.data.filter(bus => bus.etat === 'actif').length}
                                    </p>
                                </div>
                                <div className="bg-green-100 rounded-full p-3">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-600">En Maintenance</p>
                                    <p className="text-2xl font-bold text-orange-900">
                                        {buses.data.filter(bus => bus.etat === 'maintenance').length}
                                    </p>
                                </div>
                                <div className="bg-orange-100 rounded-full p-3">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-600">Hors Service</p>
                                    <p className="text-2xl font-bold text-red-900">
                                        {buses.data.filter(bus => bus.etat === 'hors_service').length}
                                    </p>
                                </div>
                                <div className="bg-red-100 rounded-full p-3">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Total Bus</p>
                                    <p className="text-2xl font-bold text-blue-900">{buses.total}</p>
                                </div>
                                <div className="bg-blue-100 rounded-full p-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des Bus */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        {/* En-tête du tableau (Desktop) */}
                        <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-amber-50 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                            <div className="col-span-2">Immatriculation</div>
                            <div className="col-span-2">Véhicule</div>
                            <div className="col-span-2">Chauffeur</div>
                            <div className="col-span-2">Capacité</div>
                            <div className="col-span-2">État</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {buses.data.map((bus) => (
                                <div key={bus.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                    <div className="px-6 py-6">
                                        {/* Version Mobile */}
                                        <div className="lg:hidden space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {bus.immatriculation}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {bus.marque} {bus.modele}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border-2 ${getEtatColor(bus.etat)}`}>
                                                    {getEtatIcon(bus.etat)}
                                                    {getEtatLabel(bus.etat)}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {bus.chauffeur_nom}
                                                    {bus.chauffeur_telephone && (
                                                        <span className="ml-2 text-gray-500">• {bus.chauffeur_telephone}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    Capacité: {bus.capacite} places
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-gray-600">
                                                        Créé le {new Date(bus.created_at).toLocaleDateString('fr-FR')}
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={`/buses/${bus.id}/edit`}
                                                            className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(bus)}
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
                                            <div className="col-span-2">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-lg font-semibold text-gray-900 font-mono">
                                                            {bus.immatriculation}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-lg font-medium text-gray-900">
                                                    {bus.marque || '—'} {bus.modele || ''}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {bus.marque && bus.modele ? `${bus.marque} ${bus.modele}` : 'Modèle non spécifié'}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-lg font-medium text-gray-900">
                                                    {bus.chauffeur_nom}
                                                </div>
                                                {bus.chauffeur_telephone && (
                                                    <div className="text-sm text-gray-600">
                                                        {bus.chauffeur_telephone}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex items-center">
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {bus.capacite}
                                                    </div>
                                                    <div className="ml-2 text-sm text-gray-600">
                                                        places
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${getEtatColor(bus.etat)}`}>
                                                    {getEtatIcon(bus.etat)}
                                                    {getEtatLabel(bus.etat)}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={`/buses/${bus.id}/edit`}
                                                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200"
                                                        title="Modifier"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(bus)}
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
                        {buses.data.length === 0 && (
                            <div className="text-center py-16">
                                <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun bus trouvé</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    {search 
                                        ? 'Aucun bus ne correspond à vos critères de recherche.' 
                                        : 'Commencez par ajouter vos premiers bus au parc automobile.'}
                                </p>
                                <Link
                                    href="/buses/create"
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-xl hover:from-amber-700 hover:to-orange-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Ajouter un Bus
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {buses.data.length > 0 && (
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="text-sm text-gray-700">
                                Affichage de <span className="font-semibold">{buses.from}</span> à <span className="font-semibold">{buses.to}</span> sur <span className="font-semibold">{buses.total}</span> résultats
                            </div>
                            <div className="flex space-x-1">
                                {buses.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => router.get(link.url || '#')}
                                        disabled={!link.url}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            link.active
                                                ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-lg'
                                                : link.url
                                                ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-500 hover:text-amber-600'
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