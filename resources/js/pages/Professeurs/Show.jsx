import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Layout from '@/Components/Layout';

export default function Show() {
    const { professeur } = usePage().props;

    return (
        <Layout title={`Détails de ${professeur.prenom} ${professeur.nom}`}>
            <div className="max-w-4xl mx-auto">
                {/* En-tête */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center">
                            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <span className="text-2xl font-bold text-blue-600">
                                    {professeur.prenom.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {professeur.prenom} {professeur.nom}
                                </h1>
                                <p className="text-gray-600">Détails du professeur</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('professeurs.edit', professeur.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                            </Link>
                            <Link
                                href={route('professeurs.index')}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Retour
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Informations */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Informations personnelles
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Prénom</label>
                                <p className="text-sm text-gray-900">{professeur.prenom}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Nom</label>
                                <p className="text-sm text-gray-900">{professeur.nom}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                <a href={`mailto:${professeur.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                                    {professeur.email}
                                </a>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                                <p className="text-sm text-gray-900">
                                    {professeur.telephone ? (
                                        <a href={`tel:${professeur.telephone}`} className="text-gray-600 hover:text-gray-800">
                                            {professeur.telephone}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Non renseigné</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Spécialité</label>
                                <p className="text-sm text-gray-900">
                                    {professeur.specialite || (
                                        <span className="text-gray-400">Non renseignée</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">ID Utilisateur</label>
                                <p className="text-sm text-gray-900">{professeur.user_id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Métadonnées */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Métadonnées
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">ID</label>
                            <p className="text-sm text-gray-900">{professeur.id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">UID</label>
                            <p className="text-sm text-gray-900">{professeur.uid}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Créé le</label>
                            <p className="text-sm text-gray-900">
                                {new Date(professeur.created_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Modifié le</label>
                            <p className="text-sm text-gray-900">
                                {new Date(professeur.updated_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}