import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Edit = ({ service }) => {
    const { data, setData, put, processing, errors } = useForm({
        nom: service.nom || '',
        code: service.code || '',
        montant: service.montant || '',
        montant_a_payer: service.montant_a_payer || '',
        obligatoire: service.obligatoire ?? true,
        description: service.description || '',
        actif: service.actif ?? true
    });

    const [autoGenerateCode, setAutoGenerateCode] = useState(!service.code);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/services/${service.id}`);
    };

    const handleNomChange = (value) => {
        setData('nom', value);
        if (autoGenerateCode && value) {
            const generatedCode = value
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^A-Z0-9]/g, '_');
            setData('code', generatedCode);
        }
    };

    const toggleCodeGeneration = (checked) => {
        setAutoGenerateCode(checked);
        if (checked && data.nom) {
            const generatedCode = data.nom
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^A-Z0-9]/g, '_');
            setData('code', generatedCode);
        } else if (!checked && !service.code) {
            setData('code', '');
        }
    };

    // Synchroniser l'état initial
    useEffect(() => {
        if (service.code) {
            setAutoGenerateCode(false);
        }
    }, [service.code]);

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(montant);
    };

    return (
        <AppLayout>
            <Head title={`Modifier le service - ${service.nom}`} />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier le Service
                            </h1>
                            <p className="text-emerald-100 mt-2 text-lg">
                                {service.nom}
                            </p>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Édition</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations de base */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Informations du Service
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-6">
                            {/* Nom du service */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom du service *
                                </label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => handleNomChange(e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                                    } focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: Scolarité, Transport, Cantine..."
                                />
                                {errors.nom && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.nom}</span>
                                    </div>
                                )}
                            </div>

                            {/* Code du service */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Code du service
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="autoGenerateCode"
                                            checked={autoGenerateCode}
                                            onChange={(e) => toggleCodeGeneration(e.target.checked)}
                                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <label htmlFor="autoGenerateCode" className="text-sm text-gray-600">
                                            Générer automatiquement
                                        </label>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    disabled={autoGenerateCode}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.code ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                                    } focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white ${
                                        autoGenerateCode ? 'bg-gray-50 text-gray-500' : ''
                                    }`}
                                    placeholder="Ex: SCOL_MENS, TRANS, CANTINE"
                                />
                                {errors.code && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.code}</span>
                                    </div>
                                )}
                                <p className="text-sm text-gray-500 mt-2">
                                    Code unique pour identifier le service dans le système
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white resize-none"
                                    placeholder="Description détaillée du service..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Configuration financière */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            Configuration Financière
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Montant principal */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Montant du service (FCFA) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.montant}
                                    onChange={(e) => setData('montant', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.montant ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                                    } focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white`}
                                    placeholder="0.00"
                                />
                                {errors.montant && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.montant}</span>
                                    </div>
                                )}
                            </div>

                            {/* Montant à payer */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Montant à payer (FCFA)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.montant_a_payer}
                                    onChange={(e) => setData('montant_a_payer', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white"
                                    placeholder="0.00 (optionnel)"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Pour les frais de dossier ou acomptes
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Options du service */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Options du Service
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Obligatoire */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Service obligatoire
                                    </label>
                                    <p className="text-sm text-gray-600">
                                        Ce service doit être payé par tous les élèves
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.obligatoire}
                                        onChange={(e) => setData('obligatoire', e.target.checked)}
                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-6 w-6"
                                    />
                                </div>
                            </div>

                            {/* Actif */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Service actif
                                    </label>
                                    <p className="text-sm text-gray-600">
                                        Ce service est disponible pour les inscriptions
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.actif}
                                        onChange={(e) => setData('actif', e.target.checked)}
                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-6 w-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informations de suivi */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Informations de suivi
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-blue-700">ID du service :</span>
                                <span className="ml-2 text-blue-900 font-mono">{service.uid}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700">Créé le :</span>
                                <span className="ml-2 text-blue-900">
                                    {new Date(service.created_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700">Dernière modification :</span>
                                <span className="ml-2 text-blue-900">
                                    {new Date(service.updated_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700">Statut actuel :</span>
                                <span className={`ml-2 font-medium ${
                                    service.actif ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {service.actif ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/services"
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Annuler
                        </Link>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Link
                                href={`/services`}
                                className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                            >
                                Retour à la liste
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl hover:from-emerald-700 hover:to-teal-800 focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="font-semibold">Mise à jour...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-semibold">Mettre à jour</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;