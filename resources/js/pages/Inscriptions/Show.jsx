import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Show = ({ inscription, serviceCiblages, services, itineraires, arrets }) => {
    const [activeTab, setActiveTab] = useState('informations');
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showTransportModal, setShowTransportModal] = useState(false);

    const { data: serviceData, setData: setServiceData, post: postService, processing: serviceProcessing, reset: resetService } = useForm({
        service_id: ''
    });

    const { data: transportData, setData: setTransportData, post: postTransport, processing: transportProcessing, reset: resetTransport } = useForm({
        itineraire_transport_id: '',
        arret_id: '',
        actif: true
    });

    const getStatusColor = (statut) => {
        return statut === 'actif'
            ? 'text-green-600 bg-green-50 border-green-200'
            : 'text-red-600 bg-red-50 border-red-200';
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(montant);
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

    const genererFactureMensuelle = (mois, annee) => {
        router.post(`/inscriptions/${inscription.id}/factures/generate-mensuelle`, {
            mois,
            annee
        });
    };

    const regenererFacturesAnnee = () => {
        router.post(`/inscriptions/${inscription.id}/factures/regenerate-annee`);
    };

    const getMoisLabel = (mois) => {
        const moisLabels = {
            1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril',
            5: 'Mai', 6: 'Juin', 7: 'Juillet', 8: 'Août',
            9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'
        };
        return moisLabels[mois] || mois;
    };

    const handleAssocierService = (e) => {
        e.preventDefault();
        postService(`/inscriptions/${inscription.id}/associer-service`, {
            onSuccess: () => {
                resetService();
                setShowServiceModal(false);
            }
        });
    };

    const handleAffecterTransport = (e) => {
        e.preventDefault();
        postTransport(`/inscriptions/${inscription.id}/affecter-transport`, {
            onSuccess: () => {
                resetTransport();
                setShowTransportModal(false);
            }
        });
    };

    const handleDissocierService = (serviceCiblageId) => {
        if (confirm('Êtes-vous sûr de vouloir dissocier ce service ?')) {
            router.delete(`/service-ciblages/${serviceCiblageId}`);
        }
    };

    const handleSupprimerTransport = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette affectation de transport ?')) {
            router.delete(`/inscriptions/${inscription.id}/supprimer-transport`);
        }
    };

    // Calculer les statistiques des factures
    const facturesStats = {
        total: inscription.factures?.length || 0,
        payees: inscription.factures?.filter(f => f.statut === 'paye').length || 0,
        partielles: inscription.factures?.filter(f => f.statut === 'partiel').length || 0,
        impayees: inscription.factures?.filter(f => f.statut === 'non_paye').length || 0,
        totalMontant: inscription.factures?.reduce((sum, f) => sum + parseFloat(f.montant_total), 0) || 0,
        totalPaye: inscription.factures?.reduce((sum, f) => sum + parseFloat(f.montant_paye), 0) || 0
    };

    // Filtrer les arrêts par itinéraire sélectionné
    const arretsFiltres = transportData.itineraire_transport_id
        ? arrets.filter(arret => arret.itineraire_transport_id == transportData.itineraire_transport_id)
        : [];

    return (
        <AppLayout>
            <Head title={`Inscription - ${inscription.eleve.prenom} ${inscription.eleve.nom}`} />

            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Détail de l'Inscription</h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                {inscription.eleve.prenom} {inscription.eleve.nom} - {inscription.classe.nom}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4 text-blue-200 text-sm">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {inscription.annee_scolaire.nom}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                                    </svg>
                                    {inscription.classe.niveau.nom}
                                </div>
                                <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(inscription.statut)}`}>
                                    {inscription.statut === 'actif' ? 'Actif' : 'Inactif'}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                            <Link
                                href="/inscriptions"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Retour à la liste
                            </Link>
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
                                href={`/inscriptions/${inscription.id}/edit`}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                            </Link>
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
                                onClick={() => setActiveTab('factures')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'factures'
                                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5 5.5h.01m2.49 6v-2.5m0 2.5h-2.5m2.5 0h2.5m-10-6h.01M15 13.5h.01M12 12h.01M9 10.5h.01M9.5 15h.01m5.49 2.5h.01M15 12h.01m-5 0h.01M9 7.5h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                                Factures ({inscription.factures?.length || 0})
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
                                onClick={() => setActiveTab('bulletins')}
                                className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'bulletins'
                                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Bulletins
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Onglet Informations */}
                        {activeTab === 'informations' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Informations de l'élève */}
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Informations de l'Élève
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-medium text-blue-700">Nom complet :</span>
                                                <span className="ml-2 text-blue-900">
                                                    {inscription.eleve.prenom} {inscription.eleve.nom}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-blue-700">Date de naissance :</span>
                                                <span className="ml-2 text-blue-900">
                                                    {inscription.eleve.date_naissance
                                                        ? new Date(inscription.eleve.date_naissance).toLocaleDateString('fr-FR')
                                                        : 'Non renseignée'
                                                    }
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-blue-700">Sexe :</span>
                                                <span className="ml-2 text-blue-900">
                                                    {inscription.eleve.sexe === 'M' ? 'Masculin' :
                                                        inscription.eleve.sexe === 'F' ? 'Féminin' : 'Non renseigné'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-blue-700">ID Élève :</span>
                                                <span className="ml-2 text-blue-900 font-mono">{inscription.eleve.uid}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations de l'inscription */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                        <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Informations de l'Inscription
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="font-medium text-green-700">Classe :</span>
                                                <span className="ml-2 text-green-900">{inscription.classe.nom}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Niveau :</span>
                                                <span className="ml-2 text-green-900">{inscription.classe.niveau.nom}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Année Scolaire :</span>
                                                <span className="ml-2 text-green-900">{inscription.annee_scolaire.nom}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Date d'inscription :</span>
                                                <span className="ml-2 text-green-900">
                                                    {new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Statut :</span>
                                                <span className={`ml-2 font-bold ${getStatusColor(inscription.statut).split(' ')[0]}`}>
                                                    {inscription.statut === 'actif' ? 'Actif' : 'Inactif'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Informations du parent */}
                                {inscription.eleve.parent_eleve && (
                                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                                        <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Informations du Parent
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="font-medium text-purple-700">Nom complet :</span>
                                                <span className="ml-2 text-purple-900">
                                                    {inscription.eleve.parent_eleve.prenom} {inscription.eleve.parent_eleve.nom}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-purple-700">Téléphone :</span>
                                                <span className="ml-2 text-purple-900">
                                                    {inscription.eleve.parent_eleve.telephone || 'Non renseigné'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-purple-700">Email :</span>
                                                <span className="ml-2 text-purple-900">
                                                    {inscription.eleve.parent_eleve.email || 'Non renseigné'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-purple-700">Adresse :</span>
                                                <span className="ml-2 text-purple-900">
                                                    {inscription.eleve.parent_eleve.adresse || 'Non renseignée'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Statistiques rapides */}
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
                            </div>
                        )}

                        {/* Onglet Services */}
                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Services Associés</h3>
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
                                        <p className="text-gray-600 mb-4">Cet élève n'a aucun service associé pour le moment.</p>
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

                        {/* Onglet Factures */}
                        {activeTab === 'factures' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Factures de l'Élève</h3>
                                    <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                                        <button
                                            onClick={regenererFacturesAnnee}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Regénérer année
                                        </button>
                                    </div>
                                </div>

                                {inscription.factures && inscription.factures.length > 0 ? (
                                    <div className="space-y-4">
                                        {inscription.factures.map((facture) => (
                                            <div key={facture.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-200">
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="text-lg font-semibold text-gray-900">
                                                                    {getMoisLabel(facture.mois)} {facture.annee}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    Facture #{facture.uid}
                                                                </p>
                                                            </div>
                                                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatutColor(facture.statut)}`}>
                                                                {getStatutLabel(facture.statut)}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                                                            <div>
                                                                <span className="text-gray-600">Total :</span>
                                                                <div className="font-semibold text-gray-900">{formatMontant(facture.montant_total)}</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">Payé :</span>
                                                                <div className="font-semibold text-green-600">{formatMontant(facture.montant_paye)}</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">Reste :</span>
                                                                <div className="font-semibold text-red-600">{formatMontant(facture.montant_restant)}</div>
                                                            </div>
                                                        </div>
                                                        {facture.montant_total > 0 && (
                                                            <div className="mt-3">
                                                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                                    <span>Progression</span>
                                                                    <span>{Math.round((facture.montant_paye / facture.montant_total) * 100)}%</span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                                    <div
                                                                        className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-500"
                                                                        style={{ width: `${Math.round((facture.montant_paye / facture.montant_total) * 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                                                        <Link
                                                            href={`/factures/${facture.id}`}
                                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Détails
                                                        </Link>
                                                        <button
                                                            onClick={() => genererFactureMensuelle(facture.mois, facture.annee)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                            Regénérer
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5 5.5h.01m2.49 6v-2.5m0 2.5h-2.5m2.5 0h2.5m-10-6h.01M15 13.5h.01M12 12h.01M9 10.5h.01M9.5 15h.01m5.49 2.5h.01M15 12h.01m-5 0h.01M9 7.5h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                        </svg>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune facture</h4>
                                        <p className="text-gray-600 mb-4">Aucune facture n'a été générée pour cet élève.</p>
                                        <button
                                            onClick={regenererFacturesAnnee}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Générer les factures
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Transport */}
                        {activeTab === 'transport' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Transport Scolaire</h3>
                                    {!inscription.affectation_transport ? (
                                        <button
                                            onClick={() => setShowTransportModal(true)}
                                            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Affecter un Transport
                                        </button>
                                    ) : (
                                        <div className="flex gap-2 mt-4 sm:mt-0">
                                            <button
                                                onClick={() => setShowTransportModal(true)}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Modifier
                                            </button>
                                            <button
                                                onClick={handleSupprimerTransport}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {inscription.affectation_transport ? (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-green-900">
                                                        {inscription.affectation_transport.itineraire_transport.nom}
                                                    </h4>
                                                    <p className="text-sm text-green-700">
                                                        Bus: {inscription.affectation_transport.itineraire_transport.bus?.immatriculation || 'Non assigné'}
                                                    </p>
                                                    {inscription.affectation_transport.arret && (
                                                        <p className="text-sm text-green-600">
                                                            Arrêt: {inscription.affectation_transport.arret.nom}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-green-600">
                                                        Conducteur: {inscription.affectation_transport.itineraire_transport.bus?.chauffeur?.nom_complet || 'Non assigné'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${inscription.affectation_transport.actif
                                                    ? 'text-green-600 bg-green-50 border-green-200'
                                                    : 'text-red-600 bg-red-50 border-red-200'
                                                }`}>
                                                {inscription.affectation_transport.actif ? 'Actif' : 'Inactif'}
                                            </div>
                                        </div>

                                        {/* Informations détaillées */}
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-green-700">Heure de départ :</span>
                                                <span className="ml-2 text-green-900">
                                                    {inscription.affectation_transport.itineraire_transport.heure_depart}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Heure de retour :</span>
                                                <span className="ml-2 text-green-900">
                                                    {inscription.affectation_transport.itineraire_transport.heure_retour}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Tarif :</span>
                                                <span className="ml-2 text-green-900 font-bold">
                                                    {formatMontant(inscription.affectation_transport.itineraire_transport.tarif)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Date d'affectation :</span>
                                                <span className="ml-2 text-green-900">
                                                    {new Date(inscription.affectation_transport.created_at).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun transport assigné</h4>
                                        <p className="text-gray-600 mb-4">Cet élève n'a pas encore été affecté à un transport scolaire.</p>
                                        <button
                                            onClick={() => setShowTransportModal(true)}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Affecter un Transport
                                        </button>
                                    </div>
                                )}

                                {/* Services de transport disponibles */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <h4 className="text-md font-semibold text-gray-900 mb-4">Itinéraires Disponibles</h4>
                                    <div className="space-y-3">
                                        {itineraires?.map((itineraire) => (
                                            <div key={itineraire.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{itineraire.nom}</div>
                                                    <div className="text-sm text-gray-600 flex flex-wrap gap-4 mt-1">
                                                        <span>Bus: {itineraire.bus?.immatriculation || 'Non assigné'}</span>
                                                        <span>Départ: {itineraire.heure_depart}</span>
                                                        <span>Retour: {itineraire.heure_retour}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {itineraire.description}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900">{formatMontant(itineraire.tarif)}</div>
                                                    <div className="text-sm text-gray-600">{itineraire.arrets?.length || 0} arrêts</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Onglet Bulletins */}
                        {/* Onglet Bulletins */}
                        {activeTab === 'bulletins' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Bulletins Scolaires</h3>

                                {inscription.bulletins && inscription.bulletins.length > 0 ? (
                                    <div className="space-y-4">
                                        {inscription.bulletins.map((bulletin) => {
                                            // Convertir moyenne_eleve en nombre et gérer les valeurs null/undefined
                                            const moyenne = parseFloat(bulletin.moyenne_eleve) || 0;
                                            const moyenneClasse = parseFloat(bulletin.moyenne_classe) || 0;

                                            return (
                                                <div key={bulletin.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-200">
                                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-gray-900">
                                                                        {bulletin.trimestre_nom || 'Bulletin Annuel'}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {bulletin.annee_scolaire_nom}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-bold text-blue-600">
                                                                        {moyenne > 0 ? moyenne.toFixed(2) : 'N/A'}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        / {bulletin.bareme || 20}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                                                                <div>
                                                                    <span className="text-gray-600">Rang :</span>
                                                                    <div className="font-semibold text-gray-900">
                                                                        {bulletin.rang ? `${bulletin.rang}ème` : 'N/A'}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">Moyenne classe :</span>
                                                                    <div className="font-semibold text-gray-900">
                                                                        {moyenneClasse > 0 ? moyenneClasse.toFixed(2) : 'N/A'}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">Statut :</span>
                                                                    <div className={`font-semibold ${bulletin.is_locked ? 'text-green-600' : 'text-orange-600'
                                                                        }`}>
                                                                        {bulletin.is_locked ? 'Verrouillé' : 'En cours'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 lg:mt-0 lg:ml-6">
                                                            <Link
                                                                href={`/bulletins/${bulletin.id}`}
                                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                Voir le bulletin
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun bulletin</h4>
                                        <p className="text-gray-600">Aucun bulletin n'a été généré pour cet élève.</p>
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

            {/* Modal d'affectation de transport */}
            {showTransportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">
                                    {inscription.affectation_transport ? 'Modifier le Transport' : 'Affecter un Transport'}
                                </h2>
                                <button
                                    onClick={() => setShowTransportModal(false)}
                                    className="text-white hover:text-blue-200 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleAffecterTransport} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Itinéraire *
                                </label>
                                <select
                                    value={transportData.itineraire_transport_id}
                                    onChange={(e) => setTransportData('itineraire_transport_id', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                    required
                                >
                                    <option value="">Sélectionnez un itinéraire</option>
                                    {itineraires?.map((itineraire) => (
                                        <option key={itineraire.id} value={itineraire.id}>
                                            {itineraire.nom} - {itineraire.bus?.immatriculation || 'Sans bus'} ({formatMontant(itineraire.tarif)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Arrêt
                                </label>
                                <select
                                    value={transportData.arret_id}
                                    onChange={(e) => setTransportData('arret_id', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                    disabled={!transportData.itineraire_transport_id}
                                >
                                    <option value="">Sélectionnez un arrêt (optionnel)</option>
                                    {arretsFiltres.map((arret) => (
                                        <option key={arret.id} value={arret.id}>
                                            {arret.nom} - {arret.adresse}
                                        </option>
                                    ))}
                                </select>
                                {!transportData.itineraire_transport_id && (
                                    <p className="text-sm text-gray-500 mt-1">Veuillez d'abord sélectionner un itinéraire</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="actif"
                                    checked={transportData.actif}
                                    onChange={(e) => setTransportData('actif', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <label htmlFor="actif" className="ml-2 text-sm font-medium text-gray-700">
                                    Affectation active
                                </label>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowTransportModal(false)}
                                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={transportProcessing || !transportData.itineraire_transport_id}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {transportProcessing ? 'Affectation...' :
                                        inscription.affectation_transport ? 'Modifier' : 'Affecter'}
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