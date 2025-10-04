import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '@/Components/Layout';

const ProfesseursIndex = ({ professeurs }) => {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialite, setFilterSpecialite] = useState('');
    const [selectedProfesseurs, setSelectedProfesseurs] = useState([]);

    // Filtrer les professeurs
    const filteredProfesseurs = professeurs.data.filter(professeur =>
        professeur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professeur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professeur.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professeur.specialite?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Spécialités uniques pour le filtre
    const specialites = [...new Set(professeurs.data.map(p => p.specialite).filter(Boolean))];

    // Sélection multiple
    const toggleProfesseurSelection = (professeurId) => {
        setSelectedProfesseurs(prev =>
            prev.includes(professeurId)
                ? prev.filter(id => id !== professeurId)
                : [...prev, professeurId]
        );
    };

    const selectAllProfesseurs = () => {
        setSelectedProfesseurs(filteredProfesseurs.map(professeur => professeur.id));
    };

    const clearSelection = () => {
        setSelectedProfesseurs([]);
    };

    // Statistiques
    const stats = {
        total: professeurs.total,
        avecSpecialite: professeurs.data.filter(p => p.specialite).length,
        avecTelephone: professeurs.data.filter(p => p.telephone).length,
        selected: selectedProfesseurs.length,
    };

    return (
        <Layout title="Gestion des Professeurs">
            <Head title="Professeurs" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* En-tête avec statistiques */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                                </svg>
                                Gestion des Professeurs
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">
                                Gérez le corps professoral de votre établissement
                            </p>
                        </div>

                        <Link
                            href={route('professeurs.create')}
                            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-red-600 to-orange-700 text-white rounded-xl hover:from-red-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="font-semibold">Nouveau Professeur</span>
                        </Link>
                    </div>

                    {/* Cartes de statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-800">Total Professeurs</p>
                                    <p className="text-2xl font-bold text-red-900">{stats.total}</p>
                                </div>
                                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-800">Avec Spécialité</p>
                                    <p className="text-2xl font-bold text-blue-900">{stats.avecSpecialite}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800">Avec Téléphone</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.avecTelephone}</p>
                                </div>
                                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-800">Sélectionnés</p>
                                    <p className="text-2xl font-bold text-purple-900">{stats.selected}</p>
                                </div>
                                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtres et recherche */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher un professeur..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-200 bg-white"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={filterSpecialite}
                                onChange={(e) => setFilterSpecialite(e.target.value)}
                                className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-200 bg-white appearance-none"
                            >
                                <option value="">Toutes spécialités</option>
                                {specialites.map((specialite, index) => (
                                    <option key={index} value={specialite}>
                                        {specialite}
                                    </option>
                                ))}
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>

                        {/* Actions groupées */}
                        {selectedProfesseurs.length > 0 && (
                            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                                <span className="text-sm font-medium text-yellow-800">
                                    {selectedProfesseurs.length} sélectionné(s)
                                </span>
                                <button
                                    onClick={clearSelection}
                                    className="text-yellow-700 hover:text-yellow-900 text-sm font-medium"
                                >
                                    Annuler
                                </button>
                                <Link
                                    as="button"
                                    method="delete"
                                    href={route('professeurs.destroy-multiple')}
                                    data={{ ids: selectedProfesseurs }}
                                    onClick={() => confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProfesseurs.length} professeur(s) ?`)}
                                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
                                >
                                    Supprimer
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message de succès */}
                {flash?.success && (
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{flash.success}</span>
                        </div>
                    </div>
                )}

                {/* Grille des professeurs */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProfesseurs.length > 0 ? (
                        filteredProfesseurs.map((professeur) => (
                            <div
                                key={professeur.id}
                                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-red-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="p-6">
                                    {/* En-tête de la carte */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedProfesseurs.includes(professeur.id)}
                                                onChange={() => toggleProfesseurSelection(professeur.id)}
                                                className="h-4 w-4 text-red-600 rounded focus:ring-red-500 border-gray-300"
                                            />
                                            <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                                                <span className="text-white font-bold text-sm">
                                                    {professeur.prenom.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            ID: {professeur.id}
                                        </div>
                                    </div>

                                    {/* Informations principales */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {professeur.prenom} {professeur.nom}
                                        </h3>
                                        {professeur.specialite && (
                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                {professeur.specialite}
                                            </span>
                                        )}
                                    </div>

                                    {/* Contacts */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <div className="text-sm text-gray-900 truncate">
                                                {professeur.email}
                                            </div>
                                        </div>

                                        {professeur.telephone && (
                                            <div className="flex items-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <div className="text-sm text-gray-900">
                                                    {professeur.telephone}
                                                </div>
                                            </div>
                                        )}

                                        {/* Compte utilisateur */}
                                        <div className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <div className="text-sm text-gray-900">
                                                {professeur.user ? 'Compte actif' : 'Aucun compte'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Métriques */}
                                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="text-lg font-bold text-gray-900">0</div>
                                            <div className="text-xs text-gray-500">Classes</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="text-lg font-bold text-gray-900">0</div>
                                            <div className="text-xs text-gray-500">Cours</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="text-lg font-bold text-gray-900">0</div>
                                            <div className="text-xs text-gray-500">Élèves</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="text-xs text-gray-500">
                                            Créé le {new Date(professeur.created_at).toLocaleDateString('fr-FR')}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={route('professeurs.show', professeur.id)}
                                                className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                                title="Voir détails"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Link>

                                            <Link
                                                href={route('professeurs.edit', professeur.id)}
                                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                                                title="Modifier"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>

                                            <Link
                                                as="button"
                                                method="delete"
                                                href={route('professeurs.destroy', professeur.id)}
                                                onClick={() => confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')}
                                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                                title="Supprimer"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun professeur trouvé</h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm || filterSpecialite ? 
                                        "Aucun professeur ne correspond à vos critères de recherche." :
                                        "Commencez par créer votre premier professeur."
                                    }
                                </p>
                                {(searchTerm || filterSpecialite) ? (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterSpecialite('');
                                        }}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                ) : (
                                    <Link
                                        href={route('professeurs.create')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Créer un professeur
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {professeurs.links && professeurs.links.length > 3 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
                        <nav className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Affichage de {professeurs.from} à {professeurs.to} sur {professeurs.total} professeurs
                            </div>
                            <div className="flex space-x-1">
                                {professeurs.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            link.active
                                                ? 'bg-red-600 text-white shadow-md'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ProfesseursIndex;