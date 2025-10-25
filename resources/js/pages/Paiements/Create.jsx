import React, { useState, useEffect } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Create = ({ facture }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        montant: '',
        mode: 'espèces',
        facture_detail_id: ''
    });

    const [selectedService, setSelectedService] = useState(null);
    const [paiementType, setPaiementType] = useState('global');

    // Calculer le montant maximum payable
    const getMaxMontant = () => {
        if (paiementType === 'service' && selectedService) {
            return selectedService.montant - selectedService.montant_paye;
        }
        return facture.montant_restant;
    };

    // Formater le montant
    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(montant);
    };

    // Obtenir la couleur du statut
    const getStatutColor = (statut) => {
        const colors = {
            'paye': 'text-green-600 bg-green-50 border-green-200',
            'partiel': 'text-orange-600 bg-orange-50 border-orange-200',
            'non_paye': 'text-red-600 bg-red-50 border-red-200'
        };
        return colors[statut] || 'text-gray-600 bg-gray-50 border-gray-200';
    };

    // Obtenir le label du statut
    const getStatutLabel = (statut) => {
        const labels = {
            'paye': 'Payé',
            'partiel': 'Partiel',
            'non_paye': 'Impayé'
        };
        return labels[statut] || statut;
    };

    // Gérer la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation supplémentaire
        const maxMontant = getMaxMontant();
        if (parseFloat(data.montant) > maxMontant) {
            alert(`Le montant ne peut pas dépasser ${formatMontant(maxMontant)}`);
            return;
        }

        // Utiliser l'ancienne route
        post(route('paiements.store', facture.id), {
            onSuccess: () => {
                reset();
                setSelectedService(null);
                setPaiementType('global');
            }
        });
    };

    // Gérer le changement de type de paiement
    const handlePaiementTypeChange = (type) => {
        setPaiementType(type);
        setSelectedService(null);
        setData('facture_detail_id', '');
        
        if (type === 'global') {
            setData('montant', '');
        } else {
            setData('montant', '');
        }
    };

    // Gérer la sélection d'un service
    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setData('facture_detail_id', service.id);
        setData('montant', '');
    };

    // Services triés par statut (impayés en premier)
    const sortedServices = facture.details?.sort((a, b) => {
        const statutOrder = { 'non_paye': 0, 'partiel': 1, 'paye': 2 };
        return statutOrder[a.statut] - statutOrder[b.statut];
    });

    return (
        <AppLayout>
            <Head title={`Nouveau Paiement - ${facture.eleve_nom}`} />

            <div className="max-w-4xl mx-auto">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                Nouveau Paiement
                            </h1>
                            <p className="text-green-100 mt-2 text-lg">
                                {facture.eleve_nom} - Facture #{facture.uid}
                            </p>
                        </div>
                        <Link
                            href={route('factures.show', facture.id)}
                            className="mt-4 lg:mt-0 inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à la facture
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Type de paiement */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Type de Paiement
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => handlePaiementTypeChange('global')}
                                                className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                                                    paiementType === 'global'
                                                        ? 'border-green-500 bg-green-50 ring-4 ring-green-500/20'
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                                        paiementType === 'global' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h4 className="font-semibold text-gray-900">Paiement Global</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Paiement sur l'ensemble de la facture
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handlePaiementTypeChange('service')}
                                                className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                                                    paiementType === 'service'
                                                        ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-500/20'
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                                        paiementType === 'service' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h4 className="font-semibold text-gray-900">Paiement par Service</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Paiement sur un service spécifique
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sélection du service (si paiement par service) */}
                                    {paiementType === 'service' && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Sélection du Service
                                            </h3>
                                            
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {sortedServices?.map((service) => (
                                                    <div
                                                        key={service.id}
                                                        onClick={() => handleServiceSelect(service)}
                                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                                            selectedService?.id === service.id
                                                                ? 'border-green-500 bg-green-50 ring-4 ring-green-500/20'
                                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                        } ${service.statut === 'paye' ? 'opacity-60' : ''}`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-semibold text-gray-900">{service.service_nom}</h4>
                                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatutColor(service.statut)}`}>
                                                                        {getStatutLabel(service.statut)}
                                                                    </div>
                                                                </div>
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
                                                        </div>
                                                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-gray-600">Total:</span>
                                                                <div className="font-semibold text-gray-900">{formatMontant(service.montant)}</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">Payé:</span>
                                                                <div className="font-semibold text-green-600">{formatMontant(service.montant_paye)}</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-600">Reste:</span>
                                                                <div className="font-semibold text-red-600">
                                                                    {formatMontant(service.montant - service.montant_paye)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {service.montant > 0 && (
                                                            <div className="mt-2">
                                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                                    <div 
                                                                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                                                                        style={{ 
                                                                            width: `${Math.round((service.montant_paye / service.montant) * 100)}%` 
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {!selectedService && (
                                                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                        </svg>
                                                        <span className="text-sm text-yellow-800">
                                                            Veuillez sélectionner un service pour continuer
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Informations de paiement */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            Informations de Paiement
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Montant */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                    Montant (FCFA) *
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        max={getMaxMontant()}
                                                        value={data.montant}
                                                        onChange={(e) => setData('montant', e.target.value)}
                                                        className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                                            errors.montant ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                                                        } focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white pr-20`}
                                                        placeholder="0.00"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                                        <span className="text-sm text-gray-500">
                                                            Max: {formatMontant(getMaxMontant())}
                                                        </span>
                                                    </div>
                                                </div>
                                                {errors.montant && (
                                                    <div className="flex items-center mt-2 text-red-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm">{errors.montant}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Mode de paiement */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                    Mode de paiement *
                                                </label>
                                                <select
                                                    value={data.mode}
                                                    onChange={(e) => setData('mode', e.target.value)}
                                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white"
                                                >
                                                    <option value="espèces">Espèces</option>
                                                    <option value="cheque">Chèque</option>
                                                    <option value="virement">Virement</option>
                                                    <option value="mobile_money">Mobile Money</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Résumé du paiement */}
                                    {(data.montant && parseFloat(data.montant) > 0) && (
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                            <h4 className="text-sm font-semibold text-green-800 mb-4 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Résumé du Paiement
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-green-700">Type :</span>
                                                    <span className="ml-2 text-green-900">
                                                        {paiementType === 'global' ? 'Paiement global' : 'Paiement par service'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-green-700">Service :</span>
                                                    <span className="ml-2 text-green-900">
                                                        {selectedService ? selectedService.service_nom : 'Facture complète'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-green-700">Montant :</span>
                                                    <span className="ml-2 text-green-900 font-bold">
                                                        {formatMontant(parseFloat(data.montant))}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-green-700">Mode :</span>
                                                    <span className="ml-2 text-green-900 capitalize">
                                                        {data.mode}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Boutons d'action */}
                                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                                        <Link
                                            href={route('factures.show', facture.id)}
                                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                            Annuler
                                        </Link>

                                        <button
                                            type="submit"
                                            disabled={processing || !data.montant || parseFloat(data.montant) <= 0 || (paiementType === 'service' && !selectedService)}
                                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 focus:ring-4 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span className="font-semibold">Enregistrement...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="font-semibold">Enregistrer le paiement</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar avec informations */}
                    <div className="space-y-6">
                        {/* Résumé de la facture */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé Facture</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Élève:</span>
                                    <span className="font-semibold text-gray-900">{facture.eleve_nom}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Classe:</span>
                                    <span className="font-semibold text-gray-900">{facture.classe_nom}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Période:</span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date(facture.annee, facture.mois - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-gray-600">Total:</span>
                                        <span className="font-bold text-gray-900">{formatMontant(facture.montant_total)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-green-600">
                                        <span>Payé:</span>
                                        <span className="font-bold">{formatMontant(facture.montant_paye)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-red-600">
                                        <span>Reste:</span>
                                        <span className="font-bold">{formatMontant(facture.montant_restant)}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Progression</span>
                                        <span>
                                            {Math.round((facture.montant_paye / facture.montant_total) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.round((facture.montant_paye / facture.montant_total) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Services de la facture */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Services ({facture.details?.length || 0})</h3>
                            <div className="space-y-3">
                                {facture.details?.slice(0, 3).map((service) => (
                                    <div key={service.id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 truncate">{service.service_nom}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(service.statut)}`}>
                                            {getStatutLabel(service.statut)}
                                        </span>
                                    </div>
                                ))}
                                {facture.details?.length > 3 && (
                                    <div className="text-center pt-2 border-t border-gray-200">
                                        <span className="text-sm text-gray-500">
                                            +{facture.details.length - 3} autre(s) service(s)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Create;