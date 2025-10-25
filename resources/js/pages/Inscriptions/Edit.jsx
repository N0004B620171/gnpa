import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Edit = ({ inscription, eleves, classes, anneesScolaires }) => {
    const { data, setData, put, processing, errors } = useForm({
        eleve_id: inscription.eleve_id,
        classe_id: inscription.classe_id,
        annee_scolaire_id: inscription.annee_scolaire_id,
        date_inscription: inscription.date_inscription.split('T')[0],
        statut: inscription.statut
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/inscriptions/${inscription.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Modifier l'inscription`} />

            <div className="max-w-2xl mx-auto">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <h1 className="text-3xl font-bold">Modifier l'Inscription</h1>
                    <p className="text-blue-100 mt-2 text-lg">
                        Mettez à jour les informations de l'inscription
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    <div className="space-y-6">
                        {/* Sélection de l'élève */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Élève *
                            </label>
                            <select
                                value={data.eleve_id}
                                onChange={(e) => setData('eleve_id', e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                            >
                                <option value="">Sélectionnez un élève</option>
                                {eleves.map((eleve) => (
                                    <option key={eleve.id} value={eleve.id}>
                                        {eleve.prenom} {eleve.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.eleve_id && (
                                <p className="text-red-600 text-sm mt-2">{errors.eleve_id}</p>
                            )}
                        </div>

                        {/* Sélection de la classe */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Classe *
                            </label>
                            <select
                                value={data.classe_id}
                                onChange={(e) => setData('classe_id', e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                            >
                                <option value="">Sélectionnez une classe</option>
                                {classes.map((classe) => (
                                    <option key={classe.id} value={classe.id}>
                                        {classe.nom} - {classe.niveau?.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.classe_id && (
                                <p className="text-red-600 text-sm mt-2">{errors.classe_id}</p>
                            )}
                        </div>

                        {/* Sélection de l'année scolaire */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Année Scolaire *
                            </label>
                            <select
                                value={data.annee_scolaire_id}
                                onChange={(e) => setData('annee_scolaire_id', e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                            >
                                <option value="">Sélectionnez une année scolaire</option>
                                {anneesScolaires.map((annee) => (
                                    <option key={annee.id} value={annee.id}>
                                        {annee.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.annee_scolaire_id && (
                                <p className="text-red-600 text-sm mt-2">{errors.annee_scolaire_id}</p>
                            )}
                        </div>

                        {/* Date et statut */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Date d'inscription
                                </label>
                                <input
                                    type="date"
                                    value={data.date_inscription}
                                    onChange={(e) => setData('date_inscription', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                />
                                {errors.date_inscription && (
                                    <p className="text-red-600 text-sm mt-2">{errors.date_inscription}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Statut
                                </label>
                                <select
                                    value={data.statut}
                                    onChange={(e) => setData('statut', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                >
                                    <option value="actif">Actif</option>
                                    <option value="inactif">Inactif</option>
                                </select>
                            </div>
                        </div>

                        {/* Boutons */}
                        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                            <Link
                                href={`/inscriptions/${inscription.id}`}
                                className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                            >
                                {processing ? 'Mise à jour...' : 'Mettre à jour'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;