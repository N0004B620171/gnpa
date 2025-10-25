import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Edit = ({ professeur }) => {
    const { errors } = usePage().props;
    const { data, setData, put, processing } = useForm({
        prenom: professeur.prenom,
        nom: professeur.nom,
        email: professeur.email,
        telephone: professeur.telephone || '',
        specialite: professeur.specialite || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/professeurs/${professeur.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Modifier ${professeur.prenom} ${professeur.nom}`} />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier le professeur
                            </h1>
                            <p className="text-indigo-100 mt-2 text-lg">
                                Mettez à jour les informations de {professeur.prenom} {professeur.nom}
                            </p>
                        </div>

                        {/* Badge statut */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Édition</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations personnelles */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.prenom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                        } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
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
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                        } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
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

                    {/* Contact + Spécialité */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact & Spécialité
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Email *</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Téléphone</label>
                                <input
                                    type="tel"
                                    value={data.telephone}
                                    onChange={(e) => setData('telephone', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.telephone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                />
                                {errors.telephone && <p className="mt-2 text-sm text-red-600">{errors.telephone}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Domaine de spécialisation
                                </label>
                                <input
                                    type="text"
                                    value={data.specialite}
                                    onChange={(e) => setData('specialite', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.specialite ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                        } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: Mathématiques, Français..."
                                    maxLength={255}
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
                        </div>
                    </div>

                    {/* Aperçu */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                        <h4 className="text-sm font-semibold text-indigo-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Aperçu des modifications
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-indigo-700">Nom complet :</span>
                                <span className="ml-2 text-indigo-900">{data.prenom} {data.nom}</span>
                            </div>
                            <div>
                                <span className="font-medium text-indigo-700">Téléphone :</span>
                                <span className="ml-2 text-indigo-900">
                                    {data.telephone || <span className="text-orange-500">Non renseigné</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-indigo-700">Email :</span>
                                <span className="ml-2 text-indigo-900">{data.email}</span>
                            </div>
                            <div>
                                <span className="font-medium text-indigo-700">Spécialité :</span>
                                <span className="ml-2 text-indigo-900">
                                    {data.specialite || <span className="text-orange-500">Non spécifiée</span>}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-indigo-700">Compte utilisateur :</span>
                                <span className="ml-2 text-indigo-900">
                                    {professeur.user ?
                                        <span className="text-green-600">✅ Activé</span> :
                                        <span className="text-gray-500">❌ Non créé</span>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href={`/professeurs/${professeur.id}`}
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour aux détails
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="font-semibold">Mise à jour...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-semibold">Mettre à jour</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;