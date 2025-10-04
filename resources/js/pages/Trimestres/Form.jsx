import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';

const TrimestreForm = ({ trimestre, annees, isEdit = false }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        annee_scolaire_id: trimestre?.annee_scolaire_id || '',
        nom: trimestre?.nom || '',
        date_debut: trimestre?.date_debut || '',
        date_fin: trimestre?.date_fin || '',
    });

    const [periodeAnnee, setPeriodeAnnee] = useState(null);

    // Trouver l'année sélectionnée
    const anneeSelectionnee = annees.find(a => a.id == data.annee_scolaire_id);

    // Générer les suggestions de trimestres
    useEffect(() => {
        if (anneeSelectionnee && !isEdit) {
            const suggestions = [
                { nom: '1er Trimestre', debut: `${anneeSelectionnee.date_debut.split('-')[0]}-09-01` },
                { nom: '2ème Trimestre', debut: `${anneeSelectionnee.date_debut.split('-')[0]}-12-01` },
                { nom: '3ème Trimestre', debut: `${anneeSelectionnee.date_fin.split('-')[0]}-03-01` },
            ];

            setPeriodeAnnee(suggestions);
        }
    }, [anneeSelectionnee, isEdit]);

    function handleSubmit(e) {
        e.preventDefault();
        if (isEdit) {
            put(route('trimestres.update', trimestre.id));
        } else {
            post(route('trimestres.store'));
        }
    }

    // Calculer la durée
    const duree = data.date_debut && data.date_fin
        ? Math.ceil((new Date(data.date_fin) - new Date(data.date_debut)) / (1000 * 60 * 60 * 24))
        : 0;

    // Vérifier si les dates sont dans l'année scolaire
    const datesValides = anneeSelectionnee && data.date_debut && data.date_fin
        ? new Date(data.date_debut) >= new Date(anneeSelectionnee.date_debut) &&
        new Date(data.date_fin) <= new Date(anneeSelectionnee.date_fin)
        : true;

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-8 text-white">
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
                            {isEdit ? `Modifier le trimestre` : 'Créer un nouveau trimestre'}
                        </h1>
                        <p className="text-teal-100 mt-2 text-lg">
                            {isEdit
                                ? `Modifiez les informations du trimestre "${trimestre.nom}"`
                                : 'Définissez une nouvelle période trimestrielle'
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
                {/* Année scolaire */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Année scolaire *
                    </label>
                    <div className="relative">
                        <select
                            value={data.annee_scolaire_id}
                            onChange={(e) => setData('annee_scolaire_id', e.target.value)}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.annee_scolaire_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'
                                } focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 bg-white appearance-none`}
                        >
                            <option value="">Sélectionnez une année scolaire</option>
                            {annees.map((annee) => (
                                <option key={annee.id} value={annee.id}>
                                    {annee.nom} • Du {new Date(annee.date_debut).toLocaleDateString('fr-FR')} au {new Date(annee.date_fin).toLocaleDateString('fr-FR')}
                                    {annee.actif && ' (Active)'}
                                </option>
                            ))}
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </div>
                    {errors.annee_scolaire_id && (
                        <div className="flex items-center mt-2 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{errors.annee_scolaire_id}</span>
                        </div>
                    )}
                </div>

                {/* Nom du trimestre */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Nom du trimestre *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'
                                } focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 bg-white text-lg font-medium`}
                            placeholder="Ex: 1er Trimestre, 2ème Trimestre..."
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

                    {/* Suggestions de trimestres */}
                    {periodeAnnee && !isEdit && (
                        <div className="mt-3 grid grid-cols-1 gap-2">
                            <p className="text-sm text-gray-600 mb-2">Suggestions :</p>
                            {periodeAnnee.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        setData('nom', suggestion.nom);
                                        setData('date_debut', suggestion.debut);
                                    }}
                                    className="text-left p-3 bg-teal-50 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors"
                                >
                                    <div className="text-sm font-medium text-teal-800">{suggestion.nom}</div>
                                    <div className="text-xs text-teal-600">Début: {new Date(suggestion.debut).toLocaleDateString('fr-FR')}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Période */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Période du trimestre
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
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.date_debut ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'
                                    } focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 bg-white`}
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
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.date_fin ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'
                                    } focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 bg-white`}
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

                    {/* Validation des dates */}
                    {anneeSelectionnee && data.date_debut && data.date_fin && !datesValides && (
                        <div className="mt-3 bg-red-50 rounded-lg p-3 border border-red-200">
                            <div className="flex items-center text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium">
                                    Les dates doivent être comprises dans l'année scolaire sélectionnée
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Indicateur de durée */}
                    {duree > 0 && (
                        <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-blue-700 font-medium">Durée totale:</span>
                                <span className="text-blue-900 font-semibold">{duree} jours</span>
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                                Soit environ {Math.floor(duree / 7)} semaines
                            </div>
                        </div>
                    )}
                </div>

                {/* Aperçu */}
                {(data.nom || data.annee_scolaire_id || data.date_debut || data.date_fin) && (
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
                        <h4 className="text-sm font-semibold text-teal-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Aperçu du trimestre
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-teal-700">Nom :</span>
                                <span className="ml-2 text-teal-900">
                                    {data.nom || <span className="text-red-500">Obligatoire</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-teal-700">Année :</span>
                                <span className="ml-2 text-teal-900">
                                    {anneeSelectionnee ? anneeSelectionnee.nom : <span className="text-red-500">Obligatoire</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-teal-700">Début :</span>
                                <span className="ml-2 text-teal-900">
                                    {data.date_debut ? new Date(data.date_debut).toLocaleDateString('fr-FR') : <span className="text-red-500">Obligatoire</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-teal-700">Fin :</span>
                                <span className="ml-2 text-teal-900">
                                    {data.date_fin ? new Date(data.date_fin).toLocaleDateString('fr-FR') : <span className="text-red-500">Obligatoire</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-teal-700">Durée :</span>
                                <span className="ml-2 text-teal-900">
                                    {duree > 0 ? `${duree} jours` : '-'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-teal-700">Validation :</span>
                                <span className="ml-2 text-teal-900">
                                    {datesValides ? (
                                        <span className="text-green-600 font-semibold">✓ Valide</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">✗ Invalide</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                    <Link
                        href={route("trimestres.index")}
                        className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour à la liste
                    </Link>

                    <button
                        type="submit"
                        disabled={processing || !datesValides}
                        className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:from-teal-700 hover:to-cyan-800 focus:ring-4 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    {isEdit ? 'Mettre à jour' : 'Créer le trimestre'}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TrimestreForm;