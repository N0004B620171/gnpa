import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Edit = ({ niveau, cycles }) => {
    const { errors } = usePage().props;
    const { data, setData, put, processing } = useForm({
        nom: niveau.nom,
        cycle_id: niveau.cycle_id,
        moyenne_min_pour_passage: niveau.moyenne_min_pour_passage
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/niveaux/${niveau.id}`);
    };

    const getMoyenneColor = (moyenne) => {
        if (moyenne >= 12) return 'text-green-600 bg-green-50 border-green-200';
        if (moyenne >= 10) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (moyenne >= 8) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <AppLayout>
            <Head title={`Modifier ${niveau.nom}`} />

            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier le niveau
                            </h1>
                            <p className="text-purple-100 mt-2 text-lg">
                                Mettez à jour les informations de {niveau.nom}
                            </p>
                        </div>
                        
                        {/* Badge statut */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Édition</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations du niveau */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Informations du niveau
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom du niveau *
                                </label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                                    } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: CP, CE1, 6ème, Terminale..."
                                    maxLength={255}
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
                                    Cycle *
                                </label>
                                <select
                                    value={data.cycle_id}
                                    onChange={(e) => setData('cycle_id', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.cycle_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                                    } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white`}
                                >
                                    <option value="">Sélectionnez un cycle</option>
                                    {cycles.map((cycle) => (
                                        <option key={cycle.id} value={cycle.id}>
                                            {cycle.nom}
                                        </option>
                                    ))}
                                </select>
                                {errors.cycle_id && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.cycle_id}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Moyenne minimale pour passage *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        max="20"
                                        value={data.moyenne_min_pour_passage}
                                        onChange={(e) => setData('moyenne_min_pour_passage', e.target.value)}
                                        className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                            errors.moyenne_min_pour_passage ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                                        } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white`}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500">/20</span>
                                    </div>
                                </div>
                                {errors.moyenne_min_pour_passage && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.moyenne_min_pour_passage}</span>
                                    </div>
                                )}
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                data.moyenne_min_pour_passage >= 12 ? 'bg-green-500' :
                                                data.moyenne_min_pour_passage >= 10 ? 'bg-blue-500' :
                                                data.moyenne_min_pour_passage >= 8 ? 'bg-orange-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${(data.moyenne_min_pour_passage / 20) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>0</span>
                                        <span className={`font-semibold ${getMoyenneColor(data.moyenne_min_pour_passage).split(' ')[0]}`}>
                                            {data.moyenne_min_pour_passage}/20
                                        </span>
                                        <span>20</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                        <h4 className="text-sm font-semibold text-purple-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Structure actuelle
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center p-3 bg-white rounded-xl border border-purple-100">
                                <div className="text-2xl font-bold text-purple-700">{niveau.classes?.length || 0}</div>
                                <div className="text-purple-600">Classes</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-xl border border-purple-100">
                                <div className="text-2xl font-bold text-purple-700">{niveau.matieres?.length || 0}</div>
                                <div className="text-purple-600">Matières</div>
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href={`/niveaux/${niveau.id}`}
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
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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