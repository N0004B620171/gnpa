import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Edit = ({ itineraire, buses, services }) => {
    const { data, setData, put, processing, errors } = useForm({
        nom: itineraire.nom || '',
        bus_id: itineraire.bus_id || '',
        service_id: itineraire.service_id || ''
    });

    const [selectedBus, setSelectedBus] = useState(itineraire.bus || null);
    const [selectedService, setSelectedService] = useState(itineraire.service || null);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/itineraires-transports/${itineraire.id}`);
    };

    const handleBusChange = (busId) => {
        setData('bus_id', busId);
        const bus = buses.find(b => b.id == busId);
        setSelectedBus(bus);
    };

    const handleServiceChange = (serviceId) => {
        setData('service_id', serviceId);
        const service = services.find(s => s.id == serviceId);
        setSelectedService(service);
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(montant);
    };

    return (
        <AppLayout>
            <Head title={`Modifier l'Itinéraire - ${itineraire.nom}`} />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier l'Itinéraire
                            </h1>
                            <p className="text-violet-100 mt-2 text-lg">
                                {itineraire.nom}
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Informations de l'Itinéraire
                        </h3>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Nom de l'itinéraire *
                            </label>
                            <input
                                type="text"
                                value={data.nom}
                                onChange={(e) => setData('nom', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-violet-500'
                                } focus:ring-4 focus:ring-violet-500/20 transition-all duration-200 bg-white`}
                                placeholder="Ex: Ligne Thiaroye – École, Ligne Pikine – Campus..."
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
                    </div>

                    {/* Sélection du bus */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Bus Assigné
                        </h3>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Sélectionnez un bus (optionnel)
                            </label>
                            <select
                                value={data.bus_id}
                                onChange={(e) => handleBusChange(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 transition-all duration-200 bg-white"
                            >
                                <option value="">Aucun bus assigné</option>
                                {buses.map((bus) => (
                                    <option key={bus.id} value={bus.id}>
                                        {bus.immatriculation}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Informations du bus sélectionné */}
                        {selectedBus && (
                            <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-blue-900">
                                            Bus {selectedBus.immatriculation}
                                        </div>
                                        <div className="text-sm text-blue-700">
                                            Actuellement assigné à cet itinéraire
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sélection du service */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Service Associé
                        </h3>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Sélectionnez un service (optionnel)
                            </label>
                            <select
                                value={data.service_id}
                                onChange={(e) => handleServiceChange(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 transition-all duration-200 bg-white"
                            >
                                <option value="">Aucun service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.nom} ({service.code}) - {formatMontant(service.montant)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Informations du service sélectionné */}
                        {selectedService && (
                            <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-medium text-green-900">
                                                {selectedService.nom}
                                            </div>
                                            <div className="text-sm text-green-700">
                                                {selectedService.code} • {formatMontant(selectedService.montant)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-green-900">
                                        {formatMontant(selectedService.montant)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Informations de suivi */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Informations de suivi
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-blue-700">ID de l'itinéraire :</span>
                                <span className="ml-2 text-blue-900 font-mono">{itineraire.uid}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700">Créé le :</span>
                                <span className="ml-2 text-blue-900">
                                    {new Date(itineraire.created_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700">Dernière modification :</span>
                                <span className="ml-2 text-blue-900">
                                    {new Date(itineraire.updated_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700">Nombre d'arrêts :</span>
                                <span className="ml-2 text-blue-900">
                                    {itineraire.arrets?.length || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/itineraires-transports"
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Annuler
                        </Link>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Link
                                href={`/itineraires-transports`}
                                className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                            >
                                Retour à la liste
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl hover:from-violet-700 hover:to-purple-800 focus:ring-4 focus:ring-violet-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
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