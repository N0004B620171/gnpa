import React, { useState, useEffect } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const CreateMultiple = ({ compositions, classes, flash }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        composition_id: '',
        matiere_id: '',
        notes: []
    });

    const [selectedComposition, setSelectedComposition] = useState(null);
    const [availableMatieres, setAvailableMatieres] = useState([]);
    const [availableEleves, setAvailableEleves] = useState([]);
    const [existingNotes, setExistingNotes] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Charger les données de la composition
    useEffect(() => {
        if (data.composition_id) {
            setLoading(true);
            const composition = compositions.find(c => c.id == data.composition_id);
            setSelectedComposition(composition);
            
            if (composition) {
                setAvailableMatieres(composition.matieres || []);
                setData('matiere_id', '');
                
                // Charger les élèves et notes existantes
                fetchCompositionData(composition.id);
            }
        }
    }, [data.composition_id]);

    const fetchCompositionData = async (compositionId) => {
        try {
            const response = await fetch(`/notes/composition-data/${compositionId}?matiere_id=${data.matiere_id}`);
            const result = await response.json();
            
            setAvailableEleves(result.composition.classe.inscriptions || []);
            setExistingNotes(result.existingNotes || {});
            
            // Initialiser les notes
            initializeNotes(result.composition.classe.inscriptions || []);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
        } finally {
            setLoading(false);
        }
    };

    const initializeNotes = (eleves) => {
        const initialNotes = eleves.map(inscription => {
            const existingNote = getExistingNote(inscription.id, data.matiere_id);
            return {
                inscription_id: inscription.id,
                note: existingNote ? existingNote.note : '',
                sur: existingNote ? existingNote.sur : 20,
                appreciation: existingNote ? existingNote.appreciation : ''
            };
        });
        setData('notes', initialNotes);
    };

    // Recharger les données quand la matière change
    useEffect(() => {
        if (data.composition_id && data.matiere_id) {
            fetchCompositionData(data.composition_id);
        }
    }, [data.matiere_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Filtrer les notes vides
        const notesWithValues = data.notes.filter(note => note.note !== '');
        
        if (notesWithValues.length === 0) {
            setMessage({ type: 'error', text: 'Veuillez saisir au moins une note' });
            return;
        }

        const submitData = {
            ...data,
            notes: notesWithValues
        };

        post('/notes/multiple', {
            data: submitData,
            onSuccess: (response) => {
                const result = response.props.flash;
                if (result.success) {
                    setMessage({ type: 'success', text: result.success });
                    reset();
                    setExistingNotes({});
                } else if (result.error) {
                    setMessage({ type: 'error', text: result.error });
                }
            },
            onError: (errors) => {
                setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
            }
        });
    };

    const updateNote = (index, field, value) => {
        const updatedNotes = [...data.notes];
        updatedNotes[index][field] = value;
        setData('notes', updatedNotes);
    };

    const getExistingNote = (inscriptionId, matiereId) => {
        return existingNotes[inscriptionId]?.[matiereId]?.[0] || null;
    };

    const calculatePourcentage = (note, sur) => {
        if (note && sur) {
            return ((note / sur) * 100).toFixed(1);
        }
        return 0;
    };

    const getNoteColor = (note, sur) => {
        const percentage = calculatePourcentage(note, sur);
        if (percentage >= 80) return 'text-green-600 bg-green-50';
        if (percentage >= 60) return 'text-blue-600 bg-blue-50';
        if (percentage >= 50) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    const getStats = () => {
        const total = data.notes.length;
        const saisies = data.notes.filter(note => note.note !== '').length;
        const pourcentage = total > 0 ? ((saisies / total) * 100).toFixed(1) : 0;
        return { total, saisies, pourcentage };
    };

    const stats = getStats();

    return (
        <AppLayout>
            <Head title="Saisie Groupée des Notes" />

            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Saisie Groupée des Notes
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Saisissez les notes pour tous les élèves d'une classe
                            </p>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Groupée</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {(message || flash?.success || flash?.error) && (
                    <div className={`mx-8 mt-6 p-4 rounded-xl ${
                        message?.type === 'error' || flash?.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                    }`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {message?.type === 'error' || flash?.error ? (
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${
                                    message?.type === 'error' || flash?.error ? 'text-red-800' : 'text-green-800'
                                }`}>
                                    {message?.text || flash?.success || flash?.error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Sélection de la composition et matière */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Composition
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Composition *
                                </label>
                                <select
                                    value={data.composition_id}
                                    onChange={(e) => setData('composition_id', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.composition_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                >
                                    <option value="">Sélectionnez une composition</option>
                                    {compositions.map((composition) => (
                                        <option key={composition.id} value={composition.id}>
                                            {composition.nom} - {composition.classe?.nom} ({composition.trimestre?.annee_scolaire?.nom})
                                        </option>
                                    ))}
                                </select>
                                {errors.composition_id && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.composition_id}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Matière
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Matière *
                                </label>
                                <select
                                    value={data.matiere_id}
                                    onChange={(e) => setData('matiere_id', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.matiere_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                    disabled={!selectedComposition || loading}
                                >
                                    <option value="">Sélectionnez une matière</option>
                                    {availableMatieres.map((matiere) => (
                                        <option key={matiere.id} value={matiere.id}>
                                            {matiere.nom} (Coef. {matiere.coefficient})
                                        </option>
                                    ))}
                                </select>
                                {errors.matiere_id && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.matiere_id}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedComposition && (
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-blue-700">Classe :</span>
                                    <span className="ml-2 text-blue-900">{selectedComposition.classe?.nom}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-700">Trimestre :</span>
                                    <span className="ml-2 text-blue-900">{selectedComposition.trimestre?.nom}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-700">Année scolaire :</span>
                                    <span className="ml-2 text-blue-900">{selectedComposition.trimestre?.annee_scolaire?.nom}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-700">Élèves :</span>
                                    <span className="ml-2 text-blue-900">{availableEleves.length}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Statistiques de saisie */}
                    {data.composition_id && data.matiere_id && (
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                            <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Progression de la saisie
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stats.saisies}</div>
                                    <div className="text-sm text-gray-600">Notes saisies</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{stats.pourcentage}%</div>
                                    <div className="text-sm text-gray-600">Complétion</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
                                    <div className="text-sm text-gray-600">Total élèves</div>
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${stats.pourcentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Tableau de saisie des notes */}
                    {data.composition_id && data.matiere_id && availableEleves.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Saisie des Notes
                            </h3>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Élève</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Note</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Sur</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">%</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Appréciation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.notes.map((note, index) => {
                                            const inscription = availableEleves.find(e => e.id === note.inscription_id);
                                            const existingNote = getExistingNote(note.inscription_id, data.matiere_id);
                                            
                                            if (!inscription) return null;
                                            
                                            return (
                                                <tr key={note.inscription_id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 border-b">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                                <span className="text-blue-600 font-bold">
                                                                    {inscription.eleve?.prenom[0]}{inscription.eleve?.nom[0]}
                                                                </span>
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="font-medium text-gray-900">
                                                                    {inscription.eleve?.prenom} {inscription.eleve?.nom}
                                                                </div>
                                                                {existingNote && (
                                                                    <div className="text-xs text-orange-600">
                                                                        Note existante: {existingNote.note}/{existingNote.sur}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 border-b">
                                                        <input
                                                            type="number"
                                                            step="0.25"
                                                            min="0"
                                                            value={note.note}
                                                            onChange={(e) => updateNote(index, 'note', e.target.value)}
                                                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="0.00"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 border-b">
                                                        <input
                                                            type="number"
                                                            step="1"
                                                            min="1"
                                                            value={note.sur}
                                                            onChange={(e) => updateNote(index, 'sur', e.target.value)}
                                                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="20"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 border-b">
                                                        <div className={`w-16 px-2 py-1 rounded text-center font-medium ${getNoteColor(note.note, note.sur)}`}>
                                                            {calculatePourcentage(note.note, note.sur)}%
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 border-b">
                                                        <input
                                                            type="text"
                                                            value={note.appreciation}
                                                            onChange={(e) => updateNote(index, 'appreciation', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Commentaire..."
                                                            maxLength={100}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/notes"
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à la liste
                        </Link>

                        {data.composition_id && data.matiere_id && (
                            <button
                                type="submit"
                                disabled={processing || stats.saisies === 0}
                                className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="font-semibold">Enregistrement...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-semibold">
                                            Enregistrer ({stats.saisies} notes)
                                        </span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default CreateMultiple;