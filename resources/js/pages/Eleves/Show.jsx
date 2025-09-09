import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Show() {
    const { eleve } = usePage().props;

    // Calculer l'âge à partir de la date de naissance
    const calculateAge = (birthDate) => {
        if (!birthDate) return "N/A";
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    // Formater la date de naissance
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* En-tête */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Détails de l'élève
                            </h1>
                            <p className="text-gray-600 mt-1">Informations complètes de {eleve.prenom} {eleve.nom}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={route("eleves.index")}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Retour
                            </Link>

                            <Link
                                // href={route("eleves.edit", eleve.id)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Carte de profil */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Photo de profil */}
                        <div className="md:w-1/3 p-6 bg-gray-50 flex flex-col items-center justify-center">
                            {eleve.photo ? (
                                <img
                                    src={`/storage/${eleve.photo}`}
                                    alt={`${eleve.prenom} ${eleve.nom}`}
                                    className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-48 h-48 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-6xl font-bold border-4 border-white shadow-md">
                                    {eleve?.prenom?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div className="mt-6 text-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${eleve.sexe === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {eleve.sexe === 'M' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        )}
                                    </svg>
                                    {eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}
                                </span>
                            </div>
                        </div>

                        {/* Informations détaillées */}
                        <div className="md:w-2/3 p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{eleve.prenom} {eleve.nom}</h2>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    UID: {eleve.uid}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-sm font-medium text-blue-800">Identité</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-blue-600">Prénom</p>
                                            <p className="text-sm font-medium">{eleve.prenom || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-600">Nom</p>
                                            <p className="text-sm font-medium">{eleve.nom || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm font-medium text-green-800">Naissance</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-green-600">Date de naissance</p>
                                            <p className="text-sm font-medium">{formatDate(eleve.date_naissance)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-green-600">Âge</p>
                                            <p className="text-sm font-medium">{calculateAge(eleve.date_naissance)} ans</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <span className="text-sm font-medium text-purple-800">Sexe</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {eleve.sexe === 'M' ? 'Masculin' : eleve.sexe === 'F' ? 'Féminin' : 'N/A'}
                                    </p>
                                </div>

                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm font-medium text-yellow-800">Photo</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {eleve.photo ? "Photo disponible" : "Aucune photo"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistiques ou informations supplémentaires */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600">{calculateAge(eleve.date_naissance)}</div>
                        <div className="text-sm text-gray-600">Ans</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {eleve.date_naissance ? formatDate(eleve.date_naissance).split(' ')[2] : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Année de naissance</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {eleve.sexe ? (eleve.sexe === 'M' ? 'Garçon' : 'Fille') : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Sexe</div>
                    </div>
                </div>
            </div>
        </div>
    );
}