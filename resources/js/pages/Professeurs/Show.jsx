import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Show = ({ professeur }) => {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('informations');

    const handleDelete = () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${professeur.prenom} ${professeur.nom} ?`)) {
            router.delete(`/professeurs/${professeur.id}`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('fr-FR');
        } catch (error) {
            return 'Date invalide';
        }
    };

    const getEtatColor = (etat) => {
        const colors = {
            'bon': 'bg-green-100 text-green-800',
            'endommagé': 'bg-orange-100 text-orange-800',
            'perdu': 'bg-red-100 text-red-800'
        };
        return colors[etat] || 'bg-gray-100 text-gray-800';
    };

    const getEtatLabel = (etat) => {
        const labels = {
            'bon': 'Bon',
            'endommagé': 'Endommagé',
            'perdu': 'Perdu'
        };
        return labels[etat] || etat;
    };

    // Statistiques inventaire
    const inventaires = professeur.inventaires || [];
    const statsInventaire = {
        total: inventaires.length,
        bon: inventaires.filter(inv => inv.etat === 'bon').length,
        endommage: inventaires.filter(inv => inv.etat === 'endommagé').length,
        perdu: inventaires.filter(inv => inv.etat === 'perdu').length,
        totalQuantite: inventaires.reduce((sum, inv) => sum + inv.quantite, 0)
    };

    return (
        <AppLayout>
            <Head title={`${professeur.prenom} ${professeur.nom}`} />

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

                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center">
                            <Link href="/professeurs" className="mr-4">
                                <button className="inline-flex items-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {professeur.prenom} {professeur.nom}
                                </h1>
                                <p className="text-indigo-100 mt-2 text-lg">
                                    Informations détaillées du professeur
                                </p>
                                <div className="flex flex-wrap gap-4 mt-3 text-indigo-200 text-sm">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {professeur.specialite || 'Spécialité non définie'}
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {professeur.email}
                                    </div>
                                    {professeur.telephone && (
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {professeur.telephone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-0 flex space-x-3">
                            <Link
                                href={`/inventaires-enseignants/create?professeur_id=${professeur.id}`}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white transition-all duration-200 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Ajouter Matériel
                            </Link>
                            <Link
                                href={`/professeurs/${professeur.id}/edit`}
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

                {/* Navigation par onglets */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px overflow-x-auto">
                            {['informations', 'classes', 'matieres', 'inventaire'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 min-w-0 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === tab
                                        ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab === 'informations' && (
                                        <>
                                            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Informations
                                        </>
                                    )}
                                    {tab === 'classes' && (
                                        <>
                                            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            Classes ({professeur.classes?.length || 0})
                                        </>
                                    )}
                                    {tab === 'matieres' && (
                                        <>
                                            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            Matières ({professeur.matieres?.length || 0})
                                        </>
                                    )}
                                    {tab === 'inventaire' && (
                                        <>
                                            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Inventaire ({statsInventaire.total})
                                        </>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Onglet Informations */}
                        {activeTab === 'informations' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Informations Personnelles */}
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Informations Personnelles
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="font-medium text-blue-700">Prénom :</span>
                                                    <p className="text-blue-900 font-semibold">{professeur.prenom}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Nom :</span>
                                                    <p className="text-blue-900 font-semibold">{professeur.nom}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Email :</span>
                                                    <p className="text-blue-900">{professeur.email}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">Téléphone :</span>
                                                    <p className="text-blue-900">
                                                        {professeur.telephone || <span className="text-gray-400">Non renseigné</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-blue-200">
                                                <span className="font-medium text-blue-700">Spécialité :</span>
                                                <p className="text-blue-900 font-semibold">
                                                    {professeur.specialite || <span className="text-gray-400">Non spécifiée</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compte Utilisateur */}
                                    {professeur.user && (
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Compte Utilisateur
                                            </h3>
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center">
                                                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-6">
                                                    <div className="text-xl font-semibold text-gray-900">
                                                        Compte activé
                                                    </div>
                                                    <div className="text-gray-600 mt-1">
                                                        Le professeur peut se connecter avec l'email {professeur.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Profil */}
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                                    <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profil
                                    </h3>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-20 w-20 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                                            <span className="text-purple-600 font-bold text-2xl">
                                                {professeur.prenom[0]}{professeur.nom[0]}
                                            </span>
                                        </div>
                                        <div className="ml-6">
                                            <h4 className="text-2xl font-bold text-gray-900">
                                                {professeur.prenom} {professeur.nom}
                                            </h4>
                                            <div className="mt-2 space-y-2">
                                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                                    Professeur
                                                </span>
                                                {professeur.user && (
                                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        Compte actif
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Onglet Classes */}
                        {activeTab === 'classes' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Classes Assignées ({professeur.classes?.length || 0})
                                    </h3>
                                </div>

                                {professeur.classes && professeur.classes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {professeur.classes.map((classe) => (
                                            <div key={classe.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-indigo-300 transition-all duration-200">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-xl font-bold text-gray-900">
                                                        {classe.nom}
                                                    </h4>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                        {classe.niveau?.nom}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex justify-between">
                                                        <span>Cycle :</span>
                                                        <span className="font-medium">{classe.niveau?.cycle?.nom}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Capacité :</span>
                                                        <span className="font-medium">{classe.capacite} élèves</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <p className="text-gray-500">Aucune classe assignée à ce professeur</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Matières */}
                        {activeTab === 'matieres' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Matières Enseignées ({professeur.matieres?.length || 0})
                                    </h3>
                                </div>

                                {professeur.matieres && professeur.matieres.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {professeur.matieres.map((matiere) => (
                                            <div key={matiere.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-all duration-200">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-xl font-bold text-gray-900">
                                                        {matiere.nom}
                                                    </h4>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                        Coef. {matiere.coefficient}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    {matiere.niveau && (
                                                        <div className="flex justify-between">
                                                            <span>Niveau :</span>
                                                            <span className="font-medium">{matiere.niveau.nom}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <p className="text-gray-500">Aucune matière assignée à ce professeur</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Onglet Inventaire */}
                        {activeTab === 'inventaire' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Inventaire du Professeur ({statsInventaire.total})
                                    </h3>
                                    <Link
                                        href={`/inventaires-enseignants/create?professeur_id=${professeur.id}`}
                                        className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Ajouter du Matériel
                                    </Link>
                                </div>

                                {/* Statistiques inventaire */}
                                {statsInventaire.total > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 text-center">
                                            <div className="text-2xl font-bold text-blue-600">{statsInventaire.totalQuantite}</div>
                                            <div className="text-sm text-blue-700">Total matériels</div>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 text-center">
                                            <div className="text-2xl font-bold text-green-600">{statsInventaire.bon}</div>
                                            <div className="text-sm text-green-700">En bon état</div>
                                        </div>
                                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 text-center">
                                            <div className="text-2xl font-bold text-orange-600">{statsInventaire.endommage}</div>
                                            <div className="text-sm text-orange-700">Endommagés</div>
                                        </div>
                                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200 text-center">
                                            <div className="text-2xl font-bold text-red-600">{statsInventaire.perdu}</div>
                                            <div className="text-sm text-red-700">Perdus</div>
                                        </div>
                                    </div>
                                )}

                                {/* Liste de l'inventaire */}
                                {inventaires.length > 0 ? (
                                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-200">
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Matériel</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantité</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">État</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date attribution</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date retour</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Observation</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {inventaires.map((inventaire) => (
                                                        <tr key={inventaire.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                                        <span className="text-purple-600 font-bold">
                                                                            {inventaire.materiel?.nom?.[0] || 'M'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {inventaire.materiel?.nom || 'Matériel inconnu'}
                                                                        </div>
                                                                        {inventaire.materiel?.reference && (
                                                                            <div className="text-xs text-gray-500">
                                                                                Ref: {inventaire.materiel.reference}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                                    {inventaire.quantite}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEtatColor(inventaire.etat)}`}>
                                                                    {getEtatLabel(inventaire.etat)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {formatDate(inventaire.date_attribution)}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {formatDate(inventaire.date_retour) || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {inventaire.observation || '-'}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex space-x-2">
                                                                    <Link
                                                                        href={`/inventaires-enseignants/${inventaire.id}/edit`}
                                                                        className="inline-flex items-center p-1 text-green-600 hover:text-green-800 transition-colors"
                                                                        title="Modifier"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => {
                                                                            if (confirm('Êtes-vous sûr de vouloir supprimer ce matériel de l\'inventaire ?')) {
                                                                                router.delete(`/inventaires-enseignants/${inventaire.id}`);
                                                                            }
                                                                        }}
                                                                        className="inline-flex items-center p-1 text-red-600 hover:text-red-800 transition-colors"
                                                                        title="Supprimer"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <p className="text-gray-500">Aucun matériel dans l'inventaire de ce professeur</p>
                                        <Link
                                            href={`/inventaires-enseignants/create?professeur_id=${professeur.id}`}
                                            className="mt-4 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Ajouter du matériel
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Show;