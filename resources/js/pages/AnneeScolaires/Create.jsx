import React, { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Create = ({ suggestions, cycles }) => {
    const { errors } = usePage().props;
    const [selectedCycles, setSelectedCycles] = useState([]);

    const { data, setData, post, processing } = useForm({
        nom: '',
        date_debut: '',
        date_fin: '',
        actif: false,
        description: '',
        cycles: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/annees-scolaires');
    };

    const calculateDateFin = (dateDebut) => {
        if (!dateDebut) return '';
        const date = new Date(dateDebut);
        date.setFullYear(date.getFullYear() + 1);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    };

    const handleDateDebutChange = (dateDebut) => {
        setData('date_debut', dateDebut);
        if (dateDebut && !data.date_fin) {
            setData('date_fin', calculateDateFin(dateDebut));
        }
    };

    const generateNomSuggestion = (dateDebut) => {
        if (!dateDebut) return '';
        const annee = new Date(dateDebut).getFullYear();
        return `${annee}-${annee + 1}`;
    };

    const handleCycleToggle = (cycleId) => {
        const newCycles = selectedCycles.includes(cycleId)
            ? selectedCycles.filter(id => id !== cycleId)
            : [...selectedCycles, cycleId];
        
        setSelectedCycles(newCycles);
        setData('cycles', newCycles);
    };

    const getCycleLangues = (cycle) => {
        return cycle.langues?.map(l => l.code).join(', ') || 'Aucune langue';
    };

    return (
        <AppLayout>
            <Head title="Nouvelle Année Scolaire" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer une nouvelle année scolaire
                            </h1>
                            <p className="text-indigo-100 mt-2 text-lg">
                                Ajoutez une nouvelle année scolaire à l'établissement
                            </p>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations de l'année scolaire */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Informations de l'année scolaire
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom de l'année *
                                </label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                    } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: 2023-2024"
                                />
                                {errors.nom && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.nom}</span>
                                    </div>
                                )}
                                {data.date_debut && (
                                    <div className="text-xs text-indigo-600 mt-1">
                                        💡 Suggestion: {generateNomSuggestion(data.date_debut)}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white resize-none"
                                    placeholder="Description optionnelle de l'année scolaire..."
                                    maxLength={500}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {data.description.length}/500 caractères
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Date de début *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_debut}
                                        onChange={(e) => handleDateDebutChange(e.target.value)}
                                        className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                            errors.date_debut ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                        } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                    />
                                    {errors.date_debut && (
                                        <div className="flex items-center mt-2 text-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">{errors.date_debut}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Date de fin *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_fin}
                                        onChange={(e) => setData('date_fin', e.target.value)}
                                        className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                            errors.date_fin ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                        } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                    />
                                    {errors.date_fin && (
                                        <div className="flex items-center mt-2 text-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">{errors.date_fin}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="actif"
                                        checked={data.actif}
                                        onChange={(e) => setData('actif', e.target.checked)}
                                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="actif" className="ml-3 block text-sm font-medium text-blue-900">
                                        Définir comme année scolaire active
                                    </label>
                                </div>
                                <p className="text-sm text-blue-700 mt-2">
                                    ⚠️ Si cochée, cette année scolaire deviendra l'année active et les autres seront désactivées automatiquement.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sélection des cycles */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Cycles à inclure *
                        </h3>
                        
                        {errors.cycles && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{errors.cycles}</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cycles.map((cycle) => (
                                <div
                                    key={cycle.id}
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                        selectedCycles.includes(cycle.id)
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleCycleToggle(cycle.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCycles.includes(cycle.id)}
                                                    onChange={() => handleCycleToggle(cycle.id)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-3 block text-sm font-semibold text-gray-900">
                                                    {cycle.nom}
                                                </label>
                                            </div>
                                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    <span>{cycle.nombre_trimestres} trimestres</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    <span>Bareme: {cycle.bareme}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                    </svg>
                                                    <span>Langues: {getCycleLangues(cycle)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aperçu */}
                    {(data.nom || data.date_debut || data.date_fin || selectedCycles.length > 0) && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                            <h4 className="text-sm font-semibold text-indigo-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu de l'année scolaire
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-indigo-100">
                                    <div>
                                        <div className="font-medium text-indigo-900">
                                            {data.nom || 'Nom de l\'année'}
                                        </div>
                                        <div className="text-sm text-indigo-600">
                                            {data.date_debut && data.date_fin 
                                                ? `${new Date(data.date_debut).toLocaleDateString('fr-FR')} - ${new Date(data.date_fin).toLocaleDateString('fr-FR')}`
                                                : 'Période non définie'
                                            }
                                        </div>
                                        {data.description && (
                                            <div className="text-sm text-gray-600 mt-2">
                                                {data.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-indigo-500">Statut</div>
                                        <div className={`text-sm font-bold ${data.actif ? 'text-green-600' : 'text-gray-600'}`}>
                                            {data.actif ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedCycles.length > 0 && (
                                    <div className="bg-white rounded-xl border border-indigo-100 p-4">
                                        <h5 className="text-sm font-semibold text-indigo-900 mb-2">
                                            Cycles sélectionnés ({selectedCycles.length}) :
                                        </h5>
                                        <div className="space-y-2 text-sm">
                                            {cycles
                                                .filter(cycle => selectedCycles.includes(cycle.id))
                                                .map(cycle => (
                                                    <div key={cycle.id} className="flex justify-between items-center py-1">
                                                        <span className="text-indigo-700">{cycle.nom}</span>
                                                        <span className="text-indigo-600">
                                                            {cycle.nombre_trimestres} trimestres • {getCycleLangues(cycle)}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}

                                <div className="text-sm text-indigo-700">
                                    💡 Les trimestres, compositions et bulletins seront créés automatiquement pour chaque cycle sélectionné
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/annees-scolaires"
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à la liste
                        </Link>

                        <button
                            type="submit"
                            disabled={processing || selectedCycles.length === 0}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    <span className="font-semibold">Créer l'année scolaire</span>
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