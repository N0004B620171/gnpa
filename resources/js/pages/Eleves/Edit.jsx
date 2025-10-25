import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Edit = ({ eleve, parents }) => {
    const { errors } = usePage().props;
    const { data, setData, put, processing } = useForm({
        prenom: eleve.prenom,
        nom: eleve.nom,
        date_naissance: eleve.date_naissance || '',
        sexe: eleve.sexe || '',
        photo: eleve.photo || '',
        parent_eleve_id: eleve.parent_eleve_id || '',
    });

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/eleves/${eleve.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Modifier ${eleve.prenom} ${eleve.nom}`} />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier l'élève
                            </h1>
                            <p className="text-emerald-100 mt-2 text-lg">
                                Mettez à jour les informations de {eleve.prenom} {eleve.nom}
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                        errors.prenom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                                    } focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white`}
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
                                        errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                                    } focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white`}
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

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Date de naissance
                                </label>
                                <input
                                    type="date"
                                    value={formatDateForInput(data.date_naissance)}
                                    onChange={(e) => setData('date_naissance', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Sexe
                                </label>
                                <select
                                    value={data.sexe}
                                    onChange={(e) => setData('sexe', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="M">Masculin</option>
                                    <option value="F">Féminin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Photo (URL)
                                </label>
                                <input
                                    type="url"
                                    value={data.photo}
                                    onChange={(e) => setData('photo', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white"
                                    placeholder="https://exemple.com/photo.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Parent
                                </label>
                                <select
                                    value={data.parent_eleve_id}
                                    onChange={(e) => setData('parent_eleve_id', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white"
                                >
                                    <option value="">Aucun parent</option>
                                    {parents.map((parent) => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.prenom} {parent.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Aperçu */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                        <h4 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Aperçu des modifications
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-emerald-700">Nom complet :</span>
                                <span className="ml-2 text-emerald-900">{data.prenom} {data.nom}</span>
                            </div>
                            <div>
                                <span className="font-medium text-emerald-700">Date de naissance :</span>
                                <span className="ml-2 text-emerald-900">
                                    {data.date_naissance ? 
                                        new Date(data.date_naissance).toLocaleDateString('fr-FR') : 
                                        <span className="text-orange-500">Non renseignée</span>
                                    }
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-emerald-700">Sexe :</span>
                                <span className="ml-2 text-emerald-900">
                                    {data.sexe === 'M' ? '👦 Masculin' : data.sexe === 'F' ? '👧 Féminin' : 'Non renseigné'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-emerald-700">Parent :</span>
                                <span className="ml-2 text-emerald-900">
                                    {data.parent_eleve_id ? 
                                        parents.find(p => p.id == data.parent_eleve_id)?.prenom + ' ' + parents.find(p => p.id == data.parent_eleve_id)?.nom :
                                        <span className="text-orange-500">Aucun parent</span>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href={`/eleves/${eleve.id}`}
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
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl hover:from-emerald-700 hover:to-teal-800 focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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