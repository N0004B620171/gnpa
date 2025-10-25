import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Create = ({ parents, classes, anneesScolaires }) => {
    const { errors } = usePage().props;
    const { data, setData, post, processing } = useForm({
        prenom: '',
        nom: '',
        date_naissance: '',
        sexe: '',
        photo: '',
        parent_eleve_id: '',
        nouveau_parent: false,
        parent_prenom: '',
        parent_nom: '',
        parent_telephone: '',
        parent_email: '',
        parent_adresse: '',
        inscrire_maintenant: false,
        classe_id: '',
        annee_scolaire_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/eleves');
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return 'Aucune date sélectionnée';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    return (
        <AppLayout>
            <Head title="Nouvel Élève" />

            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer un nouvel élève
                            </h1>
                            <p className="text-emerald-100 mt-2 text-lg">
                                Ajoutez un nouvel élève au système scolaire
                            </p>
                        </div>
                        
                        {/* Badge statut */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations de l'élève */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Informations personnelles de l'élève
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
                                    value={data.date_naissance}
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
                        </div>
                    </div>

                    {/* Parent */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            Parent / Tuteur légal
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="nouveau_parent"
                                    checked={data.nouveau_parent}
                                    onChange={(e) => setData('nouveau_parent', e.target.checked)}
                                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                />
                                <label htmlFor="nouveau_parent" className="ml-3 block text-sm font-medium text-gray-900">
                                    Créer un nouveau parent
                                </label>
                            </div>

                            {!data.nouveau_parent ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Parent existant
                                    </label>
                                    <select
                                        value={data.parent_eleve_id}
                                        onChange={(e) => setData('parent_eleve_id', e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white"
                                    >
                                        <option value="">Sélectionner un parent</option>
                                        {parents.map((parent) => (
                                            <option key={parent.id} value={parent.id}>
                                                {parent.prenom} {parent.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-emerald-200">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Prénom du parent *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.parent_prenom}
                                            onChange={(e) => setData('parent_prenom', e.target.value)}
                                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                                errors.parent_prenom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                                            } focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white`}
                                            placeholder="Prénom du parent"
                                        />
                                        {errors.parent_prenom && (
                                            <div className="flex items-center mt-2 text-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm">{errors.parent_prenom}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Nom du parent *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.parent_nom}
                                            onChange={(e) => setData('parent_nom', e.target.value)}
                                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                                errors.parent_nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                                            } focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white`}
                                            placeholder="Nom du parent"
                                        />
                                        {errors.parent_nom && (
                                            <div className="flex items-center mt-2 text-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm">{errors.parent_nom}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Email du parent
                                        </label>
                                        <input
                                            type="email"
                                            value={data.parent_email}
                                            onChange={(e) => setData('parent_email', e.target.value)}
                                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                                errors.parent_email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                                            } focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white`}
                                            placeholder="email@exemple.com"
                                        />
                                        {errors.parent_email && (
                                            <div className="flex items-center mt-2 text-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm">{errors.parent_email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Téléphone
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.parent_telephone}
                                            onChange={(e) => setData('parent_telephone', e.target.value)}
                                            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white"
                                            placeholder="+33 1 23 45 67 89"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Adresse
                                        </label>
                                        <textarea
                                            value={data.parent_adresse}
                                            onChange={(e) => setData('parent_adresse', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white resize-none"
                                            placeholder="Adresse complète du parent"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inscription immédiate */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                            </svg>
                            Inscription scolaire
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="inscrire_maintenant"
                                    checked={data.inscrire_maintenant}
                                    onChange={(e) => setData('inscrire_maintenant', e.target.checked)}
                                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                />
                                <label htmlFor="inscrire_maintenant" className="ml-3 block text-sm font-medium text-gray-900">
                                    Inscrire immédiatement dans une classe
                                </label>
                            </div>

                            {data.inscrire_maintenant && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-purple-200">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Classe *
                                        </label>
                                        <select
                                            value={data.classe_id}
                                            onChange={(e) => setData('classe_id', e.target.value)}
                                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                                errors.classe_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                                            } focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white`}
                                        >
                                            <option value="">Sélectionner une classe</option>
                                            {classes.map((classe) => (
                                                <option key={classe.id} value={classe.id}>
                                                    {classe.niveau?.cycle?.nom} - {classe.niveau?.nom} {classe.nom}
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
                                            Année scolaire *
                                        </label>
                                        <select
                                            value={data.annee_scolaire_id}
                                            onChange={(e) => setData('annee_scolaire_id', e.target.value)}
                                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                                errors.annee_scolaire_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                                            } focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white`}
                                        >
                                            <option value="">Sélectionner une année</option>
                                            {anneesScolaires.map((annee) => (
                                                <option key={annee.id} value={annee.id}>
                                                    {annee.nom}
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
                            )}
                        </div>
                    </div>

                    {/* Aperçu */}
                    {(data.prenom || data.nom || data.parent_prenom || data.parent_nom) && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                            <h4 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu de l'élève
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-emerald-700">Élève :</span>
                                    <span className="ml-2 text-emerald-900">
                                        {data.prenom && data.nom ? `${data.prenom} ${data.nom}` : <span className="text-red-500">Incomplet</span>}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-emerald-700">Date de naissance :</span>
                                    <span className="ml-2 text-emerald-900">
                                        {formatDisplayDate(data.date_naissance) || <span className="text-orange-500">Non renseignée</span>}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-emerald-700">Parent :</span>
                                    <span className="ml-2 text-emerald-900">
                                        {data.nouveau_parent ? 
                                            (data.parent_prenom && data.parent_nom ? `${data.parent_prenom} ${data.parent_nom}` : <span className="text-red-500">Incomplet</span>) :
                                            (data.parent_eleve_id ? 'Parent existant sélectionné' : <span className="text-orange-500">Non sélectionné</span>)
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-emerald-700">Inscription :</span>
                                    <span className="ml-2 text-emerald-900">
                                        {data.inscrire_maintenant ? 
                                            (data.classe_id && data.annee_scolaire_id ? '✅ Immédiate + bulletins générés' : <span className="text-red-500">Incomplète</span>) : 
                                            <span className="text-gray-500">❌ Non immédiate</span>
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/eleves"
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
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl hover:from-emerald-700 hover:to-teal-800 focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    <span className="font-semibold">Créer l'élève</span>
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