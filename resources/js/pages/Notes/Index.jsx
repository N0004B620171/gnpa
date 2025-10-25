import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ notes, classes, matieres, trimestres, filters }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [classeId, setClasseId] = useState(filters.classe_id || '');
    const [matiereId, setMatiereId] = useState(filters.matiere_id || '');
    const [trimestreId, setTrimestreId] = useState(filters.trimestre_id || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        router.get('/notes', {
            search: value,
            classe_id: classeId,
            matiere_id: matiereId,
            trimestre_id: trimestreId,
            perPage
        }, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handleFilterChange = () => {
        router.get('/notes', {
            search,
            classe_id: classeId,
            matiere_id: matiereId,
            trimestre_id: trimestreId,
            perPage
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        router.get('/notes', {
            search,
            classe_id: classeId,
            matiere_id: matiereId,
            trimestre_id: trimestreId,
            perPage: value
        }, {
            preserveState: true,
            replace: true
        });
    };

    const getNoteColor = (note, sur) => {
        const percentage = (note / sur) * 100;
        if (percentage >= 80) return 'text-green-600 bg-green-50';
        if (percentage >= 60) return 'text-blue-600 bg-blue-50';
        if (percentage >= 50) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <AppLayout>
            <Head title="Gestion des Notes" />

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
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Gestion des Notes
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Consultez et gérez les notes des élèves
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex space-x-3">
                            <Link
                                href="/notes/multiple/create"
                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-xl text-white hover:bg-green-500/30 transition-all duration-200 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Saisie Groupée
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div>
                            <select
                                value={classeId}
                                onChange={(e) => {
                                    setClasseId(e.target.value);
                                    handleFilterChange();
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
                                value={matiereId}
                                onChange={(e) => {
                                    setMatiereId(e.target.value);
                                    handleFilterChange();
                                }}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="">Toutes les matières</option>
                                {matieres.map((matiere) => (
                                    <option key={matiere.id} value={matiere.id}>
                                        {matiere.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex space-x-3">
                            <select
                                value={trimestreId}
                                onChange={(e) => {
                                    setTrimestreId(e.target.value);
                                    handleFilterChange();
                                }}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="">Tous les trimestres</option>
                                {trimestres.map((trimestre) => (
                                    <option key={trimestre.id} value={trimestre.id}>
                                        {trimestre.nom} - {trimestre.annee_scolaire?.nom}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(e.target.value)}
                                className="w-32 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="10">10/page</option>
                                <option value="20">20/page</option>
                                <option value="50">50/page</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des Notes */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* En-tête du tableau (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        <div className="col-span-3">Élève</div>
                        <div className="col-span-2">Matière</div>
                        <div className="col-span-2">Composition</div>
                        <div className="col-span-2">Note</div>
                        <div className="col-span-1 text-right">Date</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {notes.data.map((note) => (
                            <div key={note.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                <div className="px-6 py-6">
                                    {/* Version Mobile */}
                                    <div className="lg:hidden space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        {note.inscription?.eleve?.prenom[0]}{note.inscription?.eleve?.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {note.inscription?.eleve?.prenom} {note.inscription?.eleve?.nom}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{note.matiere?.nom}</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getNoteColor(note.note, note.sur)}`}>
                                                {note.note}/{note.sur}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {note.composition?.trimestre?.nom} - {note.composition?.trimestre?.annee_scolaire?.nom}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-600">
                                                    {new Date(note.created_at).toLocaleDateString('fr-FR')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Version Desktop */}
                                    <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
                                        <div className="col-span-3">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        {note.inscription?.eleve?.prenom[0]}{note.inscription?.eleve?.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {note.inscription?.eleve?.prenom} {note.inscription?.eleve?.nom}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {note.inscription?.classe?.nom}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-lg font-medium text-gray-900">
                                                {note.matiere?.nom}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Coef. {note.matiere?.coefficient}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-lg font-medium text-gray-900">
                                                {note.composition?.nom}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {note.composition?.trimestre?.nom}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getNoteColor(note.note, note.sur)}`}>
                                                {note.note}/{note.sur}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {((note.note / note.sur) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">
                                                {new Date(note.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {new Date(note.created_at).toLocaleTimeString('fr-FR')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message vide */}
                    {notes.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune note trouvée</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search || classeId || matiereId || trimestreId
                                    ? 'Aucune note ne correspond à vos critères de recherche.'
                                    : 'Commencez par saisir vos premières notes.'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/notes/multiple/create"
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Saisie Groupée
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {notes.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{notes.from}</span> à <span className="font-semibold">{notes.to}</span> sur <span className="font-semibold">{notes.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {notes.links.map((link, index) => (
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
        </AppLayout>
    );
};

export default Index;