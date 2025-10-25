import React, { useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ cycle, statistiques, serviceCiblages, services }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('informations');
    const [showServiceModal, setShowServiceModal] = useState(false);

    const { data: serviceData, setData: setServiceData, post: postService, processing: serviceProcessing, reset: resetService } = useForm({
        service_id: ''
    });

    const handleDelete = () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le cycle "${cycle.nom}" ?`)) {
            router.delete(`/cycles/${cycle.id}`);
        }
    };

    const getSystemeColor = (systeme) => {
        const colors = {
            standard: 'from-blue-500 to-blue-600',
            bilingue: 'from-green-500 to-green-600',
            trilingue: 'from-purple-500 to-purple-600'
        };
        return colors[systeme] || 'from-gray-500 to-gray-600';
    };

    const getNiveauColor = (index) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-orange-500 to-orange-600',
            'from-pink-500 to-pink-600',
            'from-indigo-500 to-indigo-600'
        ];
        return colors[index % colors.length];
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(montant || 0);
    };

    const handleAssocierService = (e) => {
        e.preventDefault();
        postService(`/cycles/${cycle.id}/associer-service`, {
            onSuccess: () => {
                resetService();
                setShowServiceModal(false);
            }
        });
    };

    const handleDissocierService = (serviceCiblageId) => {
        if (confirm('Êtes-vous sûr de vouloir dissocier ce service ?')) {
            router.delete(`/service-ciblages/${serviceCiblageId}`);
        }
    };

    return (
        <AppLayout>
            <Head title={`Cycle ${cycle.nom}`} />

            <div className="max-w-7xl mx-auto">
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

                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center">
                            <Link href="/cycles" className="mr-4">
                                <button className="inline-flex items-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {cycle.nom}
                                </h1>
                                <p className="text-cyan-100 mt-2 text-lg">
                                    Détails du cycle pédagogique
                                </p>
                                <div className="flex flex-wrap gap-4 mt-3 text-cyan-200 text-sm">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        {statistiques.total_niveaux} niveau{statistiques.total_niveaux > 1 ? 'x' : ''}
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        {statistiques.total_classes} classe{statistiques.total_classes > 1 ? 's' : ''}
                                    </div>
                                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 bg-gradient-to-r ${getSystemeColor(cycle.systeme)} text-white border-transparent`}>
                                        {cycle.systeme === 'standard' ? 'Standard' : cycle.systeme === 'bilingue' ? 'Bilingue' : 'Trilingue'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setShowServiceModal(true)}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Associer un Service
                            </button>
                            <Link
                                href={`/cycles/${cycle.id}/edit`}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl text-white hover:bg-red-500/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation par onglets */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('informations')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${
                                    activeTab === 'informations'
                                        ? 'border-b-2 border-cyan-500 text-cyan-600 bg-cyan-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Informations
                            </button>
                            <button
                                onClick={() => setActiveTab('niveaux')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${
                                    activeTab === 'niveaux'
                                        ? 'border-b-2 border-cyan-500 text-cyan-600 bg-cyan-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Niveaux ({statistiques.total_niveaux})
                            </button>
                            <button
                                onClick={() => setActiveTab('langues')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${
                                    activeTab === 'langues'
                                        ? 'border-b-2 border-cyan-500 text-cyan-600 bg-cyan-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                Langues ({cycle.langues?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${
                                    activeTab === 'services'
                                        ? 'border-b-2 border-cyan-500 text-cyan-600 bg-cyan-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Services ({serviceCiblages?.length || 0})
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Onglet Informations */}
                        {activeTab === 'informations' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Configuration du cycle */}
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Configuration du cycle
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="font-medium text-blue-700">Nom :</span>
                                                    <p className="text-blue-900 font-semibold">{cycle.nom}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Système :</span>
                                                    <p className="text-blue-900">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getSystemeColor(cycle.systeme)} text-white`}>
                                                            {cycle.systeme === 'standard' ? 'Standard' : cycle.systeme === 'bilingue' ? 'Bilingue' : 'Trilingue'}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Trimestres :</span>
                                                    <p className="text-blue-900 font-semibold">{cycle.nombre_trimestres}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Barème :</span>
                                                    <p className="text-blue-900 font-semibold">{cycle.bareme}/20</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Statistiques */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                        <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Statistiques
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-3 bg-white rounded-xl border border-green-100">
                                                    <div className="text-2xl font-bold text-blue-600">{statistiques.total_niveaux}</div>
                                                    <div className="text-sm text-green-700">Niveaux</div>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-xl border border-green-100">
                                                    <div className="text-2xl font-bold text-purple-600">{statistiques.total_classes}</div>
                                                    <div className="text-sm text-green-700">Classes</div>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-xl border border-green-100">
                                                    <div className="text-2xl font-bold text-orange-600">{statistiques.total_eleves}</div>
                                                    <div className="text-sm text-green-700">Élèves</div>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-xl border border-green-100">
                                                    <div className="text-2xl font-bold text-cyan-600">{cycle.langues?.length || 0}</div>
                                                    <div className="text-sm text-green-700">Langues</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Services appliqués - Aperçu */}
                                {serviceCiblages && serviceCiblages.length > 0 && (
                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                                        <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                                            <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Services appliqués ({serviceCiblages.length})
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {serviceCiblages.slice(0, 5).map((ciblage) => (
                                                <span key={ciblage.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-orange-700 border border-orange-200">
                                                    {ciblage.service.nom} ({formatMontant(ciblage.service.montant)})
                                                </span>
                                            ))}
                                            {serviceCiblages.length > 5 && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                                                    +{serviceCiblages.length - 5} autres
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Niveaux */}
                        {activeTab === 'niveaux' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Niveaux du Cycle ({statistiques.total_niveaux})</h3>
                                    <Link
                                        href="/niveaux/create"
                                        className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-600 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Ajouter un niveau
                                    </Link>
                                </div>

                                {cycle.niveaux && cycle.niveaux.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {cycle.niveaux.map((niveau, index) => (
                                            <div key={niveau.id} className={`bg-gradient-to-r ${getNiveauColor(index)} rounded-xl p-4 text-white`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-lg font-bold">{niveau.nom}</h4>
                                                        <p className="text-blue-100 opacity-90 mt-1">
                                                            Moyenne minimale: {niveau.moyenne_min_pour_passage}/20
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold">{niveau.classes?.length || 0}</div>
                                                        <div className="text-xs opacity-80">Classes</div>
                                                    </div>
                                                </div>
                                                {niveau.classes && niveau.classes.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-white border-opacity-30">
                                                        <div className="text-sm font-medium mb-2">Classes :</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {niveau.classes.map((classe) => (
                                                                <span key={classe.id} className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                                                                    {classe.nom} ({classe.eleves_actuels_count || 0} élève(s))
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="mt-4 flex justify-end">
                                                    <Link
                                                        href={`/niveaux/${niveau.id}`}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm transition-colors"
                                                    >
                                                        Voir détails
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun niveau</h3>
                                        <p className="text-gray-500 mb-4">Ce cycle ne contient aucun niveau pour le moment.</p>
                                        <Link
                                            href="/niveaux/create"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Créer le premier niveau
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Langues */}
                        {activeTab === 'langues' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Langues enseignées ({cycle.langues?.length || 0})</h3>
                                
                                {cycle.langues && cycle.langues.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {cycle.langues.map((langue, index) => (
                                            <div key={langue.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getNiveauColor(index)} flex items-center justify-center text-white font-bold`}>
                                                            {langue.code?.toUpperCase() || langue.nom?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-3">
                                                            <h4 className="font-semibold text-gray-900">{langue.nom}</h4>
                                                            <p className="text-sm text-gray-500">{langue.code}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        langue.est_principale 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {langue.est_principale ? 'Principale' : 'Secondaire'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune langue</h3>
                                        <p className="text-gray-500">Aucune langue n'est associée à ce cycle.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Services */}
                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Services associés ({serviceCiblages?.length || 0})</h3>
                                    <button
                                        onClick={() => setShowServiceModal(true)}
                                        className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Associer un service
                                    </button>
                                </div>

                                {serviceCiblages && serviceCiblages.length > 0 ? (
                                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Service
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Montant
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Type
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Périodicité
                                                        </th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {serviceCiblages.map((ciblage) => (
                                                        <tr key={ciblage.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {ciblage.service.nom}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            {ciblage.service.description}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {formatMontant(ciblage.service.montant)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    ciblage.service.type === 'obligatoire' 
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                    {ciblage.service.type === 'obligatoire' ? 'Obligatoire' : 'Optionnel'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {ciblage.service.periodicite === 'annuel' ? 'Annuel' : 
                                                                 ciblage.service.periodicite === 'trimestriel' ? 'Trimestriel' : 'Mensuel'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <button
                                                                    onClick={() => handleDissocierService(ciblage.id)}
                                                                    className="text-red-600 hover:text-red-900 ml-4"
                                                                >
                                                                    Dissocier
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service associé</h3>
                                        <p className="text-gray-500 mb-4">Aucun service n'est actuellement associé à ce cycle.</p>
                                        <button
                                            onClick={() => setShowServiceModal(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Associer un service
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal d'association de service */}
            {showServiceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Associer un service</h3>
                            <button
                                onClick={() => setShowServiceModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleAssocierService}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service à associer
                                </label>
                                <select
                                    value={serviceData.service_id}
                                    onChange={(e) => setServiceData('service_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Sélectionnez un service</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.nom} ({formatMontant(service.montant)}) - {service.type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowServiceModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={serviceProcessing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {serviceProcessing ? 'Association...' : 'Associer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}