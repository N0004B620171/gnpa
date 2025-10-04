import React from 'react';
import { useForm, Link } from '@inertiajs/react';

const ClasseForm = ({ classe, niveaux, professeurs, isEdit = false }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        nom: classe?.nom || '',
        niveau_id: classe?.niveau_id || '',
        professeur_id: classe?.professeur_id || ''
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (isEdit) {
            put(route('classes.update', classe.id));
        } else {
            post(route('classes.store'));
        }
    }

    // Trouver le niveau sélectionné
    const selectedNiveau = niveaux.find(n => n.id == data.niveau_id);
    const selectedProfesseur = professeurs.find(p => p.id == data.professeur_id);

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white">
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
                            {isEdit ? `Modifier la classe` : 'Créer une nouvelle classe'}
                        </h1>
                        <p className="text-green-100 mt-2 text-lg">
                            {isEdit 
                                ? `Modifiez les informations de la classe "${classe.nom}"`
                                : 'Définissez une nouvelle classe académique'
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
                {/* Grille des champs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Nom de la classe */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Nom de la classe *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={data.nom}
                                onChange={(e) => setData('nom', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                                } focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white text-lg font-medium`}
                                placeholder="Ex: 6A, Tle C, CP1..."
                                maxLength={10}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
                        <div className="text-xs text-gray-500 mt-1">
                            Maximum 10 caractères
                        </div>
                    </div>

                    {/* Sélection du niveau */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Niveau *
                        </label>
                        <div className="relative">
                            <select
                                value={data.niveau_id}
                                onChange={(e) => setData('niveau_id', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.niveau_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                                } focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white appearance-none`}
                            >
                                <option value="">Sélectionnez un niveau</option>
                                {niveaux.map((niveau) => (
                                    <option key={niveau.id} value={niveau.id}>
                                        {niveau.nom} - {niveau.cycle?.nom}
                                    </option>
                                ))}
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                        {errors.niveau_id && (
                            <div className="flex items-center mt-2 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{errors.niveau_id}</span>
                            </div>
                        )}
                    </div>

                    {/* Sélection du professeur */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Professeur principal
                        </label>
                        <div className="relative">
                            <select
                                value={data.professeur_id}
                                onChange={(e) => setData('professeur_id', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.professeur_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                                } focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white appearance-none`}
                            >
                                <option value="">Aucun professeur</option>
                                {professeurs.map((professeur) => (
                                    <option key={professeur.id} value={professeur.id}>
                                        {professeur.prenom} {professeur.nom}
                                    </option>
                                ))}
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                        {errors.professeur_id && (
                            <div className="flex items-center mt-2 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{errors.professeur_id}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Aperçu */}
                {(data.nom || data.niveau_id || data.professeur_id) && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                        <h4 className="text-sm font-semibold text-green-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Aperçu de la classe
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-green-700">Classe :</span>
                                <span className="ml-2 text-green-900">
                                    {data.nom || <span className="text-red-500">Non renseigné</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-green-700">Niveau :</span>
                                <span className="ml-2 text-green-900">
                                    {selectedNiveau ? `${selectedNiveau.nom} (${selectedNiveau.cycle?.nom})` : <span className="text-red-500">Non sélectionné</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-green-700">Professeur :</span>
                                <span className="ml-2 text-green-900">
                                    {selectedProfesseur ? `${selectedProfesseur.prenom} ${selectedProfesseur.nom}` : <span className="text-orange-500">Non assigné</span>}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                    <Link
                        href={route("classes.index")}
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
                        className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 focus:ring-4 focus:ring-green-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    {isEdit ? 'Mettre à jour' : 'Créer la classe'}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClasseForm;