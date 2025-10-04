import React from 'react';
import { useForm, Link } from '@inertiajs/react';

const ParentEleveForm = ({ parentEleve, isEdit = false }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        prenom: parentEleve?.prenom || '',
        nom: parentEleve?.nom || '',
        telephone: parentEleve?.telephone || '',
        email: parentEleve?.email || '',
        adresse: parentEleve?.adresse || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (isEdit) {
            put(route('parent-eleves.update', parentEleve.id));
        } else {
            post(route('parent-eleves.store'));
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-8 text-white">
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
                            {isEdit ? `Modifier le parent` : 'Créer un nouveau parent'}
                        </h1>
                        <p className="text-purple-100 mt-2 text-lg">
                            {isEdit 
                                ? `Modifiez les informations de ${parentEleve.prenom} ${parentEleve.nom}`
                                : 'Ajoutez un nouveau parent ou tuteur légal'
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                    errors.prenom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                                } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white`}
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
                                    errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                                } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white`}
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

                {/* Informations de contact */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Informations de contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                value={data.telephone}
                                onChange={(e) => setData('telephone', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.telephone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                                } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white`}
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

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                                } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white`}
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
                        </div>
                    </div>
                </div>

                {/* Adresse */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Adresse
                    </h3>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Adresse complète
                        </label>
                        <textarea
                            value={data.adresse}
                            onChange={(e) => setData('adresse', e.target.value)}
                            rows={3}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                errors.adresse ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                            } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white resize-none`}
                            placeholder="Entrez l'adresse complète..."
                            maxLength={500}
                        />
                        {errors.adresse && (
                            <div className="flex items-center mt-2 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{errors.adresse}</span>
                            </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                            {data.adresse.length}/500 caractères
                        </div>
                    </div>
                </div>

                {/* Aperçu */}
                {(data.prenom || data.nom || data.telephone || data.email || data.adresse) && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                        <h4 className="text-sm font-semibold text-purple-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Aperçu du parent
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-purple-700">Nom complet :</span>
                                <span className="ml-2 text-purple-900">
                                    {data.prenom && data.nom ? `${data.prenom} ${data.nom}` : <span className="text-red-500">Incomplet</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-purple-700">Téléphone :</span>
                                <span className="ml-2 text-purple-900">
                                    {data.telephone || <span className="text-orange-500">Non renseigné</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-purple-700">Email :</span>
                                <span className="ml-2 text-purple-900">
                                    {data.email || <span className="text-orange-500">Non renseigné</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-purple-700">Adresse :</span>
                                <span className="ml-2 text-purple-900">
                                    {data.adresse ? (data.adresse.length > 50 ? `${data.adresse.substring(0, 50)}...` : data.adresse) : <span className="text-orange-500">Non renseignée</span>}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                    <Link
                        href={route("parent-eleves.index")}
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
                        className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-xl hover:from-purple-700 hover:to-pink-800 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    {isEdit ? 'Mettre à jour' : 'Créer le parent'}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ParentEleveForm;