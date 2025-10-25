import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const BulletinIndex = ({ bulletins, classes, trimestres, anneesScolaires, filters, stats }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [classeId, setClasseId] = useState(filters.classe_id || '');
    const [trimestreId, setTrimestreId] = useState(filters.trimestre_id || '');
    const [anneeScolaireId, setAnneeScolaireId] = useState(filters.annee_scolaire_id || '');
    const [annuel, setAnnuel] = useState(filters.annuel || false);
    const [perPage, setPerPage] = useState(filters.perPage || 20);
    const [showBulkGenerate, setShowBulkGenerate] = useState(false);
    const [bulkForm, setBulkForm] = useState({
        classe_id: '',
        trimestre_id: '',
        annuel: false
    });

    const handleFilter = () => {
        router.get('/bulletins', {
            search,
            classe_id: classeId,
            trimestre_id: trimestreId,
            annee_scolaire_id: anneeScolaireId,
            annuel: annuel,
            perPage
        }, {
            preserveState: true,
            replace: true
        });
    };

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        setSearch(value);
        router.get('/bulletins', {
            search: value,
            classe_id: classeId,
            trimestre_id: trimestreId,
            annee_scolaire_id: anneeScolaireId,
            annuel: annuel,
            perPage
        }, {
            preserveState: true,
            replace: true
        });
    }, 500);

    const handleBulkGenerate = (e) => {
        e.preventDefault();
        if (!bulkForm.classe_id || (!bulkForm.trimestre_id && !bulkForm.annuel)) {
            alert('Veuillez sélectionner une classe et un trimestre');
            return;
        }

        router.post('/bulletins/bulk-generate', bulkForm, {
            onSuccess: () => {
                setShowBulkGenerate(false);
                setBulkForm({ classe_id: '', trimestre_id: '', annuel: false });
            }
        });
    };

    const handleDelete = (bulletinId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce bulletin ?')) {
            return;
        }

        router.delete(`/bulletins/${bulletinId}`);
    };

    const downloadPDF = (bulletinId) => {
        window.open(`/bulletins/${bulletinId}/download`, '_blank');
    };

    const getMoyenneColor = (moyenne) => {
        if (moyenne >= 16) return 'text-green-600 bg-green-50 border-green-200';
        if (moyenne >= 14) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (moyenne >= 12) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
        if (moyenne >= 10) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getRangColor = (rang) => {
        if (rang === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (rang <= 3) return 'text-green-600 bg-green-50 border-green-200';
        if (rang <= 10) return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    useEffect(() => {
        if (flash?.success) {
            // Vous pouvez utiliser un système de notification ici
            console.log(flash.success);
        }
        if (flash?.error) {
            console?.error(flash?.error);
        }
    }, [flash]);

    return (
        <AppLayout>
            <Head title="Gestion des Bulletins" />

            {/* Alertes */}
            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                                {flash.success}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">
                                {flash.error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Gestion des Bulletins
                            </h1>
                            <p className="text-purple-100 mt-2 text-lg">
                                Gérez et consultez les bulletins des élèves
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex space-x-3">
                            <button
                                onClick={() => setShowBulkGenerate(true)}
                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-xl text-white hover:bg-green-500/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Génération Groupée
                            </button>
                            <Link
                                href="/bulletins/create"
                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-xl text-white hover:bg-blue-500/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nouveau Bulletin
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Bulletins</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_bulletins}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-50 rounded-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Admis</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.admis}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Non Admis</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.non_admis}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-50 rounded-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Moyenne Générale</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {parseFloat(stats.moyenne_generale || 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de génération groupée */}
                {showBulkGenerate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Génération Groupée de Bulletins
                            </h3>
                            <form onSubmit={handleBulkGenerate}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Classe *
                                        </label>
                                        <select
                                            value={bulkForm.classe_id}
                                            onChange={(e) => setBulkForm({...bulkForm, classe_id: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Sélectionnez une classe</option>
                                            {classes.map((classe) => (
                                                <option key={classe.id} value={classe.id}>
                                                    {classe.nom} - {classe.niveau?.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={bulkForm.annuel}
                                                onChange={(e) => setBulkForm({...bulkForm, annuel: e.target.checked, trimestre_id: ''})}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">Bulletin Annuel</span>
                                        </label>
                                    </div>

                                    {!bulkForm.annuel && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Trimestre *
                                            </label>
                                            <select
                                                value={bulkForm.trimestre_id}
                                                onChange={(e) => setBulkForm({...bulkForm, trimestre_id: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required={!bulkForm.annuel}
                                            >
                                                <option value="">Sélectionnez un trimestre</option>
                                                {trimestres.map((trimestre) => (
                                                    <option key={trimestre.id} value={trimestre.id}>
                                                        {trimestre.nom} - {trimestre.annee_scolaire?.nom}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowBulkGenerate(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Générer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher un élève..."
                                    defaultValue={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div>
                            <select
                                value={classeId}
                                onChange={(e) => {
                                    setClasseId(e.target.value);
                                    handleFilter();
                                }}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="">Toutes les classes</option>
                                {classes.map((classe) => (
                                    <option key={classe.id} value={classe.id}>
                                        {classe.nom} - {classe.niveau?.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                value={trimestreId}
                                onChange={(e) => {
                                    setTrimestreId(e.target.value);
                                    handleFilter();
                                }}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="">Tous les trimestres</option>
                                {trimestres.map((trimestre) => (
                                    <option key={trimestre.id} value={trimestre.id}>
                                        {trimestre.nom} - {trimestre.annee_scolaire?.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                value={anneeScolaireId}
                                onChange={(e) => {
                                    setAnneeScolaireId(e.target.value);
                                    handleFilter();
                                }}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="">Toutes les années</option>
                                {anneesScolaires.map((annee) => (
                                    <option key={annee.id} value={annee.id}>
                                        {annee.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex space-x-3">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={annuel}
                                    onChange={(e) => {
                                        setAnnuel(e.target.checked);
                                        handleFilter();
                                    }}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Annuel</span>
                            </label>

                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(e.target.value);
                                    handleFilter();
                                }}
                                className="w-32 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="10">10/page</option>
                                <option value="20">20/page</option>
                                <option value="50">50/page</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des Bulletins */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* En-tête du tableau (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        <div className="col-span-3">Élève</div>
                        <div className="col-span-2">Classe & Année</div>
                        <div className="col-span-2">Période</div>
                        <div className="col-span-2">Résultats</div>
                        <div className="col-span-3 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {bulletins.data.map((bulletin) => (
                            <div key={bulletin.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                <div className="px-6 py-6">
                                    {/* Version Mobile */}
                                    <div className="lg:hidden space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-purple-600 font-bold text-lg">
                                                        {bulletin.eleve_nom.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {bulletin.eleve_nom}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{bulletin.classe_nom}</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getMoyenneColor(bulletin.moyenne_eleve)}`}>
                                                {bulletin.moyenne_eleve}/20
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 01-2-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {bulletin.trimestre_nom} - {bulletin.annee_scolaire_nom}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className={`px-2 py-1 rounded text-xs font-medium ${getRangColor(bulletin.rang)}`}>
                                                    Rang: {bulletin.rang}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Classe: {bulletin.moyenne_classe}/20
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 pt-2">
                                            <Link
                                                href={`/bulletins/${bulletin.id}`}
                                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Voir
                                            </Link>
                                            <button
                                                onClick={() => downloadPDF(bulletin.id)}
                                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                PDF
                                            </button>
                                            <button
                                                onClick={() => handleDelete(bulletin.id)}
                                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Suppr.
                                            </button>
                                        </div>
                                    </div>

                                    {/* Version Desktop */}
                                    <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
                                        <div className="col-span-3">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-purple-600 font-bold text-lg">
                                                        {bulletin.eleve_nom.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {bulletin.eleve_nom}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {bulletin.niveau_nom}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-lg font-medium text-gray-900">
                                                {bulletin.classe_nom}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {bulletin.annee_scolaire_nom}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-lg font-medium text-gray-900">
                                                {bulletin.trimestre_nom}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {bulletin.annuel ? 'Annuel' : 'Trimestriel'}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center space-x-3">
                                                <div className={`px-3 py-2 rounded-lg border font-bold ${getMoyenneColor(bulletin.moyenne_eleve)}`}>
                                                    {bulletin.moyenne_eleve}/20
                                                </div>
                                                <div className={`px-2 py-1 rounded text-sm font-medium ${getRangColor(bulletin.rang)}`}>
                                                    #{bulletin.rang}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                Classe: {bulletin.moyenne_classe}/20
                                            </div>
                                        </div>
                                        <div className="col-span-3">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/bulletins/${bulletin.id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Détails
                                                </Link>
                                                <button
                                                    onClick={() => downloadPDF(bulletin.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    PDF
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bulletin.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message vide */}
                    {bulletins.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun bulletin trouvé</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search || classeId || trimestreId || anneeScolaireId
                                    ? 'Aucun bulletin ne correspond à vos critères de recherche.'
                                    : 'Commencez par générer vos premiers bulletins.'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => setShowBulkGenerate(true)}
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Générer des Bulletins
                                </button>
                                <Link
                                    href="/bulletins/create"
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Créer un Bulletin
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {bulletins.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{bulletins.from}</span> à <span className="font-semibold">{bulletins.to}</span> sur <span className="font-semibold">{bulletins.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {bulletins.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url)}
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
        </AppLayout>
    );
};

export default BulletinIndex;