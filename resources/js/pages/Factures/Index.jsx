import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ factures, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.q || '');
    const [selectedMois, setSelectedMois] = useState(filters.mois || '');
    const [selectedAnnee, setSelectedAnnee] = useState(filters.annee || '');
    const [selectedStatut, setSelectedStatut] = useState(filters.statut || '');
    const [perPage, setPerPage] = useState(20);

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        router.get('/factures', {
            q: value,
            mois: selectedMois,
            annee: selectedAnnee,
            statut: selectedStatut,
            perPage
        }, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handleFilterChange = () => {
        router.get('/factures', {
            q: search,
            mois: selectedMois,
            annee: selectedAnnee,
            statut: selectedStatut,
            perPage
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        router.get('/factures', {
            q: search,
            mois: selectedMois,
            annee: selectedAnnee,
            statut: selectedStatut,
            perPage: value
        }, {
            preserveState: true,
            replace: true
        });
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
            'partiel': 'Partiel',
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

    const getProgressionPourcentage = (facture) => {
        if (facture.montant_total === 0) return 0;
        return Math.round((facture.montant_paye / facture.montant_total) * 100);
    };

    const annees = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
    const mois = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <AppLayout>
            <Head title="Gestion des Factures" />

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
                <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5 5.5h.01m2.49 6v-2.5m0 2.5h-2.5m2.5 0h2.5m-10-6h.01M15 13.5h.01M12 12h.01M9 10.5h.01M9.5 15h.01m5.49 2.5h.01M15 12h.01m-5 0h.01M9 7.5h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                                Gestion des Factures
                            </h1>
                            <p className="text-cyan-100 mt-2 text-lg">
                                Gérez les factures mensuelles des élèves
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                            <Link
                                href="/inscriptions"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Voir les inscriptions
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher un élève..."
                                    defaultValue={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div>
                            <select
                                value={selectedMois}
                                onChange={(e) => {
                                    setSelectedMois(e.target.value);
                                    handleFilterChange();
                                }}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200"
                            >
                                <option value="">Tous les mois</option>
                                {mois.map(m => (
                                    <option key={m} value={m}>{getMoisLabel(m)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                value={selectedAnnee}
                                onChange={(e) => {
                                    setSelectedAnnee(e.target.value);
                                    handleFilterChange();
                                }}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200"
                            >
                                <option value="">Toutes les années</option>
                                {annees.map(annee => (
                                    <option key={annee} value={annee}>{annee}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                value={selectedStatut}
                                onChange={(e) => {
                                    setSelectedStatut(e.target.value);
                                    handleFilterChange();
                                }}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="non_paye">Impayées</option>
                                <option value="partiel">Partielles</option>
                                <option value="paye">Payées</option>
                            </select>
                        </div>

                        <div>
                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(e.target.value)}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200"
                            >
                                <option value="10">10/page</option>
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
                                <p className="text-sm font-medium text-green-600">Total Factures</p>
                                <p className="text-2xl font-bold text-green-900">{factures.total}</p>
                            </div>
                            <div className="bg-green-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Impayées</p>
                                <p className="text-2xl font-bold text-red-900">
                                    {factures.data.filter(f => f.statut === 'non_paye').length}
                                </p>
                            </div>
                            <div className="bg-red-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">Partielles</p>
                                <p className="text-2xl font-bold text-orange-900">
                                    {factures.data.filter(f => f.statut === 'partiel').length}
                                </p>
                            </div>
                            <div className="bg-orange-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Payées</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {factures.data.filter(f => f.statut === 'paye').length}
                                </p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liste des Factures */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* En-tête du tableau (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-cyan-50 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        <div className="col-span-3">Élève & Classe</div>
                        <div className="col-span-2">Période</div>
                        <div className="col-span-2">Montants</div>
                        <div className="col-span-3">Progression</div>
                        <div className="col-span-1">Statut</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {factures.data.map((facture) => (
                            <div key={facture.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                <div className="px-6 py-6">
                                    {/* Version Mobile */}
                                    <div className="lg:hidden space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-cyan-600 font-bold text-lg">
                                                        {facture.eleve_nom?.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {facture.eleve_nom}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{facture.classe_nom} - {facture.niveau_nom}</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatutColor(facture.statut)}`}>
                                                {getStatutLabel(facture.statut)}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Période:</span>
                                                <span className="font-medium text-gray-900">
                                                    {getMoisLabel(facture.mois)} {facture.annee}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Total:</span>
                                                <span className="font-bold text-gray-900">{formatMontant(facture.montant_total)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Payé:</span>
                                                <span className="font-bold text-green-600">{formatMontant(facture.montant_paye)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Reste:</span>
                                                <span className="font-bold text-red-600">{formatMontant(facture.montant_restant) || 0}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-gray-600">
                                                    <span>Progression</span>
                                                    <span>{getProgressionPourcentage(facture)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${getProgressionPourcentage(facture)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={route('factures.show', facture.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors text-sm"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Détails
                                                </Link>
                                                {facture.montant_restant > 0 && (
                                                    <Link
                                                        href={route('paiements.create', facture.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                        </svg>
                                                        Payer
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Version Desktop */}
                                    <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
                                        <div className="col-span-3">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-cyan-600 font-bold text-lg">
                                                        {facture.eleve_nom?.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {facture.eleve_nom}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {facture.classe_nom} - {facture.niveau_nom}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {facture.annee_scolaire_nom}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-lg font-medium text-gray-900">
                                                {getMoisLabel(facture.mois)} {facture.annee}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Facture #{facture.uid}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Total:</span>
                                                    <span className="font-bold text-gray-900">{formatMontant(facture.montant_total)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Payé:</span>
                                                    <span className="font-bold text-green-600">{formatMontant(facture.montant_paye)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Reste:</span>
                                                    <span className="font-bold text-red-600">{formatMontant(facture.montant_restant) || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Progression du paiement</span>
                                                    <span className="font-medium">{getProgressionPourcentage(facture)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                                                        style={{ width: `${getProgressionPourcentage(facture)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-gray-500 text-center">
                                                    {formatMontant(facture.montant_paye)} / {formatMontant(facture.montant_total)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold border-2 ${getStatutColor(facture.statut)}`}>
                                                {getStatutLabel(facture.statut)}
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={route('factures.show', facture.id)}
                                                    className="p-2 text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 rounded-xl transition-all duration-200"
                                                    title="Voir les détails"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                {facture.montant_restant > 0 && (
                                                    <Link
                                                        href={route('paiements.create', facture.id)}
                                                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200"
                                                        title="Enregistrer un paiement"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                        </svg>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message vide */}
                    {factures.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5 5.5h.01m2.49 6v-2.5m0 2.5h-2.5m2.5 0h2.5m-10-6h.01M15 13.5h.01M12 12h.01M9 10.5h.01M9.5 15h.01m5.49 2.5h.01M15 12h.01m-5 0h.01M9 7.5h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune facture trouvée</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search || selectedMois || selectedAnnee || selectedStatut
                                    ? 'Aucune facture ne correspond à vos critères de recherche.'
                                    : 'Les factures apparaîtront ici une fois générées.'
                                }
                            </p>
                            <Link
                                href="/inscriptions"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl hover:from-cyan-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Voir les inscriptions
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {factures.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{factures.from}</span> à <span className="font-semibold">{factures.to}</span> sur <span className="font-semibold">{factures.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {factures.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${link.active
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg'
                                            : link.url
                                                ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-cyan-500 hover:text-cyan-600'
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