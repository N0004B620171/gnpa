// resources/js/pages/Matieres/Show.jsx
import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Show = ({ matiere, compositionsDisponibles, statistiques }) => {
    const { flash } = usePage().props;
    const [selectedComposition, setSelectedComposition] = useState('');
    const [showAddComposition, setShowAddComposition] = useState(false);

    const handleDelete = () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la matière "${matiere.nom}" ?`)) {
            router.delete(`/matieres/${matiere.id}`);
        }
    };

    const handleAttachComposition = (e) => {
        e.preventDefault();
        if (!selectedComposition) return;

        router.post(`/matieres/${matiere.id}/attach-composition`, {
            composition_id: selectedComposition
        }, {
            onSuccess: () => {
                setSelectedComposition('');
                setShowAddComposition(false);
            }
        });
    };

    const handleDetachComposition = (compositionId) => {
        if (confirm('Retirer cette matière de la composition ?')) {
            router.delete(`/matieres/${matiere.id}/detach-composition/${compositionId}`);
        }
    };

    const getCoefficientColor = (coefficient) => {
        if (coefficient >= 5) return 'bg-red-100 text-red-800 border-red-200';
        if (coefficient >= 3) return 'bg-orange-100 text-orange-800 border-orange-200';
        if (coefficient >= 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-green-100 text-green-800 border-green-200';
    };

    const notesCount = matiere.notes?.length || 0;
    const compositionsCount = matiere.compositions?.length || 0;

    return (
        <AppLayout>
            <Head title={`Matière ${matiere.nom}`} />

            <div className="max-w-7xl mx-auto">
                {/* Alertes */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium text-green-800">{flash.success}</p>
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium text-red-800">{flash.error}</p>
                        </div>
                    </div>
                )}

                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center">
                            <Link href="/matieres" className="mr-4">
                                <button className="inline-flex items-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {matiere.nom}
                                </h1>
                                <p className="text-blue-100 mt-2 text-lg">
                                    Coefficient: {matiere.coefficient}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-0 flex space-x-3">
                            <Link
                                href={`/matieres/${matiere.id}/edit`}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl text-white hover:bg-red-500/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Informations principales */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Carte Informations Générales */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    Informations Générales
                                </h3>
                            </div>
                            <div className="p-6">
                                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nom</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{matiere.nom}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Coefficient</dt>
                                        <dd className="mt-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCoefficientColor(matiere.coefficient)}`}>
                                                {matiere.coefficient}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Niveau</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">
                                            {matiere.niveau ? (
                                                <div className="flex items-center">
                                                    <span>{matiere.niveau.nom}</span>
                                                    <span className="ml-2 text-sm text-gray-600">({matiere.niveau.cycle?.nom})</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">Tous les niveaux</span>
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Notes enregistrées</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{notesCount}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Compositions</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{compositionsCount}</dd>
                                    </div>
                                    {statistiques.moyenne_matiere && (
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Moyenne générale</dt>
                                            <dd className="mt-2 text-lg font-medium text-gray-900">
                                                {statistiques.moyenne_matiere.toFixed(2)}/20
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        {/* Carte Compositions */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-6 py-5 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Compositions associées ({matiere.compositions.length})
                                    </h3>
                                    <button
                                        onClick={() => setShowAddComposition(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Ajouter
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {matiere.compositions.length > 0 ? (
                                    <div className="space-y-4">
                                        {matiere.compositions.map((composition) => (
                                            <div key={composition.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-semibold text-gray-900">{composition.nom}</h4>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        <span className="font-medium">Classe:</span> {composition.classe?.nom} • 
                                                        <span className="font-medium ml-2">Trimestre:</span> {composition.trimestre?.nom} • 
                                                        <span className="font-medium ml-2">Date:</span> {new Date(composition.date).toLocaleDateString('fr-FR')}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/compositions/${composition.id}`}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Voir la composition"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDetachComposition(composition.id)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Retirer de la composition"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p>Aucune composition associée</p>
                                        <p className="text-sm mt-1">Ajoutez cette matière à une composition pour pouvoir saisir des notes</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Carte Notes récentes */}
                        {matiere.notes.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Notes récentes
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {matiere.notes.slice(0, 5).map((note) => (
                                            <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-xs">
                                                            {note.inscription?.eleve?.prenom[0]}{note.inscription?.eleve?.nom[0]}
                                                        </span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {note.inscription?.eleve?.prenom} {note.inscription?.eleve?.nom}
                                                        </div>
                                                        <div className="text-xs text-gray-600">
                                                            {note.composition?.nom} • {new Date(note.created_at).toLocaleDateString('fr-FR')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {note.note}/{note.sur}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {((note.note / note.sur) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {matiere.notes.length > 5 && (
                                        <div className="mt-4 text-center">
                                            <Link
                                                href="/notes"
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Voir toutes les notes ({matiere.notes.length})
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Profil de la Matière */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {matiere.nom}
                                    </h3>
                                    <div className="mt-2 text-gray-600">
                                        {matiere.niveau ? `Matière de ${matiere.niveau.nom}` : 'Matière générale'}
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getCoefficientColor(matiere.coefficient)}`}>
                                            Coefficient: {matiere.coefficient}
                                        </span>
                                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {notesCount} notes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Carte Professeur */}
                        {matiere.professeur && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Professeur Responsable
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                                            <span className="text-green-600 font-bold text-lg">
                                                {matiere.professeur.prenom[0]}{matiere.professeur.nom[0]}
                                            </span>
                                        </div>
                                        <div className="ml-6">
                                            <h4 className="text-xl font-bold text-gray-900">
                                                {matiere.professeur.prenom} {matiere.professeur.nom}
                                            </h4>
                                            <p className="text-gray-600 mt-1">{matiere.professeur.email}</p>
                                            {matiere.professeur.telephone && (
                                                <p className="text-gray-600">{matiere.professeur.telephone}</p>
                                            )}
                                            {matiere.professeur.specialite && (
                                                <p className="text-green-600 font-medium mt-2">
                                                    Spécialité: {matiere.professeur.specialite}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Carte Statistiques */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Statistiques
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                                        <div className="text-2xl font-bold text-blue-600">{notesCount}</div>
                                        <div className="text-sm text-blue-800">Notes</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                                        <div className="text-2xl font-bold text-purple-600">{compositionsCount}</div>
                                        <div className="text-sm text-purple-800">Compositions</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-xl">
                                        <div className="text-2xl font-bold text-green-600">{matiere.coefficient}</div>
                                        <div className="text-sm text-green-800">Coefficient</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {matiere.niveau ? 'Spécifique' : 'Générale'}
                                        </div>
                                        <div className="text-sm text-orange-800">Type</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Rapides */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Actions
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    <Link
                                        href={`/matieres/${matiere.id}/edit`}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Modifier la matière
                                    </Link>
                                    <button
                                        onClick={() => setShowAddComposition(true)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Ajouter à composition
                                    </button>
                                    <Link
                                        href="/notes/create"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Saisir des notes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal d'ajout de composition */}
            {showAddComposition && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                            <h2 className="text-2xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Ajouter à une composition
                            </h2>
                        </div>

                        <form onSubmit={handleAttachComposition} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Sélectionner une composition *
                                </label>
                                <select
                                    value={selectedComposition}
                                    onChange={(e) => setSelectedComposition(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white"
                                    required
                                >
                                    <option value="">Choisir une composition</option>
                                    {compositionsDisponibles.map((composition) => (
                                        <option key={composition.id} value={composition.id}>
                                            {composition.nom} - {composition.classe?.nom} ({composition.trimestre?.annee_scolaire?.nom})
                                        </option>
                                    ))}
                                </select>
                                {compositionsDisponibles.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Aucune composition disponible. Toutes les compositions existantes contiennent déjà cette matière.
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddComposition(false);
                                        setSelectedComposition('');
                                    }}
                                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedComposition}
                                    className="px-6 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
};

export default Show;