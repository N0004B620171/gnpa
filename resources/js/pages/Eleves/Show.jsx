import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '@/Components/Layout';

const ElevesShow = ({ eleve }) => {
    // Calculer l'âge
    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Formater la date
    const formatDate = (dateString) => {
        if (!dateString) return "Non renseignée";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Layout title={`Détails - ${eleve.prenom} ${eleve.nom}`}>
            <Head title={`${eleve.prenom} ${eleve.nom}`} />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                {eleve.photo ? (
                                    <img 
                                        src={`/storage/${eleve.photo}`} 
                                        alt={`${eleve.prenom} ${eleve.nom}`}
                                        className="h-20 w-20 rounded-2xl object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-bold text-3xl">
                                        {eleve.prenom.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {eleve.prenom} {eleve.nom}
                                </h1>
                                <p className="text-gray-600 mt-1">Élève</p>
                                {eleve.uid && (
                                    <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                                        UID: {eleve.uid}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('eleves.edit', eleve.id)}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                            </Link>
                            <Link
                                href={route('eleves.index')}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Retour
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Grille d'informations */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informations personnelles */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Informations personnelles
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-sm font-medium text-gray-500">ID</span>
                                <span className="text-sm font-mono text-gray-900">{eleve.id}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-sm font-medium text-gray-500">Prénom</span>
                                <span className="text-sm text-gray-900">{eleve.prenom}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-sm font-medium text-gray-500">Nom</span>
                                <span className="text-sm text-gray-900">{eleve.nom}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-sm font-medium text-gray-500">Date de naissance</span>
                                <span className="text-sm text-gray-900">{formatDate(eleve.date_naissance)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-sm font-medium text-gray-500">Âge</span>
                                <span className="text-sm text-gray-900">
                                    {eleve.date_naissance ? `${calculateAge(eleve.date_naissance)} ans` : 'Non spécifié'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm font-medium text-gray-500">Sexe</span>
                                <span className="text-sm text-gray-900">
                                    {eleve.sexe ? (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            eleve.sexe === 'M' 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-pink-100 text-pink-800'
                                        }`}>
                                            {eleve.sexe === 'M' ? 'Garçon' : 'Fille'}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">Non spécifié</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Photo et métadonnées */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Photo
                        </h2>
                        <div className="text-center">
                            {eleve.photo ? (
                                <div className="space-y-4">
                                    <img 
                                        src={`/storage/${eleve.photo}`} 
                                        alt={`${eleve.prenom} ${eleve.nom}`}
                                        className="h-48 w-48 mx-auto rounded-2xl object-cover border-2 border-gray-200 shadow-md"
                                    />
                                    <div className="text-sm text-gray-600">
                                        Photo de profil
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-600">Aucune photo</p>
                                    <p className="text-sm text-gray-500 mt-1">Aucune photo de profil</p>
                                </div>
                            )}
                        </div>

                        {/* Métadonnées */}
                        <div className="mt-6 space-y-3 text-sm">
                            <div className="flex justify-between items-center py-2 border-t border-gray-200">
                                <span className="text-gray-500">Date d'inscription</span>
                                <span className="text-gray-900">{formatDate(eleve.created_at)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-t border-gray-200">
                                <span className="text-gray-500">Dernière modification</span>
                                <span className="text-gray-900">{formatDate(eleve.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section informations scolaires */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                        </svg>
                        Informations scolaires
                    </h2>
                    <div className="text-center py-8 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                        </svg>
                        <p className="text-gray-600">Aucune information scolaire pour le moment</p>
                        <p className="text-sm text-gray-500 mt-1">Les classes et notes apparaîtront ici</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ElevesShow;