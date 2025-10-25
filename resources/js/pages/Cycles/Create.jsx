import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Create({ langues, systemes }) {
    const [selectedLangues, setSelectedLangues] = useState([]);
    const [selectedSysteme, setSelectedSysteme] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        systeme: '',
        nombre_trimestres: 3,
        bareme: 20,
        langues: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/cycles');
    };

    const handleSystemeChange = (systeme) => {
        setSelectedSysteme(systeme);
        setData('systeme', systeme);
        
        // Réinitialiser les langues si le système change
        const maxLangues = systemes.find(s => s.value === systeme)?.max_langues || 1;
        if (selectedLangues.length > maxLangues) {
            setSelectedLangues([]);
            setData('langues', []);
        }
    };

    const handleLangueToggle = (langueId) => {
        const maxLangues = systemes.find(s => s.value === selectedSysteme)?.max_langues || 1;
        
        let newLangues;
        if (selectedLangues.includes(langueId)) {
            newLangues = selectedLangues.filter(id => id !== langueId);
        } else {
            if (selectedLangues.length >= maxLangues) {
                return; // Ne pas dépasser le maximum
            }
            newLangues = [...selectedLangues, langueId];
        }
        
        setSelectedLangues(newLangues);
        setData('langues', newLangues);
    };

    const getMaxLangues = () => {
        return systemes.find(s => s.value === selectedSysteme)?.max_langues || 1;
    };

    return (
        <AppLayout>
            <Head title="Créer un Cycle" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer un nouveau cycle
                            </h1>
                            <p className="text-cyan-100 mt-2 text-lg">
                                Configurez un nouveau cycle pédagogique
                            </p>
                        </div>
                        
                        {/* Badge statut */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations de base */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Informations de base
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom du cycle *
                                </label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-cyan-500'
                                    } focus:ring-4 focus:ring-cyan-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: Cycle Primaire, Cycle Secondaire..."
                                    maxLength={100}
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

                    {/* Configuration pédagogique */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Configuration pédagogique
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Système éducatif *
                                </label>
                                <select
                                    value={data.systeme}
                                    onChange={(e) => handleSystemeChange(e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.systeme ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-cyan-500'
                                    } focus:ring-4 focus:ring-cyan-500/20 transition-all duration-200 bg-white`}
                                >
                                    <option value="">Sélectionnez un système</option>
                                    {systemes.map((systeme) => (
                                        <option key={systeme.value} value={systeme.value}>
                                            {systeme.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.systeme && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.systeme}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nombre de trimestres *
                                </label>
                                <select
                                    value={data.nombre_trimestres}
                                    onChange={(e) => setData('nombre_trimestres', parseInt(e.target.value))}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.nombre_trimestres ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-cyan-500'
                                    } focus:ring-4 focus:ring-cyan-500/20 transition-all duration-200 bg-white`}
                                >
                                    <option value={1}>1 trimestre</option>
                                    <option value={2}>2 trimestres</option>
                                    <option value={3}>3 trimestres</option>
                                </select>
                                {errors.nombre_trimestres && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.nombre_trimestres}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Barème *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={data.bareme}
                                    onChange={(e) => setData('bareme', parseFloat(e.target.value))}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.bareme ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-cyan-500'
                                    } focus:ring-4 focus:ring-cyan-500/20 transition-all duration-200 bg-white`}
                                />
                                {errors.bareme && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.bareme}</span>
                                    </div>
                                )}
                                <p className="mt-1 text-xs text-gray-500">Note maximale (ex: 20, 100)</p>
                            </div>
                        </div>
                    </div>

                    {/* Langues d'enseignement */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            Langues d'enseignement *
                            {selectedSysteme && (
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    (Maximum {getMaxLangues()} langue(s) pour le système {selectedSysteme})
                                </span>
                            )}
                        </h3>
                        
                        {errors.langues && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-600">{errors.langues}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {langues.map((langue) => (
                                <div
                                    key={langue.id}
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                        selectedLangues.includes(langue.id)
                                            ? 'border-cyan-500 bg-cyan-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    } ${
                                        !selectedLangues.includes(langue.id) && selectedLangues.length >= getMaxLangues()
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        if (!selectedLangues.includes(langue.id) && selectedLangues.length >= getMaxLangues()) {
                                            return;
                                        }
                                        handleLangueToggle(langue.id);
                                    }}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedLangues.includes(langue.id)}
                                            onChange={() => handleLangueToggle(langue.id)}
                                            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                                            disabled={!selectedLangues.includes(langue.id) && selectedLangues.length >= getMaxLangues()}
                                        />
                                        <label className="ml-3 block text-sm font-medium text-gray-700">
                                            {langue.nom} ({langue.code})
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aperçu */}
                    {(data.nom || data.systeme || selectedLangues.length > 0) && (
                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
                            <h4 className="text-sm font-semibold text-cyan-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu du cycle
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-cyan-100">
                                    <div>
                                        <div className="font-medium text-cyan-900">{data.nom || 'Non défini'}</div>
                                        <div className="text-sm text-cyan-600">
                                            {systemes.find(s => s.value === data.systeme)?.label || 'Système non défini'} • 
                                            {data.nombre_trimestres} trimestre(s) • Barème: {data.bareme}/20
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-cyan-500">Langues</div>
                                        <div className="text-lg font-bold text-cyan-700">{selectedLangues.length}</div>
                                    </div>
                                </div>
                                {selectedLangues.length > 0 && (
                                    <div className="text-sm text-cyan-700">
                                        <strong>Langues sélectionnées:</strong>{' '}
                                        {selectedLangues.map(id => {
                                            const langue = langues.find(l => l.id === id);
                                            return langue ? `${langue.nom} (${langue.code})` : '';
                                        }).join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/cycles"
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
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl hover:from-cyan-700 hover:to-blue-800 focus:ring-4 focus:ring-cyan-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    <span className="font-semibold">Créer le cycle</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}