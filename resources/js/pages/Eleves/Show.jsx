import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Show = ({ eleve }) => {
    const { flash } = usePage().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'Non renseignée';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDelete = () => {
        router.delete(`/eleves/${eleve.id}`, {
            onSuccess: () => setShowDeleteModal(false)
        });
    };

    const getInscriptionActuelle = () => {
        return eleve.inscriptions?.find(ins => ins.statut === 'actif');
    };

    const inscriptionActuelle = getInscriptionActuelle();

    return (
        <>
            {/* Modal de suppression */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Confirmer la suppression
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Êtes-vous sûr de vouloir supprimer <strong>{eleve.prenom} {eleve.nom}</strong> ? Cette action est irréversible.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-xl hover:from-red-700 hover:to-pink-800 transition-all duration-200"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AppLayout>
                <Head title={`${eleve.prenom} ${eleve.nom}`} />

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

                <div className="max-w-7xl mx-auto">
                    {/* En-tête avec gradient */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center">
                                <Link href="/eleves" className="mr-4">
                                    <button className="inline-flex items-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                    </button>
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        {eleve.prenom} {eleve.nom}
                                    </h1>
                                    <p className="text-emerald-100 mt-2 text-lg">
                                        Profil détaillé de l'élève
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 lg:mt-0 flex space-x-3">
                                <Link
                                    href={`/eleves/${eleve.id}/edit`}
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Modifier
                                </Link>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
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
                            {/* Carte Informations Personnelles */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-50 to-emerald-50 px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Informations Personnelles
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Prénom</dt>
                                            <dd className="mt-2 text-lg font-medium text-gray-900">{eleve.prenom}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nom</dt>
                                            <dd className="mt-2 text-lg font-medium text-gray-900">{eleve.nom}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Date de naissance</dt>
                                            <dd className="mt-2 text-lg font-medium text-gray-900">
                                                {formatDate(eleve.date_naissance)}
                                                {eleve.age && (
                                                    <span className="ml-2 text-sm text-emerald-600">
                                                        ({eleve.age} ans)
                                                    </span>
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Sexe</dt>
                                            <dd className="mt-2 text-lg font-medium text-gray-900">
                                                {eleve.sexe === 'M' ? '👦 Masculin' : eleve.sexe === 'F' ? '👧 Féminin' : 'Non renseigné'}
                                            </dd>
                                        </div>
                                        {eleve.photo && (
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Photo</dt>
                                                <dd className="mt-2">
                                                    <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden">
                                                        <img 
                                                            src={eleve.photo} 
                                                            alt={`${eleve.prenom} ${eleve.nom}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {/* Inscriptions */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                                        </svg>
                                        Parcours Scolaire
                                    </h3>
                                </div>
                                <div className="p-6">
                                    {eleve.inscriptions && eleve.inscriptions.length > 0 ? (
                                        <div className="space-y-4">
                                            {eleve.inscriptions.map((inscription) => (
                                                <div 
                                                    key={inscription.id} 
                                                    className={`p-4 rounded-xl border-2 ${
                                                        inscription.statut === 'actif' 
                                                            ? 'bg-emerald-50 border-emerald-200' 
                                                            : 'bg-gray-50 border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-lg font-semibold text-gray-900">
                                                                {inscription.classe?.niveau?.cycle?.nom} - {inscription.classe?.niveau?.nom} {inscription.classe?.nom}
                                                            </div>
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                Année scolaire: {inscription.annee_scolaire?.nom}
                                                            </div>
                                                            <div className="text-xs text-emerald-600 mt-1">
                                                                UID: {inscription.uid}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                                inscription.statut === 'actif'
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {inscription.statut === 'actif' ? 'Actuelle' : 'Ancienne'}
                                                            </span>
                                                            <div className="text-sm text-gray-500">
                                                                {inscription.created_at_formatted}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                            </svg>
                                            <p className="text-gray-500">Aucune inscription trouvée</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Profil */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="text-center">
                                        <div className="mx-auto h-24 w-24 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4">
                                            {eleve.photo ? (
                                                <img 
                                                    src={eleve.photo} 
                                                    alt={`${eleve.prenom} ${eleve.nom}`}
                                                    className="w-full h-full object-cover rounded-2xl"
                                                />
                                            ) : (
                                                <span className="text-emerald-600 font-bold text-2xl">
                                                    {eleve.prenom[0]}{eleve.nom[0]}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {eleve.prenom} {eleve.nom}
                                        </h3>
                                        <div className="mt-3 space-y-2">
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                                                Élève
                                            </span>
                                            {inscriptionActuelle && (
                                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                    {inscriptionActuelle.classe?.niveau?.cycle?.nom}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Parent */}
                            {eleve.parent_eleve && (
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-5 border-b border-gray-200">
                                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                            Parent / Tuteur
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            <div>
                                                <div className="text-lg font-semibold text-gray-900">
                                                    {eleve.parent_eleve.prenom} {eleve.parent_eleve.nom}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">{eleve.parent_eleve.email}</div>
                                            </div>
                                            {eleve.parent_eleve.telephone && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {eleve.parent_eleve.telephone}
                                                </div>
                                            )}
                                            {eleve.parent_eleve.adresse && (
                                                <div className="text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {eleve.parent_eleve.adresse}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <Link
                                                href={`/parents/${eleve.parent_eleve.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                            >
                                                Voir le profil complet
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Statistiques rapides */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Statistiques
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Inscriptions totales</span>
                                            <span className="text-lg font-semibold text-gray-900">
                                                {eleve.inscriptions?.length || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Notes enregistrées</span>
                                            <span className="text-lg font-semibold text-gray-900">
                                                {eleve.notes?.length || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Bulletins générés</span>
                                            <span className="text-lg font-semibold text-gray-900">
                                                {eleve.bulletins?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
};

export default Show;