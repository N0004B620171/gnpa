import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        immatriculation: '',
        marque: '',
        modele: '',
        capacite: 50,
        chauffeur_nom: '',
        chauffeur_telephone: '',
        etat: 'actif'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/buses');
    };

    return (
        <AppLayout>
            <Head title="Nouveau Bus" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouveau Bus
                            </h1>
                            <p className="text-amber-100 mt-2 text-lg">
                                Ajouter un nouveau bus au parc automobile
                            </p>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations du véhicule */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Informations du Véhicule
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Immatriculation */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Immatriculation *
                                </label>
                                <input
                                    type="text"
                                    value={data.immatriculation}
                                    onChange={(e) => setData('immatriculation', e.target.value.toUpperCase())}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.immatriculation ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500'
                                        } focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white font-mono`}
                                    placeholder="Ex: AB-123-CD"
                                />
                                {errors.immatriculation && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.immatriculation}</span>
                                    </div>
                                )}
                            </div>

                            {/* Capacité */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Capacité (places) *
                                </label>
                                <input
                                    type="number"
                                    min="10"
                                    max="200"
                                    value={data.capacite}
                                    onChange={(e) => setData('capacite', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.capacite ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500'
                                        } focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white`}
                                />
                                {errors.capacite && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.capacite}</span>
                                    </div>
                                )}
                                <p className="text-sm text-gray-500 mt-2">Entre 10 et 200 places</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Marque */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Marque
                                </label>
                                <input
                                    type="text"
                                    value={data.marque}
                                    onChange={(e) => setData('marque', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white"
                                    placeholder="Ex: Mercedes, Toyota..."
                                />
                            </div>

                            {/* Modèle */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Modèle
                                </label>
                                <input
                                    type="text"
                                    value={data.modele}
                                    onChange={(e) => setData('modele', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white"
                                    placeholder="Ex: Sprinter, Coaster..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informations du chauffeur */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Informations du Chauffeur
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nom du chauffeur */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom du chauffeur *
                                </label>
                                <input
                                    type="text"
                                    value={data.chauffeur_nom}
                                    onChange={(e) => setData('chauffeur_nom', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.chauffeur_nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500'
                                        } focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: Jean Dupont"
                                />
                                {errors.chauffeur_nom && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.chauffeur_nom}</span>
                                    </div>
                                )}
                            </div>

                            {/* Téléphone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    value={data.chauffeur_telephone}
                                    onChange={(e) => setData('chauffeur_telephone', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white"
                                    placeholder="Ex: +221 77 123 45 67"
                                />
                            </div>
                        </div>
                    </div>

                    {/* État du bus */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            État du Bus
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-amber-300 transition-all duration-200">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Actif</div>
                                        <div className="text-sm text-gray-600">En service</div>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="etat"
                                    value="actif"
                                    checked={data.etat === 'actif'}
                                    onChange={(e) => setData('etat', e.target.value)}
                                    className="text-amber-600 focus:ring-amber-500"
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-amber-300 transition-all duration-200">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Maintenance</div>
                                        <div className="text-sm text-gray-600">En réparation</div>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="etat"
                                    value="maintenance"
                                    checked={data.etat === 'maintenance'}
                                    onChange={(e) => setData('etat', e.target.value)}
                                    className="text-amber-600 focus:ring-amber-500"
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-amber-300 transition-all duration-200">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Hors Service</div>
                                        <div className="text-sm text-gray-600">Indisponible</div>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="etat"
                                    value="hors_service"
                                    checked={data.etat === 'hors_service'}
                                    onChange={(e) => setData('etat', e.target.value)}
                                    className="text-amber-600 focus:ring-amber-500"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Aperçu */}
                    {(data.immatriculation || data.chauffeur_nom) && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                            <h4 className="text-sm font-semibold text-amber-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu du Bus
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-amber-700">Immatriculation :</span>
                                    <span className="ml-2 text-amber-900 font-mono">
                                        {data.immatriculation || <span className="text-orange-500">Non renseignée</span>}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-amber-700">Chauffeur :</span>
                                    <span className="ml-2 text-amber-900">
                                        {data.chauffeur_nom || <span className="text-orange-500">Non renseigné</span>}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-amber-700">Véhicule :</span>
                                    <span className="ml-2 text-amber-900">
                                        {data.marque && data.modele
                                            ? `${data.marque} ${data.modele}`
                                            : <span className="text-orange-500">Non spécifié</span>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-amber-700">Capacité :</span>
                                    <span className="ml-2 text-amber-900 font-bold">
                                        {data.capacite} places
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-amber-700">État :</span>
                                    <span className={`ml-2 font-medium ${data.etat === 'actif' ? 'text-green-600' :
                                            data.etat === 'maintenance' ? 'text-orange-600' : 'text-red-600'
                                        }`}>
                                        {data.etat === 'actif' ? 'Actif' :
                                            data.etat === 'maintenance' ? 'En Maintenance' : 'Hors Service'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/buses"
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à la liste
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-xl hover:from-amber-700 hover:to-orange-800 focus:ring-4 focus:ring-amber-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="font-semibold">Création...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-semibold">Créer le bus</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Create;