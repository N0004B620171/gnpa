import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Show = () => {
    const { props } = usePage();
    const { annee, statistiques, progression, serviceCiblages, services, busStats, flash } = props;
    const [activeTab, setActiveTab] = useState('informations');
    const [showServiceModal, setShowServiceModal] = useState(false);

    const { data: serviceData, setData: setServiceData, post: postService, processing: serviceProcessing, reset: resetService } = useForm({
        service_id: ''
    });

    console.log('Données reçues dans Show:', { annee, statistiques, progression });

    // Protection contre les données manquantes
    if (!annee) {
        return (
            <AppLayout>
                <Head title="Année scolaire non trouvée" />
                <div className="max-w-7xl mx-auto py-12 text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Année scolaire non trouvée
                        </h1>
                        <p className="text-gray-600 mb-6">
                            L'année scolaire que vous recherchez n'existe pas ou a été supprimée.
                        </p>
                        <Link
                            href="/annees-scolaires"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                        >
                            Retour à la liste
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const handleDelete = () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'année scolaire "${annee.nom}" ? Cette action est irréversible.`)) {
            router.delete(`/annees-scolaires/${annee.id}`);
        }
    };

    const handleActiver = () => {
        if (confirm(`Voulez-vous activer l'année scolaire "${annee.nom}" ? L'année active actuelle sera désactivée.`)) {
            router.post(`/annees-scolaires/${annee.id}/activer`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        try {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return 'Date invalide';
        }
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(montant);
    };

    const getStatusColor = (actif) => {
        return actif 
            ? 'bg-green-100 text-green-800 border-green-200'
            : 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getProgressColor = (progress) => {
        if (progress >= 90) return 'bg-red-500';
        if (progress >= 75) return 'bg-orange-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getProgressText = (progress) => {
        if (progress === 0) return 'Non commencée';
        if (progress === 100) return 'Terminée';
        if (progress >= 90) return 'Bientôt terminée';
        if (progress >= 75) return 'Bien avancée';
        if (progress >= 50) return 'En milieu';
        if (progress >= 25) return 'Débutée';
        return 'Très débutée';
    };

    const handleAssocierService = (e) => {
        e.preventDefault();
        postService(`/annees-scolaires/${annee.id}/associer-service`, {
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

    const inscriptionsCount = statistiques?.total_inscriptions || 0;
    const inscriptionsActives = statistiques?.inscriptions_actives || 0;
    const classesCount = statistiques?.nombre_classes || 0;
    const niveauxCount = statistiques?.nombre_niveaux || 0;
    const trimestresCount = annee.trimestres?.length || 0;
    const totalFactures = statistiques?.total_factures || 0;
    const facturesPayees = statistiques?.factures_payees || 0;
    const totalElevesTransport = statistiques?.total_eleves_transport || 0;

    return (
        <AppLayout>
            <Head title={`Année Scolaire ${annee.nom}`} />

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
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center">
                            <Link href="/annees-scolaires" className="mr-4">
                                <button className="inline-flex items-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {annee.nom || 'Nom non disponible'}
                                </h1>
                                <p className="text-indigo-100 mt-2 text-lg">
                                    {formatDate(annee.date_debut)} - {formatDate(annee.date_fin)}
                                </p>
                                {annee.description && (
                                    <p className="text-indigo-200 mt-1 text-sm">
                                        {annee.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
                            <button
                                onClick={() => setShowServiceModal(true)}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Associer un Service
                            </button>
                            {!annee.actif && (
                                <button
                                    onClick={handleActiver}
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-xl text-white hover:bg-green-500/30 transition-all duration-200 transform hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Activer
                                </button>
                            )}
                            <Link
                                href={`/annees-scolaires/${annee.id}/edit`}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                            </Link>
                            {!annee.actif && (
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl text-white hover:bg-red-500/30 transition-all duration-200 transform hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Supprimer
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation par onglets */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('informations')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'informations'
                                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Informations
                            </button>
                            <button
                                onClick={() => setActiveTab('trimestres')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'trimestres'
                                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Trimestres ({trimestresCount})
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'services'
                                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Services ({serviceCiblages?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('transport')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'transport'
                                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Transport
                            </button>
                            <button
                                onClick={() => setActiveTab('statistiques')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'statistiques'
                                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Statistiques
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Onglet Informations */}
                        {activeTab === 'informations' && (
                            <div className="space-y-8">
                                {/* Carte Informations Générales */}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
                                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Informations Générales
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nom</dt>
                                                <dd className="mt-2 text-lg font-medium text-gray-900">{annee.nom}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Statut</dt>
                                                <dd className="mt-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(annee.actif)}`}>
                                                        <svg className={`w-4 h-4 mr-1 ${annee.actif ? 'text-green-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            {annee.actif ? (
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            ) : (
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            )}
                                                        </svg>
                                                        {annee.actif ? 'Active' : 'Inactive'}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Date de début</dt>
                                                <dd className="mt-2 text-lg font-medium text-gray-900">{formatDate(annee.date_debut)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Date de fin</dt>
                                                <dd className="mt-2 text-lg font-medium text-gray-900">{formatDate(annee.date_fin)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Inscriptions totales</dt>
                                                <dd className="mt-2 text-lg font-medium text-gray-900">{inscriptionsCount}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Inscriptions actives</dt>
                                                <dd className="mt-2 text-lg font-medium text-gray-900">{inscriptionsActives}</dd>
                                            </div>
                                            {annee.description && (
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</dt>
                                                    <dd className="mt-2 text-gray-700 bg-gray-50 rounded-lg p-4">
                                                        {annee.description}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                </div>

                                {/* Carte Progression */}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 border-b border-gray-200">
                                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Progression de l'année
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Début: {formatDate(annee.date_debut)}</span>
                                                <span>Fin: {formatDate(annee.date_fin)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-4">
                                                <div 
                                                    className={`h-4 rounded-full ${getProgressColor(progression)} transition-all duration-500`}
                                                    style={{ width: `${progression}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {getProgressText(progression)}
                                                </span>
                                                <span className={`text-lg font-bold ${
                                                    progression >= 90 ? 'text-red-600' :
                                                    progression >= 75 ? 'text-orange-600' :
                                                    progression >= 50 ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                    {progression}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Onglet Trimestres */}
                        {activeTab === 'trimestres' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Trimestres de l'Année Scolaire</h3>

                                {annee.trimestres && annee.trimestres.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {annee.trimestres.map((trimestre) => (
                                            <div key={trimestre.id} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-semibold text-purple-900">
                                                        {trimestre.nom}
                                                    </h4>
                                                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                                        Bareme: {trimestre.bareme}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <span className="font-medium text-purple-700">Cycle :</span>
                                                        <span className="ml-2 text-purple-900">
                                                            {trimestre.cycle?.nom || 'Non spécifié'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-purple-700">Période :</span>
                                                        <span className="ml-2 text-purple-900">
                                                            {formatDate(trimestre.date_debut)} - {formatDate(trimestre.date_fin)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-purple-700">Statut :</span>
                                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${trimestre.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {trimestre.is_active ? 'Actif' : 'Inactif'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun trimestre défini</h4>
                                        <p className="text-gray-600">Aucun trimestre n'a été défini pour cette année scolaire.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Services */}
                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Services Associés à l'Année Scolaire</h3>
                                    <button
                                        onClick={() => setShowServiceModal(true)}
                                        className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
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
                                        <p className="text-gray-600 mb-4">Cette année scolaire n'a aucun service associé pour le moment.</p>
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

                        {/* Onglet Transport */}
                        {activeTab === 'transport' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Transport Scolaire - Vue d'ensemble</h3>

                                {/* Statistiques des bus */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-600">Bus utilisés</p>
                                                <p className="text-2xl font-bold text-blue-900">{busStats.totalBus}</p>
                                            </div>
                                            <div className="bg-blue-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-green-600">Élèves transportés</p>
                                                <p className="text-2xl font-bold text-green-900">{busStats.totalElevesTransport}</p>
                                            </div>
                                            <div className="bg-green-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-purple-600">Itinéraires</p>
                                                <p className="text-2xl font-bold text-purple-900">{busStats.totalItineraires}</p>
                                            </div>
                                            <div className="bg-purple-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-orange-600">Taux d'occupation</p>
                                                <p className="text-2xl font-bold text-orange-900">
                                                    {inscriptionsCount > 0 
                                                        ? Math.round((busStats.totalElevesTransport / inscriptionsCount) * 100) 
                                                        : 0}%
                                                </p>
                                            </div>
                                            <div className="bg-orange-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Liste des bus utilisés */}
                                {busStats.busUtilises.length > 0 ? (
                                    <div className="space-y-4">
                                        <h4 className="text-md font-semibold text-gray-900">Bus utilisés cette année</h4>
                                        {busStats.busUtilises.map((busData, index) => (
                                            <div key={busData.bus.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-200">
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="text-lg font-semibold text-gray-900">
                                                                    {busData.bus.immatriculation}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {busData.bus.marque} {busData.bus.modele} • {busData.bus.capacite} places
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    Chauffeur: {busData.bus.chauffeur_nom}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-2xl font-bold text-blue-600">
                                                                    {busData.count}
                                                                </div>
                                                                <div className="text-sm text-gray-600">élèves</div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4">
                                                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                                <span>Taux d'occupation</span>
                                                                <span>{Math.round((busData.count / busData.bus.capacite) * 100)}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-500"
                                                                    style={{ width: `${Math.round((busData.count / busData.bus.capacite) * 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 text-sm text-gray-600">
                                                            <span className="font-medium">Itinéraires :</span> {busData.itineraires.length}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun bus utilisé</h4>
                                        <p className="text-gray-600">Aucun élève de cette année scolaire n'est actuellement affecté à un transport scolaire.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Statistiques */}
                        {activeTab === 'statistiques' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Statistiques Détaillées</h3>

                                {/* Cartes de statistiques */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-600">Inscriptions totales</p>
                                                <p className="text-2xl font-bold text-blue-900">{inscriptionsCount}</p>
                                            </div>
                                            <div className="bg-blue-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-green-600">Inscriptions actives</p>
                                                <p className="text-2xl font-bold text-green-900">{inscriptionsActives}</p>
                                            </div>
                                            <div className="bg-green-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-purple-600">Classes</p>
                                                <p className="text-2xl font-bold text-purple-900">{classesCount}</p>
                                            </div>
                                            <div className="bg-purple-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-orange-600">Niveaux</p>
                                                <p className="text-2xl font-bold text-orange-900">{niveauxCount}</p>
                                            </div>
                                            <div className="bg-orange-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistiques financières */}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistiques Financières</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{totalFactures}</div>
                                            <div className="text-sm text-gray-600">Factures générées</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">{facturesPayees}</div>
                                            <div className="text-sm text-gray-600">Factures payées</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {totalFactures > 0 ? Math.round((facturesPayees / totalFactures) * 100) : 0}%
                                            </div>
                                            <div className="text-sm text-gray-600">Taux de paiement</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Répartition par cycle */}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Cycle</h4>
                                    <div className="space-y-4">
                                        {annee.trimestres?.reduce((cycles, trimestre) => {
                                            if (trimestre.cycle && !cycles.find(c => c.id === trimestre.cycle.id)) {
                                                cycles.push(trimestre.cycle);
                                            }
                                            return cycles;
                                        }, []).map((cycle) => (
                                            <div key={cycle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
                                                    <span className="font-medium text-gray-900">{cycle.nom}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {cycle.nombre_trimestres} trimestre(s)
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
                                    {services.map((service) => (
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