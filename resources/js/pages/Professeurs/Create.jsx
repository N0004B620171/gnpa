import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        specialite: '',
        creer_compte: false,
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Préparer les données à envoyer
        const formData = { ...data };

        // Si creer_compte est false, on supprime complètement le champ password
        if (!formData.creer_compte) {
            delete formData.password;
        }

        post('/professeurs', formData);
    };

    const handleCreerCompteChange = (checked) => {
        setData('creer_compte', checked);
        // Réinitialiser le mot de passe si on décoche la case
        if (!checked) {
            setData('password', '');
        }
    };

    return (
        <AppLayout>
            <Head title="Nouveau Professeur" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer un nouveau professeur
                            </h1>
                            <p className="text-indigo-100 mt-2 text-lg">
                                Ajoutez un nouveau membre du corps professoral
                            </p>
                        </div>

                        {/* Badge statut */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
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

                    {/* Création de compte utilisateur */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Compte utilisateur
                        </h3>

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="creer_compte"
                                checked={data.creer_compte}
                                onChange={(e) => handleCreerCompteChange(e.target.checked)}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="creer_compte" className="ml-3 block text-sm font-medium text-gray-900">
                                Créer un compte utilisateur pour ce professeur
                            </label>
                        </div>

                        {data.creer_compte && (
                            <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-200">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Mot de passe *
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-indigo-200 focus:border-indigo-500'
                                        } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Au moins 8 caractères"
                                />
                                {errors.password && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.password}</span>
                                    </div>
                                )}
                                <p className="mt-2 text-sm text-gray-600">
                                    Le professeur pourra se connecter avec son email et ce mot de passe
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Aperçu */}
                    {(data.prenom || data.nom || data.telephone || data.email || data.specialite) && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                            <h4 className="text-sm font-semibold text-indigo-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu du professeur
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-indigo-700">Nom complet :</span>
                                    <span className="ml-2 text-indigo-900">
                                        {data.prenom && data.nom ? `${data.prenom} ${data.nom}` : <span className="text-red-500">Incomplet</span>}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-indigo-700">Téléphone :</span>
                                    <span className="ml-2 text-indigo-900">
                                        {data.telephone || <span className="text-orange-500">Non renseigné</span>}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-indigo-700">Email :</span>
                                    <span className="ml-2 text-indigo-900">
                                        {data.email || <span className="text-orange-500">Non renseigné</span>}
                                    </span>
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
                                        {data.creer_compte ?
                                            <span className="text-green-600">✅ Activé</span> :
                                            <span className="text-gray-500">❌ Non créé</span>
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/professeurs"
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
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="font-semibold">Création en cours...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-semibold">Créer le professeur</span>
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