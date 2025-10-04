import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';

const AnneeForm = ({ annee, isEdit = false }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        nom: annee?.nom || '',
        date_debut: annee?.date_debut || '',
        date_fin: annee?.date_fin || '',
        actif: annee?.actif || false,
    });

    const [suggestion, setSuggestion] = useState('');

    // Générer une suggestion basée sur la date de début
    useEffect(() => {
        if (data.date_debut) {
            const debut = new Date(data.date_debut);
            const fin = new Date(data.date_debut);
            fin.setFullYear(fin.getFullYear() + 1);
            fin.setDate(fin.getDate() - 1);

            const anneeDebut = debut.getFullYear();
            const anneeFin = fin.getFullYear();
            const suggestionNom = `${anneeDebut}-${anneeFin}`;

            setSuggestion(suggestionNom);

            // Auto-remplir la date de fin si vide
            if (!data.date_fin) {
                setData('date_fin', fin.toISOString().split('T')[0]);
            }
        }
    }, [data.date_debut]);

    function handleSubmit(e) {
        e.preventDefault();
        if (isEdit) {
            put(route('annees.update', annee.id));
        } else {
            post(route('annees.store'));
        }
    }

    // Calculer la durée
    const duree = data.date_debut && data.date_fin 
        ? Math.ceil((new Date(data.date_fin) - new Date(data.date_debut)) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isEdit ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                )}
                            </svg>
                            {isEdit ? `Modifier l'année scolaire` : 'Créer une nouvelle année scolaire'}
                        </h1>
                        <p className="text-amber-100 mt-2 text-lg">
                            {isEdit 
                                ? `Modifiez les informations de l'année "${annee.nom}"`
                                : 'Définissez une nouvelle année académique'
                            }
                        </p>
                    </div>
                    
                    {/* Badge statut */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="text-sm font-medium">
                            {isEdit ? 'Édition' : 'Nouveau'}
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Nom de l'année */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Nom de l'année scolaire *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500'
                            } focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white text-lg font-medium`}
                            placeholder="Ex: 2024-2025"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    {errors.nom && (
                        <div className="flex items-center mt-2 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{errors.nom}</span>
                        </div>
                    )}
                    {suggestion && data.nom !== suggestion && (
                        <div className="flex items-center mt-2 text-amber-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-sm">
                                Suggestion: <button type="button" onClick={() => setData('nom', suggestion)} className="underline font-medium">{suggestion}</button>
                            </span>
                        </div>
                    )}
                </div>

                {/* Période */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Période de l'année scolaire
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Date de début *
                            </label>
                            <input
                                type="date"
                                value={data.date_debut}
                                onChange={(e) => setData('date_debut', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.date_debut ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500'
                                } focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white`}
                            />
                            {errors.date_debut && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.date_debut}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Date de fin *
                            </label>
                            <input
                                type="date"
                                value={data.date_fin}
                                onChange={(e) => setData('date_fin', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.date_fin ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500'
                                } focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 bg-white`}
                            />
                            {errors.date_fin && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.date_fin}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Indicateur de durée */}
                    {duree > 0 && (
                        <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-blue-700 font-medium">Durée totale:</span>
                                <span className="text-blue-900 font-semibold">{duree} jours</span>
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                                Soit environ {Math.floor(duree / 30)} mois
                            </div>
                        </div>
                    )}
                </div>

                {/* Statut */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Statut de l'année
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={data.actif}
                                    onChange={(e) => setData('actif', e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ${
                                    data.actif ? 'bg-green-500' : 'bg-gray-300'
                                }`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ${
                                    data.actif ? 'transform translate-x-6' : ''
                                }`}></div>
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                    Définir comme année scolaire active
                                </div>
                                <div className="text-sm text-gray-600">
                                    {data.actif 
                                        ? "Cette année sera marquée comme active. Les autres années seront automatiquement désactivées."
                                        : "Cette année sera créée comme inactive."
                                    }
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Aperçu */}
                {(data.nom || data.date_debut || data.date_fin) && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                        <h4 className="text-sm font-semibold text-amber-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Aperçu de l'année scolaire
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-amber-700">Nom :</span>
                                <span className="ml-2 text-amber-900">
                                    {data.nom || <span className="text-red-500">Obligatoire</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">Début :</span>
                                <span className="ml-2 text-amber-900">
                                    {data.date_debut ? new Date(data.date_debut).toLocaleDateString('fr-FR') : <span className="text-red-500">Obligatoire</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">Fin :</span>
                                <span className="ml-2 text-amber-900">
                                    {data.date_fin ? new Date(data.date_fin).toLocaleDateString('fr-FR') : <span className="text-red-500">Obligatoire</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">Statut :</span>
                                <span className="ml-2 text-amber-900">
                                    {data.actif ? (
                                        <span className="text-green-600 font-semibold">Active</span>
                                    ) : (
                                        <span className="text-gray-600">Inactive</span>
                                    )}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">Durée :</span>
                                <span className="ml-2 text-amber-900">
                                    {duree > 0 ? `${duree} jours` : '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                    <Link
                        href={route("annees.index")}
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
                                <span className="font-semibold">Enregistrement...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-semibold">
                                    {isEdit ? 'Mettre à jour' : 'Créer l\'année'}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnneeForm;