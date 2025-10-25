import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Create = ({ trimestres, classes, matieres }) => {
    const { data, setData, post, processing, errors } = useForm({
        trimestre_id: '',
        classe_id: '',
        nom: '',
        date: '',
        langue: 'fr',
        matieres: [] // Ceci doit être un tableau
    });

    const [selectedMatieres, setSelectedMatieres] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Données envoyées:', data); // Debug
        post('/compositions');
    };

    const handleMatiereToggle = (matiereId) => {
        const newSelection = selectedMatieres.includes(matiereId)
            ? selectedMatieres.filter(id => id !== matiereId)
            : [...selectedMatieres, matiereId];
        
        setSelectedMatieres(newSelection);
        setData('matieres', newSelection); // Mettre à jour le tableau matieres
    };

    // Filtrer les matières selon la classe sélectionnée
    const filteredMatieres = matieres.filter(matiere => {
        if (!data.classe_id) return true;
        
        // Trouver la classe sélectionnée
        const selectedClasse = classes.find(c => c.id == data.classe_id);
        if (!selectedClasse) return true;
        
        // Si la matière n'a pas de niveau_id, elle est disponible pour toutes les classes
        if (!matiere.niveau_id) return true;
        
        // Vérifier si le niveau de la matière correspond au niveau de la classe
        return matiere.niveau_id == selectedClasse.niveau_id;
    });

    return (
        <AppLayout>
            <Head title="Nouvelle Composition" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer une nouvelle composition
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Organisez une nouvelle évaluation pour une classe
                            </p>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations de base */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Informations de la composition
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom de la composition *
                                </label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: Composition de Mathématiques, Examen de Français..."
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
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                />
                                {errors.date && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.date}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Trimestre *
                                </label>
                                <select
                                    value={data.trimestre_id}
                                    onChange={(e) => setData('trimestre_id', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.trimestre_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                >
                                    <option value="">Sélectionner un trimestre</option>
                                    {trimestres.map((trimestre) => (
                                        <option key={trimestre.id} value={trimestre.id}>
                                            {trimestre.nom}
                                        </option>
                                    ))}
                                </select>
                                {errors.trimestre_id && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.trimestre_id}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Classe *
                                </label>
                                <select
                                    value={data.classe_id}
                                    onChange={(e) => {
                                        setData('classe_id', e.target.value);
                                        // Réinitialiser les matières sélectionnées quand la classe change
                                        setSelectedMatieres([]);
                                        setData('matieres', []);
                                    }}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.classe_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                >
                                    <option value="">Sélectionner une classe</option>
                                    {classes.map((classe) => (
                                        <option key={classe.id} value={classe.id}>
                                            {classe.nom}
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
                                    Langue *
                                </label>
                                <select
                                    value={data.langue}
                                    onChange={(e) => setData('langue', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">Anglais</option>
                                    <option value="ar">Arabe</option>
                                </select>
                                {errors.langue && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.langue}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sélection des matières */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Matières à évaluer *
                        </h3>

                        {errors.matieres && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium">{errors.matieres}</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredMatieres.map((matiere) => (
                                <div
                                    key={matiere.id}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                        selectedMatieres.includes(matiere.id)
                                            ? 'border-purple-500 bg-purple-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                    onClick={() => handleMatiereToggle(matiere.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{matiere.nom}</h4>
                                            <div className="flex items-center mt-2 space-x-2">
                                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                    Coef. {matiere.coefficient}
                                                </span>
                                                {matiere.niveau && (
                                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                                        {matiere.niveau.nom}
                                                    </span>
                                                )}
                                            </div>
                                            {matiere.professeur && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Prof: {matiere.professeur.prenom} {matiere.professeur.nom}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                            selectedMatieres.includes(matiere.id)
                                                ? 'bg-purple-500 border-purple-500'
                                                : 'border-gray-300'
                                        }`}>
                                            {selectedMatieres.includes(matiere.id) && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredMatieres.length === 0 && data.classe_id && (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p>Aucune matière disponible pour cette classe</p>
                                <p className="text-sm mt-1">Les matières doivent être associées au niveau de la classe sélectionnée</p>
                            </div>
                        )}

                        {!data.classe_id && (
                            <div className="text-center py-8 text-gray-500">
                                <p>Veuillez d'abord sélectionner une classe pour voir les matières disponibles</p>
                            </div>
                        )}
                    </div>

                    {/* Aperçu */}
                    {(data.nom || data.trimestre_id || data.classe_id || selectedMatieres.length > 0) && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu de la composition
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100">
                                    <div>
                                        <div className="font-medium text-blue-900">
                                            {data.nom || 'Nom de la composition'}
                                        </div>
                                        <div className="text-sm text-blue-600">
                                            {data.date && `Date: ${new Date(data.date).toLocaleDateString('fr-FR')}`}
                                            {data.trimestre_id && ` • ${trimestres.find(t => t.id == data.trimestre_id)?.nom}`}
                                            {data.classe_id && ` • ${classes.find(c => c.id == data.classe_id)?.nom}`}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-blue-500">Matières</div>
                                        <div className="text-sm font-bold text-blue-700">
                                            {selectedMatieres.length} sélectionnée(s)
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedMatieres.length > 0 && (
                                    <div className="bg-white rounded-xl border border-blue-100 p-4">
                                        <h5 className="text-sm font-semibold text-blue-900 mb-2">Matières sélectionnées :</h5>
                                        <div className="space-y-2 text-sm">
                                            {selectedMatieres.map(matiereId => {
                                                const matiere = matieres.find(m => m.id == matiereId);
                                                return matiere ? (
                                                    <div key={matiere.id} className="flex justify-between items-center py-1">
                                                        <span className="text-blue-700">{matiere.nom}</span>
                                                        <span className="text-blue-600">Coef. {matiere.coefficient}</span>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="text-sm text-blue-700">
                                    💡 Vous pourrez saisir les notes après la création de la composition
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/compositions"
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à la liste
                        </Link>

                        <button
                            type="submit"
                            disabled={processing || selectedMatieres.length === 0}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
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
                                    <span className="font-semibold">
                                        Créer la composition ({selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''})
                                    </span>
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