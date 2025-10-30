import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Create = ({ classes, materiels }) => {
    const { data, setData, post, processing, errors } = useForm({
        classe_id: '',
        materiel_id: '',
        quantite: 1,
        etat: 'bon',
        observation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/inventaires-classes');
    };

    return (
        <AppLayout>
            <Head title="Nouvel Inventaire de Classe" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvel Inventaire
                            </h1>
                            <p className="text-indigo-100 mt-2 text-lg">
                                Attribuer du matériel à une classe
                            </p>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Sélection de la classe et du matériel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                        errors.classe_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                    } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Matériel
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Matériel *
                                </label>
                                <select
                                    value={data.materiel_id}
                                    onChange={(e) => setData('materiel_id', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.materiel_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                    } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                >
                                    <option value="">Sélectionnez un matériel</option>
                                    {materiels.map((materiel) => (
                                        <option key={materiel.id} value={materiel.id}>
                                            {materiel.nom}
                                        </option>
                                    ))}
                                </select>
                                {errors.materiel_id && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.materiel_id}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quantité et État */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Quantité
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Quantité *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.quantite}
                                    onChange={(e) => setData('quantite', parseInt(e.target.value))}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.quantite ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                    } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                />
                                {errors.quantite && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.quantite}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                État
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    État du matériel *
                                </label>
                                <select
                                    value={data.etat}
                                    onChange={(e) => setData('etat', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white"
                                >
                                    <option value="bon">Bon état</option>
                                    <option value="endommagé">Endommagé</option>
                                    <option value="perdu">Perdu</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Observation */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Observation
                        </h3>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Notes supplémentaires
                            </label>
                            <textarea
                                value={data.observation}
                                onChange={(e) => setData('observation', e.target.value)}
                                rows={4}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.observation ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white resize-none`}
                                placeholder="Décrivez l'état du matériel, des remarques particulières..."
                            />
                            {errors.observation && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.observation}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Aperçu */}
                    {(data.classe_id || data.materiel_id) && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                            <h4 className="text-sm font-semibold text-indigo-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu de l'inventaire
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-indigo-700">Classe :</span>
                                    <span className="ml-2 text-indigo-900">
                                        {data.classe_id ? 
                                            classes.find(c => c.id == data.classe_id)?.nom + ' - ' +
                                            classes.find(c => c.id == data.classe_id)?.niveau?.nom
                                            : <span className="text-orange-500">Non sélectionnée</span>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-indigo-700">Matériel :</span>
                                    <span className="ml-2 text-indigo-900">
                                        {data.materiel_id ? 
                                            materiels.find(m => m.id == data.materiel_id)?.nom
                                            : <span className="text-orange-500">Non sélectionné</span>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-indigo-700">Quantité :</span>
                                    <span className="ml-2 text-indigo-900 font-bold">{data.quantite}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-indigo-700">État :</span>
                                    <span className={`ml-2 font-medium ${
                                        data.etat === 'bon' ? 'text-green-600' : 
                                        data.etat === 'endommagé' ? 'text-orange-600' : 'text-red-600'
                                    }`}>
                                        {data.etat === 'bon' ? 'Bon état' : 
                                         data.etat === 'endommagé' ? 'Endommagé' : 'Perdu'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/inventaires-classes"
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à la liste
                        </Link>

                        <button
                            type="submit"
                            disabled={processing || !data.classe_id || !data.materiel_id}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    <span className="font-semibold">Enregistrer l'inventaire</span>
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