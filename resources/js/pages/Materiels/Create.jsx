import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        reference: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/materiels');
    };

    return (
        <AppLayout>
            <Head title="Nouveau Matériel" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-orange-600 to-amber-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouveau Matériel
                            </h1>
                            <p className="text-orange-100 mt-2 text-lg">
                                Ajouter un nouveau matériel à l'inventaire
                            </p>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Nom du matériel */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Informations du Matériel
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom du matériel *
                                </label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                    } focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: Tableau blanc, Ordinateur portable, Chaise de bureau..."
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

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Référence
                                </label>
                                <input
                                    type="text"
                                    value={data.reference}
                                    onChange={(e) => setData('reference', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.reference ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                    } focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: TB-001, DELL-XPS13, CH-BUREAU..."
                                />
                                {errors.reference && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.reference}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                    } focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 bg-white resize-none`}
                                    placeholder="Décrivez le matériel, ses caractéristiques, son état..."
                                />
                                {errors.description && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.description}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Aperçu */}
                    {(data.nom || data.reference || data.description) && (
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                            <h4 className="text-sm font-semibold text-orange-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu du matériel
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="font-medium text-orange-700">Nom :</span>
                                    <span className="ml-2 text-orange-900">
                                        {data.nom || <span className="text-orange-500">Non renseigné</span>}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-orange-700">Référence :</span>
                                    <span className="ml-2 text-orange-900">
                                        {data.reference || <span className="text-orange-500">Non renseignée</span>}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-orange-700">Description :</span>
                                    <span className="ml-2 text-orange-900">
                                        {data.description || <span className="text-orange-500">Aucune description</span>}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/materiels"
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à la liste
                        </Link>

                        <button
                            type="submit"
                            disabled={processing || !data.nom}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-700 text-white rounded-xl hover:from-orange-700 hover:to-amber-800 focus:ring-4 focus:ring-orange-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    <span className="font-semibold">Enregistrer le matériel</span>
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