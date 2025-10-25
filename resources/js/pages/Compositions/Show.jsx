// resources/js/Pages/Compositions/Show.jsx
import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Show = ({ composition, matieresDisponibles, statistiques }) => {
    const { flash } = usePage().props;
    const [selectedMatiere, setSelectedMatiere] = useState('');
    const [showAddMatiere, setShowAddMatiere] = useState(false);

    const handleDelete = () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la composition "${composition.nom}" ?`)) {
            router.delete(`/compositions/${composition.id}`);
        }
    };

    const handleAttachMatiere = (e) => {
        e.preventDefault();
        if (!selectedMatiere) return;

        router.post(`/compositions/${composition.id}/attach-matiere`, {
            matiere_id: selectedMatiere
        }, {
            onSuccess: () => {
                setSelectedMatiere('');
                setShowAddMatiere(false);
            }
        });
    };

    const handleDetachMatiere = (matiereId) => {
        if (confirm('Retirer cette matière de la composition ?')) {
            router.delete(`/compositions/${composition.id}/detach-matiere/${matiereId}`);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AppLayout>
            <Head title={`Composition ${composition.nom}`} />

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
                            <Link href="/compositions" className="mr-4">
                                <button className="inline-flex items-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {composition.nom}
                                </h1>
                                <p className="text-blue-100 mt-2 text-lg">
                                    {composition.classe?.nom} • {composition.trimestre?.nom}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-0 flex space-x-3">
                            <Link
                                href={`/compositions/${composition.id}/edit`}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                            </Link>
                            <Link
                                href={`/notes/multiple/create?composition_id=${composition.id}`}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-xl text-white hover:bg-green-500/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Saisir notes
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Informations Générales
                                </h3>
                            </div>
                            <div className="p-6">
                                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nom</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{composition.nom}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Date</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{formatDate(composition.date)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Classe</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">
                                            {composition.classe?.nom} ({composition.classe?.niveau?.nom})
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Trimestre</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">
                                            {composition.trimestre?.nom} ({composition.trimestre?.annee_scolaire?.nom})
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Langue</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">
                                            {composition.langue?.toUpperCase() || 'FR'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Élèves</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{statistiques?.total_eleves}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Matières</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{statistiques?.total_matieres}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Notes saisies</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{statistiques?.total_notes}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Carte Matières */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-6 py-5 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Matières ({composition.matieres.length})
                                    </h3>
                                    <button
                                        onClick={() => setShowAddMatiere(true)}
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
                                {composition.matieres.length > 0 ? (
                                    <div className="space-y-4">
                                        {composition.matieres.map((matiere) => {
                                            const notesCount = composition.notes?.filter(n => n.matiere_id === matiere.id).length || 0;
                                            const pourcentage = statistiques?.total_eleves > 0 ?
                                                Math.round((notesCount / statistiques?.total_eleves) * 100) : 0;

                                            return (
                                                <div key={matiere.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-lg font-semibold text-gray-900">{matiere.nom}</h4>
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${matiere.coefficient >= 5 ? 'bg-red-100 text-red-800' :
                                                                    matiere.coefficient >= 3 ? 'bg-orange-100 text-orange-800' :
                                                                        'bg-green-100 text-green-800'
                                                                }`}>
                                                                Coef. {matiere.coefficient}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {matiere.professeur && (
                                                                <span className="font-medium">Professeur:</span>
                                                            )} {matiere.professeur ?
                                                                `${matiere.professeur.prenom} ${matiere.professeur.nom}` :
                                                                'Non assigné'
                                                            }
                                                        </div>
                                                        <div className="flex items-center mt-2">
                                                            <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                                                                <div
                                                                    className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                                                                    style={{ width: `${pourcentage}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs text-gray-600 whitespace-nowrap">
                                                                {notesCount}/{statistiques?.total_eleves} ({pourcentage}%)
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 ml-4">
                                                        <Link
                                                            href={`/notes/multiple/create?composition_id=${composition.id}&matiere_id=${matiere.id}`}
                                                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Saisir notes"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDetachMatiere(matiere.id)}
                                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Retirer matière"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <p>Aucune matière associée</p>
                                        <p className="text-sm mt-1">Ajoutez des matières pour pouvoir saisir des notes</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Carte Statistiques détaillées */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Progression de saisie
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {statistiques?.notes_par_matiere?.map((stat, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-700">{stat.matiere}</span>
                                                <span className="text-gray-600">
                                                    {stat?.notes_count}/{statistiques?.total_eleves} ({stat?.pourcentage}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ${stat?.pourcentage === 100 ? 'bg-green-500' :
                                                            stat?.pourcentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${stat?.pourcentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Profil de la Composition */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {composition.nom}
                                    </h3>
                                    <div className="mt-2 text-gray-600">
                                        {composition?.classe?.nom}
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {statistiques?.total_matieres} matières
                                        </span>
                                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            {statistiques?.total_notes} notes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                        <div className="text-2xl font-bold text-blue-600">{statistiques?.total_eleves}</div>
                                        <div className="text-sm text-blue-800">Élèves</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                                        <div className="text-2xl font-bold text-purple-600">{statistiques?.total_matieres}</div>
                                        <div className="text-sm text-purple-800">Matières</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-xl">
                                        <div className="text-2xl font-bold text-green-600">{statistiques?.total_notes}</div>
                                        <div className="text-sm text-green-800">Notes</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {statistiques?.total_eleves > 0 ?
                                                Math.round((statistiques?.total_notes / (statistiques?.total_eleves * statistiques?.total_matieres)) * 100) : 0
                                            }%
                                        </div>
                                        <div className="text-sm text-orange-800">Complétion</div>
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
                                        href={`/notes/multiple/create?composition_id=${composition.id}`}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Saisir notes
                                    </Link>
                                    <button
                                        onClick={() => setShowAddMatiere(true)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Ajouter matière
                                    </button>
                                    <Link
                                        href={`/compositions/${composition.id}/edit`}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Modifier
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal d'ajout de matière */}
            {showAddMatiere && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                            <h2 className="text-2xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Ajouter une matière
                            </h2>
                        </div>

                        <form onSubmit={handleAttachMatiere} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Sélectionner une matière *
                                </label>
                                <select
                                    value={selectedMatiere}
                                    onChange={(e) => setSelectedMatiere(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white"
                                    required
                                >
                                    <option value="">Choisir une matière</option>
                                    {matieresDisponibles.map((matiere) => (
                                        <option key={matiere.id} value={matiere.id}>
                                            {matiere.nom} (Coef. {matiere.coefficient})
                                            {matiere.niveau && ` - ${matiere.niveau.nom}`}
                                        </option>
                                    ))}
                                </select>
                                {matieresDisponibles.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Toutes les matières disponibles sont déjà associées à cette composition.
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddMatiere(false);
                                        setSelectedMatiere('');
                                    }}
                                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedMatiere}
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