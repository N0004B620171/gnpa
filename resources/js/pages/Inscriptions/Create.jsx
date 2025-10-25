import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Create = ({ eleves, classes, anneesScolaires }) => {
    const { data, setData, post, processing, errors } = useForm({
        eleve_id: '',
        classe_id: '',
        annee_scolaire_id: '',
        date_inscription: new Date().toISOString().split('T')[0],
        statut: 'actif'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/inscriptions');
    };

    return (
        <AppLayout>
            <Head title="Nouvelle Inscription" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvelle Inscription
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Inscrire un élève dans une classe
                            </p>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Sélection de l'élève */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Élève
                        </h3>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Élève *
                            </label>
                            <select
                                value={data.eleve_id}
                                onChange={(e) => setData('eleve_id', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.eleve_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                            >
                                <option value="">Sélectionnez un élève</option>
                                {eleves.map((eleve) => (
                                    <option key={eleve.id} value={eleve.id}>
                                        {eleve.prenom} {eleve.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.eleve_id && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.eleve_id}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sélection de la classe et année scolaire */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Classe
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Classe *
                                </label>
                                <select
                                    value={data.classe_id}
                                    onChange={(e) => setData('classe_id', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.classe_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                >
                                    <option value="">Sélectionnez une classe</option>
                                    {classes.map((classe) => (
                                        <option key={classe.id} value={classe.id}>
                                            {classe.nom} - {classe.niveau?.nom}
                                        </option>
                                    ))}
                                </select>
                                {errors.classe_id && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.classe_id}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Année Scolaire
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Année Scolaire *
                                </label>
                                <select
                                    value={data.annee_scolaire_id}
                                    onChange={(e) => setData('annee_scolaire_id', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.annee_scolaire_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                >
                                    <option value="">Sélectionnez une année scolaire</option>
                                    {anneesScolaires.map((annee) => (
                                        <option key={annee.id} value={annee.id}>
                                            {annee.nom}
                                        </option>
                                    ))}
                                </select>
                                {errors.annee_scolaire_id && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.annee_scolaire_id}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Date et statut */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Date d'Inscription
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={data.date_inscription}
                                    onChange={(e) => setData('date_inscription', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.date_inscription ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                />
                                {errors.date_inscription && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.date_inscription}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Statut
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Statut de l'inscription
                                </label>
                                <select
                                    value={data.statut}
                                    onChange={(e) => setData('statut', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                >
                                    <option value="actif">Actif</option>
                                    <option value="inactif">Inactif</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Aperçu */}
                    {(data.eleve_id || data.classe_id || data.annee_scolaire_id) && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu de l'inscription
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-blue-700">Élève :</span>
                                    <span className="ml-2 text-blue-900">
                                        {data.eleve_id ? 
                                            eleves.find(e => e.id == data.eleve_id)?.prenom + ' ' + 
                                            eleves.find(e => e.id == data.eleve_id)?.nom
                                            : <span className="text-orange-500">Non sélectionné</span>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-700">Classe :</span>
                                    <span className="ml-2 text-blue-900">
                                        {data.classe_id ? 
                                            classes.find(c => c.id == data.classe_id)?.nom
                                            : <span className="text-orange-500">Non sélectionnée</span>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-700">Année scolaire :</span>
                                    <span className="ml-2 text-blue-900">
                                        {data.annee_scolaire_id ? 
                                            anneesScolaires.find(a => a.id == data.annee_scolaire_id)?.nom
                                            : <span className="text-orange-500">Non sélectionnée</span>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-700">Statut :</span>
                                    <span className={`ml-2 font-medium ${
                                        data.statut === 'actif' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {data.statut === 'actif' ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/inscriptions"
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
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    <span className="font-semibold">Enregistrer l'inscription</span>
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