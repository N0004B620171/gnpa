import React from 'react';
import { useForm, Link } from '@inertiajs/react';

const InscriptionForm = ({ inscription, isEdit = false, classes = [], eleves = [], annees = [], annee_active }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        eleve_id: inscription?.eleve_id || '',
        classe_id: inscription?.classe_id || '',
        annee_scolaire_id: inscription?.annee_scolaire_id || annee_active?.id || '',
        date_inscription: inscription?.date_inscription || new Date().toISOString().split('T')[0],
        statut: inscription?.statut || 'actif',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('inscriptions.update', inscription.id));
        } else {
            post(route('inscriptions.store'));
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isEdit ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                )}
                            </svg>
                            {isEdit ? `Modifier l'inscription` : 'Nouvelle inscription'}
                        </h1>
                        <p className="text-blue-100 mt-2 text-lg">
                            {isEdit 
                                ? `Modifiez les informations de l'inscription`
                                : 'Inscrire un élève dans une classe'
                            }
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Sélection de l'élève */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Élève *
                    </label>
                    <select
                        value={data.eleve_id}
                        onChange={(e) => setData('eleve_id', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                            errors.eleve_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                    >
                        <option value="">Sélectionner un élève</option>
                        {eleves.map(eleve => (
                            <option key={eleve.id} value={eleve.id}>
                                {eleve.prenom} {eleve.nom} {eleve.email ? `- ${eleve.email}` : ''}
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

                {/* Sélection de la classe et année */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Classe *
                        </label>
                        <select
                            value={data.classe_id}
                            onChange={(e) => setData('classe_id', e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border-2 ${
                                errors.classe_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                            } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                        >
                            <option value="">Sélectionner une classe</option>
                            {classes.map(classe => (
                                <option key={classe.id} value={classe.id}>
                                    {classe.nom}
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

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Année Scolaire *
                        </label>
                        <select
                            value={data.annee_scolaire_id}
                            onChange={(e) => setData('annee_scolaire_id', e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border-2 ${
                                errors.annee_scolaire_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                            } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                        >
                            <option value="">Sélectionner une année</option>
                            {annees.map(annee => (
                                <option key={annee.id} value={annee.id}>
                                    {annee.nom} {annee.id === annee_active?.id ? '(Active)' : ''}
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

                {/* Date d'inscription et statut */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Date d'inscription *
                        </label>
                        <input
                            type="date"
                            value={data.date_inscription}
                            onChange={(e) => setData('date_inscription', e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border-2 ${
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

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Statut *
                        </label>
                        <select
                            value={data.statut}
                            onChange={(e) => setData('statut', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                        >
                            <option value="actif">Actif</option>
                            <option value="inactif">Inactif</option>
                        </select>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                    <Link
                        href={route("inscriptions.index")}
                        className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour à la liste
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    {isEdit ? 'Mettre à jour' : 'Créer l\'inscription'}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InscriptionForm;