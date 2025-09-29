import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import Layout from '@/Components/Layout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        prenom: '',
        nom: '',
        telephone: '',
        email: '',
        specialite: '',
        user_id: ''
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('professeurs.store'));
    }

    return (
        <Layout title="Créer un professeur">
            <div className="max-w-2xl mx-auto">
                {/* En-tête */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Ajouter un nouveau professeur
                    </h1>
                    <p className="text-gray-600">Remplissez le formulaire pour ajouter un nouveau professeur</p>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    id="prenom"
                                    name="prenom"
                                    value={data.prenom}
                                    onChange={(e) => setData('prenom', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg border ${
                                        errors.prenom ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    placeholder="Entrez le prénom"
                                    required
                                />
                                {errors.prenom && (
                                    <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg border ${
                                        errors.nom ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    placeholder="Entrez le nom"
                                    required
                                />
                                {errors.nom && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                placeholder="Entrez l'email"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                id="telephone"
                                name="telephone"
                                value={data.telephone}
                                onChange={(e) => setData('telephone', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border ${
                                    errors.telephone ? 'border-red-500' : 'border-gray-300'
                                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                placeholder="Entrez le téléphone"
                            />
                            {errors.telephone && (
                                <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="specialite" className="block text-sm font-medium text-gray-700 mb-2">
                                Spécialité
                            </label>
                            <input
                                type="text"
                                id="specialite"
                                name="specialite"
                                value={data.specialite}
                                onChange={(e) => setData('specialite', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border ${
                                    errors.specialite ? 'border-red-500' : 'border-gray-300'
                                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                placeholder="Entrez la spécialité"
                            />
                            {errors.specialite && (
                                <p className="mt-1 text-sm text-red-600">{errors.specialite}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-2">
                                ID Utilisateur *
                            </label>
                            <input
                                type="number"
                                id="user_id"
                                name="user_id"
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border ${
                                    errors.user_id ? 'border-red-500' : 'border-gray-300'
                                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                placeholder="Entrez l'ID utilisateur"
                                required
                            />
                            {errors.user_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                            )}
                        </div>

                        <div className="flex flex-col-reverse md:flex-row gap-4 pt-6 border-t border-gray-200">
                            <Link
                                href={route('professeurs.index')}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Annuler
                            </Link>
                            
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {processing ? 'Création...' : 'Créer le professeur'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}