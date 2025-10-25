import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Show = ({ facture }) => {
    const [activeTab, setActiveTab] = useState('details');

    const getStatutColor = (statut) => {
        const colors = {
            'paye': 'text-green-600 bg-green-50 border-green-200',
            'partiel': 'text-orange-600 bg-orange-50 border-orange-200',
            'non_paye': 'text-red-600 bg-red-50 border-red-200'
        };
        return colors[statut] || 'text-gray-600 bg-gray-50 border-gray-200';
    };

    const getStatutLabel = (statut) => {
        const labels = {
            'paye': 'Payée',
            'partiel': 'Partielle',
            'non_paye': 'Impayée'
        };
        return labels[statut] || statut;
    };

    const getMoisLabel = (mois) => {
        const moisLabels = {
            1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril',
            5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août',
            9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'
        };
        return moisLabels[mois] || mois;
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(montant);
    };

    const getProgressionPourcentage = () => {
        if (facture.montant_total === 0) return 0;
        return Math.round((facture.montant_paye / facture.montant_total) * 100);
    };

    const genererFactureMensuelle = () => {
        router.post(`/inscriptions/${facture.inscription_id}/factures/generate-mensuelle`, {
            mois: facture.mois,
            annee: facture.annee
        });
    };

    const regenererFacturesAnnee = () => {
        router.post(`/inscriptions/${facture.inscription_id}/factures/regenerate-annee`);
    };

    return (
        <AppLayout>
            <Head title={`Facture - ${facture.eleve_nom}`} />

            <div className="max-w-7xl mx-auto">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Détail de la Facture</h1>
                            <p className="text-cyan-100 mt-2 text-lg">
                                {facture.eleve_nom} - {getMoisLabel(facture.mois)} {facture.annee}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                            <Link
                                href="/factures"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Retour aux factures
                            </Link>
                            <Link
                                href={route('paiements.create', facture.id)}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                Nouveau Paiement
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        {/* Navigation par onglets */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="border-b border-gray-200">
                                <nav className="flex -mb-px">
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${
                                            activeTab === 'details'
                                                ? 'border-b-2 border-cyan-500 text-cyan-600 bg-cyan-50'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Détails de la Facture
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('services')}
                                        className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${
                                            activeTab === 'services'
                                                ? 'border-b-2 border-cyan-500 text-cyan-600 bg-cyan-50'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Services ({facture.details?.length || 0})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('paiements')}
                                        className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${
                                            activeTab === 'paiements'
                                                ? 'border-b-2 border-cyan-500 text-cyan-600 bg-cyan-50'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        Paiements ({facture.paiements?.length || 0})
                                    </button>
                                </nav>
                            </div>

                            <div className="p-6">
                                {/* Onglet Détails */}
                                {activeTab === 'details' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
                                                <h3 className="text-lg font-semibold text-cyan-800 mb-4">Informations de l'Élève</h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="font-medium text-cyan-700">Élève :</span>
                                                        <span className="ml-2 text-cyan-900">{facture.eleve_nom}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-cyan-700">Classe :</span>
                                                        <span className="ml-2 text-cyan-900">{facture.classe_nom}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-cyan-700">Niveau :</span>
                                                        <span className="ml-2 text-cyan-900">{facture.niveau_nom}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-cyan-700">Année Scolaire :</span>
                                                        <span className="ml-2 text-cyan-900">{facture.annee_scolaire_nom}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                                <h3 className="text-lg font-semibold text-blue-800 mb-4">Informations de Facturation</h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="font-medium text-blue-700">Période :</span>
                                                        <span className="ml-2 text-blue-900">{getMoisLabel(facture.mois)} {facture.annee}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-blue-700">Statut :</span>
                                                        <span className={`ml-2 font-bold ${getStatutColor(facture.statut).split(' ')[0]}`}>
                                                            {getStatutLabel(facture.statut)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-blue-700">ID Facture :</span>
                                                        <span className="ml-2 text-blue-900 font-mono">{facture.uid}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-blue-700">Date de création :</span>
                                                        <span className="ml-2 text-blue-900">
                                                            {new Date(facture.created_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Résumé financier */}
                                        <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-2xl p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Résumé Financier</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-900">{formatMontant(facture.montant_total)}</div>
                                                    <div className="text-sm text-gray-600">Total à payer</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">{formatMontant(facture.montant_paye)}</div>
                                                    <div className="text-sm text-gray-600">Déjà payé</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-red-600">{formatMontant(facture.montant_restant)}</div>
                                                    <div className="text-sm text-gray-600">Reste à payer</div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                    <span>Progression du paiement</span>
                                                    <span className="font-medium">{getProgressionPourcentage()}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-4">
                                                    <div 
                                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                                                        style={{ width: `${getProgressionPourcentage()}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Onglet Services */}
                                {activeTab === 'services' && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-gray-900">Services Facturés</h3>
                                            <span className="text-sm text-gray-600">
                                                {facture.details?.length || 0} service(s)
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            {facture.details?.map((service) => (
                                                <div key={service.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-cyan-300 transition-all duration-200">
                                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-gray-900">{service.service_nom}</h4>
                                                                    {service.service_description && (
                                                                        <p className="text-sm text-gray-600 mt-1">{service.service_description}</p>
                                                                    )}
                                                                    <div className="flex items-center gap-4 mt-2">
                                                                        <span className="text-sm text-gray-500 font-mono">{service.service_code}</span>
                                                                        {service.service_obligatoire && (
                                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                                                Obligatoire
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-bold text-gray-900">{formatMontant(service.montant)}</div>
                                                                    <div className={`text-sm font-medium ${getStatutColor(service.statut).split(' ')[0]}`}>
                                                                        {getStatutLabel(service.statut)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                                    <span>Progression</span>
                                                                    <span>
                                                                        {formatMontant(service.montant_paye)} / {formatMontant(service.montant)}
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                                    <div 
                                                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                                                        style={{ width: `${service.montant > 0 ? Math.round((service.montant_paye / service.montant) * 100) : 0}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Onglet Paiements */}
                                {activeTab === 'paiements' && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-gray-900">Historique des Paiements</h3>
                                            <span className="text-sm text-gray-600">
                                                {facture.paiements?.length || 0} paiement(s)
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            {facture.paiements?.map((paiement) => (
                                                <div key={paiement.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-all duration-200">
                                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-gray-900">
                                                                        {formatMontant(paiement.montant)}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {paiement.mode_paiement}
                                                                        {paiement.reference_transaction && ` - Ref: ${paiement.reference_transaction}`}
                                                                    </p>
                                                                    {paiement.facture_detail && (
                                                                        <p className="text-sm text-cyan-600 mt-1">
                                                                            Pour: {paiement.facture_detail.service_nom}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {new Date(paiement.date_paiement).toLocaleDateString('fr-FR')}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {new Date(paiement.date_paiement).toLocaleTimeString('fr-FR')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions rapides */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    href={route('paiements.create', facture.id)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Nouveau Paiement
                                </Link>
                                <button
                                    onClick={genererFactureMensuelle}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-cyan-600 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Regénérer cette facture
                                </button>
                                <button
                                    onClick={regenererFacturesAnnee}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Regénérer année
                                </button>
                                <Link
                                    href={`/inscriptions/${facture.inscription_id}`}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Voir l'inscription
                                </Link>
                            </div>
                        </div>

                        {/* Informations de suivi */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>ID Facture:</span>
                                    <span className="font-mono text-gray-900">{facture.uid}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Créée le:</span>
                                    <span>{new Date(facture.created_at).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Modifiée le:</span>
                                    <span>{new Date(facture.updated_at).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Statut:</span>
                                    <span className={`font-medium ${getStatutColor(facture.statut).split(' ')[0]}`}>
                                        {getStatutLabel(facture.statut)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Show;