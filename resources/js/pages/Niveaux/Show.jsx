import React, { useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Show = ({ niveau, serviceCiblages, services }) => {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('informations');
    const [showServiceModal, setShowServiceModal] = useState(false);

    const { data: serviceData, setData: setServiceData, post: postService, processing: serviceProcessing, reset: resetService } = useForm({
        service_id: ''
    });

    const handleDelete = () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le niveau "${niveau.nom}" ?`)) {
            router.delete(`/niveaux/${niveau.id}`);
        }
    };

    const getMoyenneColor = (moyenne) => {
        if (moyenne >= 12) return 'text-green-600 bg-green-50 border-green-200';
        if (moyenne >= 10) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (moyenne >= 8) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getNiveauColor = (index) => {
        const colors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-purple-500 to-purple-600',
            'from-orange-500 to-orange-600'
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
        postService(`/niveaux/${niveau.id}/associer-service`, {
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

    // Calcul des statistiques
    const totalEleves = niveau.classes?.reduce((total, classe) => total + (classe.inscriptions?.length || 0), 0) || 0;
    const totalClasses = niveau.classes?.length || 0;
    const totalMatieres = niveau.matieres?.length || 0;

    return (
        <AppLayout>
            <Head title={`Niveau ${niveau.nom}`} />

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
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center">
                            <Link href="/niveaux" className="mr-4">
                                <button className="inline-flex items-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {niveau.nom}
                                </h1>
                                <p className="text-purple-100 mt-2 text-lg">
                                    {niveau.cycle?.nom || 'Cycle non défini'} - Détails du niveau pédagogique
                                </p>
                                <div className="flex flex-wrap gap-4 mt-3 text-purple-200 text-sm">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        {totalClasses} classe{totalClasses > 1 ? 's' : ''}
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        {totalEleves} élève{totalEleves > 1 ? 's' : ''}
                                    </div>
                                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${getMoyenneColor(niveau.moyenne_min_pour_passage)}`}>
                                        Moyenne min: {niveau.moyenne_min_pour_passage}/20
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
                                href={`/niveaux/${niveau.id}/edit`}
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
                                        ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Informations
                            </button>
                            <button
                                onClick={() => setActiveTab('classes')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${
                                    activeTab === 'classes'
                                        ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Classes ({totalClasses})
                            </button>
                            <button
                                onClick={() => setActiveTab('matieres')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${
                                    activeTab === 'matieres'
                                        ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Matières ({totalMatieres})
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${
                                    activeTab === 'services'
                                        ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
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
                                    {/* Informations Générales */}
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            Informations Générales
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="font-medium text-blue-700">Nom :</span>
                                                    <p className="text-blue-900 font-semibold">{niveau.nom}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Cycle :</span>
                                                    <p className="text-blue-900">{niveau.cycle?.nom || 'Non défini'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Moyenne minimale :</span>
                                                    <p className={`text-blue-900 font-bold ${getMoyenneColor(niveau.moyenne_min_pour_passage).split(' ')[0]}`}>
                                                        {niveau.moyenne_min_pour_passage}/20
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">ID :</span>
                                                    <p className="text-blue-900 font-mono text-sm">{niveau.uid}</p>
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
                                                    <div className="text-2xl font-bold text-blue-600">{totalClasses}</div>
                                                    <div className="text-sm text-green-700">Classes</div>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-xl border border-green-100">
                                                    <div className="text-2xl font-bold text-purple-600">{totalMatieres}</div>
                                                    <div className="text-sm text-green-700">Matières</div>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-xl border border-green-100">
                                                    <div className="text-2xl font-bold text-orange-600">{totalEleves}</div>
                                                    <div className="text-sm text-green-700">Élèves</div>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-xl border border-green-100">
                                                    <div className="text-2xl font-bold text-red-600">{niveau.moyenne_min_pour_passage}</div>
                                                    <div className="text-sm text-green-700">Moyenne min</div>
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

                        {/* Onglet Classes */}
                        {activeTab === 'classes' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Classes du Niveau ({totalClasses})</h3>
                                    <Link
                                        href="/classes/create"
                                        className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Créer une classe
                                    </Link>
                                </div>

                                {niveau.classes && niveau.classes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {niveau.classes.map((classe, index) => (
                                            <div key={classe.id} className={`bg-gradient-to-r ${getNiveauColor(index)} rounded-xl p-4 text-white`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-lg font-bold">{classe.nom}</h4>
                                                        {classe.professeur && (
                                                            <p className="text-blue-100 opacity-90">
                                                                Prof: {classe.professeur.prenom} {classe.professeur.nom}
                                                            </p>
                                                        )}
                                                        <p className="text-sm opacity-80 mt-1">
                                                            Capacité: {classe.capacite} élèves
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold">{classe.inscriptions?.length || 0}</div>
                                                        <div className="text-xs opacity-80">Élèves</div>
                                                    </div>
                                                </div>
                                                {classe.inscriptions && classe.inscriptions.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-blue-400 border-opacity-30">
                                                        <div className="text-sm font-medium mb-2">Élèves :</div>
                                                        <div className="space-y-1">
                                                            {classe.inscriptions.slice(0, 3).map((inscription) => (
                                                                <div key={inscription.id} className="flex justify-between text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                                                                    <span>{inscription.eleve.prenom} {inscription.eleve.nom}</span>
                                                                </div>
                                                            ))}
                                                            {classe.inscriptions.length > 3 && (
                                                                <div className="text-xs text-center opacity-80">
                                                                    + {classe.inscriptions.length - 3} autre(s) élève(s)
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="mt-3 flex justify-end">
                                                    <Link
                                                        href={`/classes/${classe.id}`}
                                                        className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg transition-colors"
                                                    >
                                                        Voir détails
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <p className="text-gray-500">Aucune classe associée à ce niveau</p>
                                        <Link
                                            href="/classes/create"
                                            className="inline-flex items-center gap-2 mt-4 px-6 py-3 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Créer une classe
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Matières */}
                        {activeTab === 'matieres' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Matières du Niveau ({totalMatieres})</h3>

                                {niveau.matieres && niveau.matieres.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {niveau.matieres.map((matiere) => (
                                            <div key={matiere.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all duration-200">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-semibold text-gray-900">{matiere.nom}</h4>
                                                    <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                                        Coef. {matiere.coefficient}
                                                    </span>
                                                </div>
                                                {matiere.professeur && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        Professeur: {matiere.professeur.prenom} {matiere.professeur.nom}
                                                    </p>
                                                )}
                                                <div className="mt-3 flex justify-end">
                                                    <Link
                                                        href={`/matieres/${matiere.id}`}
                                                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                                    >
                                                        Voir détails →
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <p className="text-gray-500">Aucune matière associée à ce niveau</p>
                                        <Link
                                            href="/matieres/create"
                                            className="inline-flex items-center gap-2 mt-4 px-6 py-3 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Créer une matière
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Services */}
                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Services Associés ({serviceCiblages?.length || 0})</h3>
                                    <button
                                        onClick={() => setShowServiceModal(true)}
                                        className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Associer un Service
                                    </button>
                                </div>

                                {serviceCiblages && serviceCiblages.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {serviceCiblages.map((ciblage) => (
                                            <div key={ciblage.id} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-semibold text-purple-900">
                                                        {ciblage.service.nom}
                                                    </h4>
                                                    <button
                                                        onClick={() => handleDissocierService(ciblage.id)}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Dissocier le service"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <span className="font-medium text-purple-700">Code :</span>
                                                        <span className="ml-2 text-purple-900">{ciblage.service.code}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-purple-700">Montant :</span>
                                                        <span className="ml-2 text-purple-900 font-bold">
                                                            {formatMontant(ciblage.service.montant)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-purple-700">Type :</span>
                                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${ciblage.service.obligatoire
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {ciblage.service.obligatoire ? 'Obligatoire' : 'Optionnel'}
                                                        </span>
                                                    </div>
                                                    {ciblage.service.description && (
                                                        <div>
                                                            <span className="font-medium text-purple-700">Description :</span>
                                                            <p className="mt-1 text-purple-900 text-xs">
                                                                {ciblage.service.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun service associé</h4>
                                        <p className="text-gray-600 mb-4">Ce niveau n'a aucun service associé pour le moment.</p>
                                        <button
                                            onClick={() => setShowServiceModal(true)}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Associer un Service
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
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Associer un Service</h2>
                                <button
                                    onClick={() => setShowServiceModal(false)}
                                    className="text-white hover:text-purple-200 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleAssocierService} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Service *
                                </label>
                                <select
                                    value={serviceData.service_id}
                                    onChange={(e) => setServiceData('service_id', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                                    required
                                >
                                    <option value="">Sélectionnez un service</option>
                                    {services && services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.nom} - {service.code} ({formatMontant(service.montant)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowServiceModal(false)}
                                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={serviceProcessing || !serviceData.service_id}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"
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
};

export default Show;