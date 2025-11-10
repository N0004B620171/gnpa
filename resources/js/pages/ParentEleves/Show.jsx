import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Show = ({ parent }) => {
    const { flash } = usePage().props;

    const handleDelete = () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${parent.prenom} ${parent.nom} ?`)) {
            router.delete(`/parents/${parent.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title={`${parent.prenom} ${parent.nom}`} />

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
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center">
                            <Link href="/parents" className="mr-4">
                                <button className="inline-flex items-center p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {parent.prenom} {parent.nom}
                                </h1>
                                <p className="text-blue-100 mt-2 text-lg">
                                    Informations détaillées du parent
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-0 flex space-x-3">
                            <Link
                                href={`/parents/${parent.id}/edit`}
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
                        {/* Carte Informations Personnelles */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Informations Personnelles
                                </h3>
                            </div>
                            <div className="p-6">
                                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Prénom</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{parent.prenom}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nom</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{parent.nom}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">{parent.email}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Téléphone</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">
                                            {parent.telephone || <span className="text-gray-400">Non renseigné</span>}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Adresse</dt>
                                        <dd className="mt-2 text-lg font-medium text-gray-900">
                                            {parent.adresse || <span className="text-gray-400">Non renseignée</span>}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Carte Compte Utilisateur */}
                        {parent.user && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Compte Utilisateur
                                    </h3>
                                </div>
                                <div className="p-6">
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
                                                Le parent peut se connecter avec l'email {parent.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Profil */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                                        <span className="text-blue-600 font-bold text-2xl">
                                            {parent.prenom[0]}{parent.nom[0]}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {parent.prenom} {parent.nom}
                                    </h3>
                                    <div className="mt-3 space-y-2">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            Parent d'élève
                                        </span>
                                        {parent.user && (
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                Compte actif
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enfants */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                    Enfants ({parent.eleves?.length || 0})
                                </h3>
                            </div>
                            <div className="p-6">
                                {parent.eleves && parent.eleves.length > 0 ? (
                                    <ul className="space-y-4">
                                        {parent.eleves.map((eleve) => (
                                            <li key={eleve.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div className="flex-1">
                                                    <div className="text-lg font-medium text-gray-900">
                                                        {eleve.prenom} {eleve.nom}
                                                    </div>
                                                    {eleve.inscriptions?.[0] && (
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            {eleve.inscriptions[0].classe?.niveau?.nom}  {eleve.inscriptions[0].classe?.nom}
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        <p className="text-gray-500">Aucun enfant associé</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Show;