import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ compositions, trimestres, classes, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.q || '');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingComposition, setEditingComposition] = useState(null);
    const [formData, setFormData] = useState({
        trimestre_id: '',
        classe_id: '',
        nom: '',
        date: '',
        langue: 'fr'
    });

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        router.get('/compositions', { q: value }, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handleDelete = (composition) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la composition "${composition.nom}" ?`)) {
            router.delete(`/compositions/${composition.id}`);
        }
    };

    const handleCreate = () => {
        setFormData({
            trimestre_id: '',
            classe_id: '',
            nom: '',
            date: '',
            langue: 'fr'
        });
        setShowCreateModal(true);
    };

    const handleEdit = (composition) => {
        setFormData({
            trimestre_id: composition.trimestre_id,
            classe_id: composition.classe_id,
            nom: composition.nom,
            date: composition.date,
            langue: composition.langue || 'fr'
        });
        setEditingComposition(composition);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingComposition) {
            router.put(`/compositions/${editingComposition.id}`, formData, {
                onSuccess: () => {
                    setEditingComposition(null);
                    setFormData({ trimestre_id: '', classe_id: '', nom: '', date: '', langue: 'fr' });
                }
            });
        } else {
            router.post('/compositions', formData, {
                onSuccess: () => {
                    setShowCreateModal(false);
                    setFormData({ trimestre_id: '', classe_id: '', nom: '', date: '', langue: 'fr' });
                }
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const resetForm = () => {
        setFormData({ trimestre_id: '', classe_id: '', nom: '', date: '', langue: 'fr' });
        setEditingComposition(null);
        setShowCreateModal(false);
    };

    return (
        <AppLayout>
            <Head title="Gestion des Compositions" />

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

            <div className="max-w-7xl mx-auto">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Gestion des Compositions
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Organisez les compositions et évaluations
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <Link
                                href="/compositions/create"
                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvelle Composition
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher une composition..."
                                    defaultValue={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liste des Compositions */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Liste des Compositions ({compositions.total})
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Classe</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trimestre</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Langue</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Matières</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {compositions.data.map((composition) => (
                                    <tr key={composition.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{composition.nom}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {composition.matieres_count} matière(s)
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {composition.classe?.nom || 'N/A'}
                                                {composition.classe?.niveau && (
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({composition.classe.niveau.nom})
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {composition.trimestre?.nom || 'N/A'}
                                                {composition.trimestre?.annee_scolaire && (
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({composition.trimestre.annee_scolaire.nom})
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {formatDate(composition.date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {composition.langue ? composition.langue.toUpperCase() : 'FR'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {composition.matieres_count} matière(s)
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {composition.notes_count} note(s) saisie(s)
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/compositions/${composition.id}`}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Voir détails"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={`/compositions/${composition.id}/edit`}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(composition)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
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

                    {/* Message vide */}
                    {compositions.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune composition trouvée</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search ? 'Aucune composition ne correspond à votre recherche.' : 'Commencez par créer votre première composition.'}
                            </p>
                            <Link
                                href="/compositions/create"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer la première composition
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {compositions.data.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="text-sm text-gray-700">
                                Affichage de <span className="font-semibold">{compositions.from}</span> à <span className="font-semibold">{compositions.to}</span> sur <span className="font-semibold">{compositions.total}</span> résultats
                            </div>
                            <div className="flex space-x-1">
                                {compositions.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => router.get(link.url || '#')}
                                        disabled={!link.url}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${link.active
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                                            : link.url
                                                ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de création/édition */}
            {(showCreateModal || editingComposition) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                            <h2 className="text-2xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                {editingComposition ? 'Modifier la Composition' : 'Nouvelle Composition'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom de la composition *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    placeholder="Ex: Composition de Mathématiques"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Trimestre *
                                </label>
                                <select
                                    value={formData.trimestre_id}
                                    onChange={(e) => setFormData({ ...formData, trimestre_id: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    required
                                >
                                    <option value="">Sélectionner un trimestre</option>
                                    {trimestres && trimestres.map((trimestre) => (
                                        <option key={trimestre.id} value={trimestre.id}>
                                            {trimestre.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Classe *
                                </label>
                                <select
                                    value={formData.classe_id}
                                    onChange={(e) => setFormData({ ...formData, classe_id: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    required
                                >
                                    <option value="">Sélectionner une classe</option>
                                    {classes && classes.map((classe) => (
                                        <option key={classe.id} value={classe.id}>
                                            {classe.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Langue *
                                </label>
                                <select
                                    value={formData.langue}
                                    onChange={(e) => setFormData({ ...formData, langue: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    required
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">Anglais</option>
                                    <option value="ar">Arabe</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {editingComposition ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
};

export default Index;