import React from 'react';
import { useForm, Link } from '@inertiajs/react';

const ProfesseurForm = ({ professeur, isEdit = false }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        prenom: professeur?.prenom || '',
        nom: professeur?.nom || '',
        telephone: professeur?.telephone || '',
        email: professeur?.email || '',
        specialite: professeur?.specialite || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (isEdit) {
            put(route('professeurs.update', professeur.id));
        } else {
            post(route('professeurs.store'));
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-red-600 to-orange-700 p-8 text-white">
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
                            {isEdit ? `Modifier le professeur` : 'Créer un nouveau professeur'}
                        </h1>
                        <p className="text-red-100 mt-2 text-lg">
                            {isEdit 
                                ? `Modifiez les informations de ${professeur.prenom} ${professeur.nom}`
                                : 'Ajoutez un nouveau membre du corps professoral'
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
                {/* Informations personnelles */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Informations personnelles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Prénom *
                            </label>
                            <input
                                type="text"
                                value={data.prenom}
                                onChange={(e) => setData('prenom', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.prenom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-red-500'
                                } focus:ring-4 focus:ring-red-500/20 transition-all duration-200 bg-white`}
                                placeholder="Entrez le prénom"
                            />
                            {errors.prenom && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.prenom}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Nom *
                            </label>
                            <input
                                type="text"
                                value={data.nom}
                                onChange={(e) => setData('nom', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-red-500'
                                } focus:ring-4 focus:ring-red-500/20 transition-all duration-200 bg-white`}
                                placeholder="Entrez le nom"
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
                </div>

                {/* Informations professionnelles */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Informations professionnelles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Spécialité
                            </label>
                            <input
                                type="text"
                                value={data.specialite}
                                onChange={(e) => setData('specialite', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.specialite ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-red-500'
                                } focus:ring-4 focus:ring-red-500/20 transition-all duration-200 bg-white`}
                                placeholder="Ex: Mathématiques, Physique, Français..."
                            />
                            {errors.specialite && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.specialite}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                value={data.telephone}
                                onChange={(e) => setData('telephone', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.telephone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-red-500'
                                } focus:ring-4 focus:ring-red-500/20 transition-all duration-200 bg-white`}
                                placeholder="Ex: +33 1 23 45 67 89"
                            />
                            {errors.telephone && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.telephone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informations de connexion */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Informations de connexion
                    </h3>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-red-500'
                            } focus:ring-4 focus:ring-red-500/20 transition-all duration-200 bg-white`}
                            placeholder="exemple@email.com"
                        />
                        {errors.email && (
                            <div className="flex items-center mt-2 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{errors.email}</span>
                            </div>
                        )}
                        {!isEdit && (
                            <div className="text-xs text-gray-500 mt-2">
                                Un compte utilisateur sera automatiquement créé avec le mot de passe par défaut "password123"
                            </div>
                        )}
                    </div>
                </div>

                {/* Aperçu */}
                {(data.prenom || data.nom || data.email || data.specialite) && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                        <h4 className="text-sm font-semibold text-red-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Aperçu du professeur
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-red-700">Nom complet :</span>
                                <span className="ml-2 text-red-900">
                                    {data.prenom && data.nom ? `${data.prenom} ${data.nom}` : <span className="text-red-500">Incomplet</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-red-700">Email :</span>
                                <span className="ml-2 text-red-900">
                                    {data.email || <span className="text-red-500">Obligatoire</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-red-700">Spécialité :</span>
                                <span className="ml-2 text-red-900">
                                    {data.specialite || <span className="text-orange-500">Non renseignée</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-red-700">Téléphone :</span>
                                <span className="ml-2 text-red-900">
                                    {data.telephone || <span className="text-orange-500">Non renseigné</span>}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                    <Link
                        href={route("professeurs.index")}
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
                        className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-red-600 to-orange-700 text-white rounded-xl hover:from-red-700 hover:to-orange-800 focus:ring-4 focus:ring-red-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    {isEdit ? 'Mettre à jour' : 'Créer le professeur'}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfesseurForm;