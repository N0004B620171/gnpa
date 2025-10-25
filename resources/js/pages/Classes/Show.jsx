import React, { useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Show = ({ classe, eleves, factures, serviceCiblages, services, affectationsTransport, busUtilises, itineraires, anneesScolaires }) => {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('informations');
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showExcelModal, setShowExcelModal] = useState(false);

    const { data: serviceData, setData: setServiceData, post: postService, processing: serviceProcessing, reset: resetService } = useForm({
        service_id: ''
    });

    const { data: excelData, setData: setExcelData, post: postExcel, processing: excelProcessing, errors: excelErrors, reset: resetExcel } = useForm({
        fichier_excel: null,
        annee_scolaire_id: '',
        creer_parents: true
    });

    const telechargerModeleExcel = () => {
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = '/api/telecharger-modele-excel';
        link.download = 'modele_import_eleves.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la classe "${classe.nom}" ?`)) {
            router.delete(`/classes/${classe.id}`);
        }
    };

    const getEffectifColor = (effectif, capacite) => {
        const tauxRemplissage = (effectif / capacite) * 100;
        if (tauxRemplissage >= 90) return 'text-red-600 bg-red-50 border-red-200';
        if (tauxRemplissage >= 75) return 'text-orange-600 bg-orange-50 border-orange-200';
        if (tauxRemplissage >= 50) return 'text-green-600 bg-green-50 border-green-200';
        return 'text-blue-600 bg-blue-50 border-blue-200';
    };

    const calculateTauxRemplissage = (effectif, capacite) => {
        return capacite > 0 ? Math.round((effectif / capacite) * 100) : 0;
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(montant || 0);
    };

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

    const handleAssocierService = (e) => {
        e.preventDefault();
        postService(`/classes/${classe.id}/associer-service`, {
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

    const handleExcelUpload = (e) => {
        e.preventDefault();
        postExcel(`/classes/${classe.id}/importer-eleves`, {
            onSuccess: () => {
                resetExcel();
                setShowExcelModal(false);
            }
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setExcelData('fichier_excel', file);
        }
    };

    // Calcul des statistiques
    const effectif = eleves?.length || 0;
    const capacite = classe?.capacite || 30;
    const tauxRemplissage = calculateTauxRemplissage(effectif, capacite);
    const garcons = eleves?.filter(eleve => eleve?.sexe === 'M').length || 0;
    const filles = eleves?.filter(eleve => eleve?.sexe === 'F').length || 0;

    // Statistiques financières
    const facturesStats = {
        total: factures?.length || 0,
        payees: factures?.filter(f => f?.statut === 'paye').length || 0,
        partielles: factures?.filter(f => f?.statut === 'partiel').length || 0,
        impayees: factures?.filter(f => f?.statut === 'non_paye').length || 0,
        totalMontant: factures?.reduce((sum, f) => sum + parseFloat(f?.montant_total || 0), 0) || 0,
        totalPaye: factures?.reduce((sum, f) => sum + parseFloat(f?.montant_paye || 0), 0) || 0,
        totalRestant: factures?.reduce((sum, f) => {
            const total = parseFloat(f?.montant_total || 0);
            const paye = parseFloat(f?.montant_paye || 0);
            return sum + (total - paye);
        }, 0) || 0
    };

    // Élèves avec transport
    const elevesAvecTransport = affectationsTransport?.filter(affectation =>
        affectation?.actif === true
    ).length || 0;

    // Fonction pour obtenir l'itinéraire de transport d'un élève
    const getItineraireEleve = (eleveId) => {
        const affectation = affectationsTransport?.find(a =>
            a?.inscription?.eleve_id === eleveId && a?.actif === true
        );
        return affectation?.itineraire_transport;
    };

    // Fonction pour obtenir le parent d'un élève
    const getParentEleve = (eleve) => {
        return eleve?.parent_eleve;
    };

    // Fonction pour formater la date de naissance
    const formatDateNaissance = (date) => {
        if (!date) return 'Non renseignée';
        try {
            return new Date(date).toLocaleDateString('fr-FR');
        } catch (error) {
            return 'Date invalide';
        }
    };

    // Calcul de l'âge moyen des élèves
    const calculerAgeMoyen = () => {
        if (!eleves?.length) return 0;

        const aujourdhui = new Date();
        const ages = eleves
            .filter(eleve => eleve?.date_naissance)
            .map(eleve => {
                const naissance = new Date(eleve.date_naissance);
                let age = aujourdhui.getFullYear() - naissance.getFullYear();
                const mois = aujourdhui.getMonth() - naissance.getMonth();
                if (mois < 0 || (mois === 0 && aujourdhui.getDate() < naissance.getDate())) {
                    age--;
                }
                return age;
            })
            .filter(age => age > 0);

        return ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;
    };

    const ageMoyen = calculerAgeMoyen();

    return (
        <AppLayout>
            <Head title={`Classe ${classe?.nom || 'Non trouvée'}`} />

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
                <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center">
                            <Link href="/classes" className="mr-4">
                                <button className="inline-flex items-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Classe {classe?.nom || 'Non trouvée'}
                                </h1>
                                <p className="text-emerald-100 mt-2 text-lg">
                                    {classe?.niveau?.nom || 'Niveau non défini'} - {classe?.niveau?.cycle?.nom || 'Cycle non défini'}
                                </p>
                                <div className="flex flex-wrap gap-4 mt-3 text-emerald-200 text-sm">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        {effectif} élève{effectif > 1 ? 's' : ''} sur {capacite}
                                    </div>
                                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${getEffectifColor(effectif, capacite)}`}>
                                        {tauxRemplissage}% de remplissage
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
                                href={`/classes/${classe?.id}/statistiques`}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Statistiques
                            </Link>
                            <Link
                                href={`/classes/${classe?.id}/edit`}
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
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'informations'
                                        ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Informations
                            </button>
                            <button
                                onClick={() => setActiveTab('eleves')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'eleves'
                                        ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                Élèves ({effectif})
                            </button>
                            <button
                                onClick={() => setActiveTab('factures')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'factures'
                                        ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5 5.5h.01m2.49 6v-2.5m0 2.5h-2.5m2.5 0h2.5m-10-6h.01M15 13.5h.01M12 12h.01M9 10.5h.01M9.5 15h.01m5.49 2.5h.01M15 12h.01m-5 0h.01M9 7.5h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                                Factures ({facturesStats.total})
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'services'
                                        ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50'
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
                                        ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Transport
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
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            Informations Générales
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="font-medium text-blue-700">Nom :</span>
                                                    <p className="text-blue-900 font-semibold">{classe?.nom}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Niveau :</span>
                                                    <p className="text-blue-900">{classe?.niveau?.nom || 'Non défini'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Cycle :</span>
                                                    <p className="text-blue-900">{classe?.niveau?.cycle?.nom || 'Non défini'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Capacité :</span>
                                                    <p className="text-blue-900 font-semibold">{capacite} élèves</p>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-blue-200">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium text-blue-700">Taux de remplissage :</span>
                                                    <span className={`font-bold ${tauxRemplissage >= 90 ? 'text-red-600' :
                                                            tauxRemplissage >= 75 ? 'text-orange-600' :
                                                                tauxRemplissage >= 50 ? 'text-green-600' : 'text-blue-600'
                                                        }`}>
                                                        {tauxRemplissage}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full transition-all duration-500 ${tauxRemplissage >= 90 ? 'bg-red-500' :
                                                                tauxRemplissage >= 75 ? 'bg-orange-500' :
                                                                    tauxRemplissage >= 50 ? 'bg-green-500' : 'bg-blue-500'
                                                            }`}
                                                        style={{ width: `${tauxRemplissage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-sm text-blue-600 mt-1">
                                                    <span>{effectif} inscrit{effectif > 1 ? 's' : ''}</span>
                                                    <span>{capacite - effectif} place{capacite - effectif > 1 ? 's' : ''} libre{capacite - effectif > 1 ? 's' : ''}</span>
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
                                                    <div className="text-2xl font-bold text-blue-600">{garcons}</div>
                                                    <div className="text-sm text-green-700">Garçons</div>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-xl border border-green-100">
                                                    <div className="text-2xl font-bold text-pink-600">{filles}</div>
                                                    <div className="text-sm text-green-700">Filles</div>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-xl border border-green-100">
                                                    <div className="text-2xl font-bold text-purple-600">{elevesAvecTransport}</div>
                                                    <div className="text-sm text-green-700">Avec transport</div>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-xl border border-green-100">
                                                    <div className="text-2xl font-bold text-orange-600">{ageMoyen}</div>
                                                    <div className="text-sm text-green-700">Âge moyen</div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-green-200">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Total factures :</span>
                                                        <span className="font-bold text-green-900">{formatMontant(facturesStats.totalMontant)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-green-600">Payé :</span>
                                                        <span className="font-semibold text-green-700">{formatMontant(facturesStats.totalPaye)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-orange-600">Reste à payer :</span>
                                                        <span className="font-semibold text-orange-700">{formatMontant(facturesStats.totalRestant)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Professeur Principal */}
                                {classe?.professeur && (
                                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                                        <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Professeur Principal
                                        </h3>
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                                                <span className="text-purple-600 font-bold text-lg">
                                                    {classe.professeur.prenom?.[0]}{classe.professeur.nom?.[0]}
                                                </span>
                                            </div>
                                            <div className="ml-6">
                                                <h4 className="text-xl font-bold text-gray-900">
                                                    {classe.professeur.prenom} {classe.professeur.nom}
                                                </h4>
                                                <p className="text-gray-600 mt-1">{classe.professeur.email}</p>
                                                {classe.professeur.telephone && (
                                                    <p className="text-gray-600">{classe.professeur.telephone}</p>
                                                )}
                                                {classe.professeur.specialite && (
                                                    <p className="text-purple-600 font-medium mt-2">
                                                        Spécialité: {classe.professeur.specialite}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

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

                        {/* Onglet Élèves */}
                        {activeTab === 'eleves' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Liste des Élèves ({effectif})</h3>
                                    <div className="flex gap-3 mt-4 sm:mt-0">
                                        <Link
                                            href="/eleves/create"
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Inscrire un élève
                                        </Link>
                                        <button
                                            onClick={() => setShowExcelModal(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Importer Excel
                                        </button>
                                        <Link
                                            href={`/classes/${classe?.id}/emploi-du-temps`}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Emploi du temps
                                        </Link>
                                    </div>
                                </div>

                                {eleves && eleves.length > 0 ? (
                                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-200">
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Élève</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sexe</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date de naissance</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transport</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Parent</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {eleves.map((eleve) => {
                                                        const itineraire = getItineraireEleve(eleve.id);
                                                        const parent = getParentEleve(eleve);
                                                        return (
                                                            <tr key={eleve.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center">
                                                                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                                            <span className="text-purple-600 font-bold">
                                                                                {eleve.prenom?.[0]}{eleve.nom?.[0]}
                                                                            </span>
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <div className="text-sm font-medium text-gray-900">
                                                                                {eleve.prenom} {eleve.nom}
                                                                            </div>
                                                                            <div className="text-xs text-gray-500">
                                                                                {eleve.uid || 'Sans matricule'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${eleve.sexe === 'M'
                                                                            ? 'bg-blue-100 text-blue-800'
                                                                            : 'bg-pink-100 text-pink-800'
                                                                        }`}>
                                                                        {eleve.sexe === 'M' ? 'Garçon' : 'Fille'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                                    {formatDateNaissance(eleve.date_naissance)}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {itineraire ? (
                                                                        <div className="flex flex-col">
                                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1">
                                                                                {itineraire.nom}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">
                                                                                {itineraire.bus?.immatriculation || 'Sans bus'}
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                            Aucun
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {parent ? (
                                                                        <div className="text-sm">
                                                                            <div className="font-medium text-gray-900">
                                                                                {parent.prenom} {parent.nom}
                                                                            </div>
                                                                            {parent.telephone && (
                                                                                <div className="text-xs text-gray-600">{parent.telephone}</div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-xs text-gray-500">Aucun parent</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex space-x-2">
                                                                        <Link
                                                                            href={`/eleves/${eleve.id}`}
                                                                            className="inline-flex items-center p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                                            title="Voir détails"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        </Link>
                                                                        <Link
                                                                            href={`/eleves/${eleve.id}/edit`}
                                                                            className="inline-flex items-center p-1 text-green-600 hover:text-green-800 transition-colors"
                                                                            title="Modifier"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                            </svg>
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        <p className="text-gray-500">Aucun élève inscrit dans cette classe</p>
                                        <div className="flex gap-3 justify-center mt-4">
                                            <Link
                                                href="/eleves/create"
                                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Inscrire un élève
                                            </Link>
                                            <button
                                                onClick={() => setShowExcelModal(true)}
                                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Importer Excel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Factures */}
                        {activeTab === 'factures' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Factures de la Classe</h3>

                                {/* Statistiques financières */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-600">Total Factures</p>
                                                <p className="text-2xl font-bold text-blue-900">{facturesStats.total}</p>
                                            </div>
                                            <div className="bg-blue-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5 5.5h.01m2.49 6v-2.5m0 2.5h-2.5m2.5 0h2.5m-10-6h.01M15 13.5h.01M12 12h.01M9 10.5h.01M9.5 15h.01m5.49 2.5h.01M15 12h.01m-5 0h.01M9 7.5h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-green-600">Payées</p>
                                                <p className="text-2xl font-bold text-green-900">{facturesStats.payees}</p>
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
                                                <p className="text-sm font-medium text-orange-600">Partielles</p>
                                                <p className="text-2xl font-bold text-orange-900">{facturesStats.partielles}</p>
                                            </div>
                                            <div className="bg-orange-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-red-600">Impayées</p>
                                                <p className="text-2xl font-bold text-red-900">{facturesStats.impayees}</p>
                                            </div>
                                            <div className="bg-red-100 rounded-full p-3">
                                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Résumé financier */}
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                                    <h4 className="text-lg font-semibold text-purple-800 mb-4">Résumé Financier</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">{formatMontant(facturesStats.totalMontant)}</div>
                                            <div className="text-sm text-purple-700">Montant total</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">{formatMontant(facturesStats.totalPaye)}</div>
                                            <div className="text-sm text-green-700">Total payé</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">{formatMontant(facturesStats.totalRestant)}</div>
                                            <div className="text-sm text-orange-700">Reste à payer</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Détails des factures */}
                                {factures && factures.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-md font-semibold text-gray-900">Dernières factures</h4>
                                            <span className="text-sm text-gray-600">
                                                Affichage des {Math.min(factures.length, 10)} dernières factures
                                            </span>
                                        </div>
                                        {factures.slice(0, 10).map((facture) => (
                                            <div key={facture.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-300 transition-all duration-200">
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="text-lg font-semibold text-gray-900">
                                                                    Facture #{facture.uid || facture.id}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {facture.eleve_nom || 'Élève non spécifié'}
                                                                </p>
                                                            </div>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(facture.statut)}`}>
                                                                {getStatutLabel(facture.statut)}
                                                            </span>
                                                        </div>
                                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <p className="text-sm text-gray-600">Montant total</p>
                                                                <p className="text-lg font-semibold text-gray-900">{formatMontant(facture.montant_total)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-600">Montant payé</p>
                                                                <p className="text-lg font-semibold text-green-600">{formatMontant(facture.montant_paye)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-600">Reste à payer</p>
                                                                <p className="text-lg font-semibold text-red-600">
                                                                    {formatMontant((facture.montant_total || 0) - (facture.montant_paye || 0))}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                                                            {facture.mois && facture.annee && (
                                                                <span>Mois: {facture.mois}/{facture.annee}</span>
                                                            )}
                                                            <span>Classe: {facture.classe_nom || classe?.nom}</span>
                                                            {facture.date_emission && (
                                                                <span>Émission: {new Date(facture.date_emission).toLocaleDateString('fr-FR')}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 lg:mt-0 lg:ml-6">
                                                        <Link
                                                            href={`/factures/${facture.id}`}
                                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Voir détails
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5 5.5h.01m2.49 6v-2.5m0 2.5h-2.5m2.5 0h2.5m-10-6h.01M15 13.5h.01M12 12h.01M9 10.5h.01M9.5 15h.01m5.49 2.5h.01M15 12h.01m-5 0h.01M9 7.5h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                        </svg>
                                        <p className="text-gray-500">Aucune facture trouvée pour cette classe</p>
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
                                        <p className="text-gray-600 mb-4">Cette classe n'a aucun service associé pour le moment.</p>
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
                                <h3 className="text-lg font-semibold text-gray-900">Transport Scolaire</h3>

                                {/* Bus utilisés par la classe */}
                                {busUtilises && busUtilises.length > 0 && (
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Bus utilisés ({busUtilises.length})
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {busUtilises.map((bus) => (
                                                <div key={bus.id} className="bg-white rounded-xl p-4 border border-blue-100">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h5 className="font-semibold text-gray-900">{bus.immatriculation}</h5>
                                                            <p className="text-sm text-gray-600">{bus.marque} {bus.modele}</p>
                                                            <p className="text-sm text-gray-600">Capacité: {bus.capacite} places</p>
                                                            <p className="text-sm text-gray-600">
                                                                Chauffeur: {bus.chauffeur_nom}
                                                                {bus.chauffeur_telephone && ` - ${bus.chauffeur_telephone}`}
                                                            </p>
                                                        </div>
                                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${bus.etat === 'actif'
                                                                ? 'bg-green-100 text-green-800'
                                                                : bus.etat === 'maintenance'
                                                                    ? 'bg-orange-100 text-orange-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {bus.etat === 'actif' ? 'Actif' :
                                                                bus.etat === 'maintenance' ? 'Maintenance' : 'Hors service'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Statistiques transport */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 text-center">
                                        <div className="text-2xl font-bold text-green-600">{elevesAvecTransport}</div>
                                        <div className="text-sm text-green-700">Élèves avec transport</div>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{effectif - elevesAvecTransport}</div>
                                        <div className="text-sm text-blue-700">Élèves sans transport</div>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {effectif > 0 ? Math.round((elevesAvecTransport / effectif) * 100) : 0}%
                                        </div>
                                        <div className="text-sm text-purple-700">Taux d'utilisation</div>
                                    </div>
                                </div>

                                {/* Itinéraires disponibles */}
                                {itineraires && itineraires.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <h4 className="text-md font-semibold text-gray-900 mb-4">Itinéraires Disponibles</h4>
                                        <div className="space-y-3">
                                            {itineraires.map((itineraire) => (
                                                <div key={itineraire.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">{itineraire.nom}</div>
                                                        <div className="text-sm text-gray-600 flex flex-wrap gap-4 mt-1">
                                                            <span>Bus: {itineraire.bus?.immatriculation || 'Non assigné'}</span>
                                                            {itineraire.bus?.chauffeur_nom && (
                                                                <span>Chauffeur: {itineraire.bus.chauffeur_nom}</span>
                                                            )}
                                                        </div>
                                                        {itineraire.arrets && itineraire.arrets.length > 0 && (
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                {itineraire.arrets.length} arrêt{itineraire.arrets.length > 1 ? 's' : ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-600">{itineraire.arrets?.length || 0} arrêts</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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

          {/* Modal d'import Excel - Version simplifiée */}
{showExcelModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-700 p-4 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Importer des Élèves</h2>
                    <button
                        onClick={() => setShowExcelModal(false)}
                        className="text-white hover:text-blue-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
                <form onSubmit={handleExcelUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Fichier Excel *
                        </label>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            required
                        />
                        {excelErrors.fichier_excel && (
                            <p className="text-red-600 text-xs mt-1">{excelErrors.fichier_excel}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Année Scolaire *
                        </label>
                        <select
                            value={excelData.annee_scolaire_id}
                            onChange={(e) => setExcelData('annee_scolaire_id', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            required
                        >
                            <option value="">Sélectionnez une année</option>
                            {anneesScolaires && anneesScolaires.map((annee) => (
                                <option key={annee.id} value={annee.id}>
                                    {annee.nom}
                                </option>
                            ))}
                        </select>
                        {excelErrors.annee_scolaire_id && (
                            <p className="text-red-600 text-xs mt-1">{excelErrors.annee_scolaire_id}</p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={excelData.creer_parents}
                            onChange={(e) => setExcelData('creer_parents', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Créer les parents automatiquement
                        </label>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-blue-800">Modèle</span>
                            <button
                                type="button"
                                onClick={telechargerModeleExcel}
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                                Télécharger
                            </button>
                        </div>
                        <p className="text-xs text-blue-700">
                            Colonnes: Prénom, Nom, Date naissance, Sexe, Prénom parent, Nom parent, Email, Téléphone
                        </p>
                    </div>
                </form>
            </div>

            <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setShowExcelModal(false)}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        onClick={handleExcelUpload}
                        disabled={excelProcessing || !excelData.fichier_excel || !excelData.annee_scolaire_id}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {excelProcessing ? 'Import...' : 'Importer'}
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
        </AppLayout>
    );
};

export default Show;