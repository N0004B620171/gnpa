import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ itineraire }) => {
    const { flash } = usePage().props;
    const [editingArret, setEditingArret] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const { data: formData, setData: setFormData, post, processing, errors, reset } = useForm({
        nom: '',
        ordre: ''
    });

    const { data: editData, setData: setEditData, put, processing: editing } = useForm({
        nom: '',
        ordre: ''
    });

    // Trier les arrêts par ordre
    const arretsTries = itineraire.arrets?.sort((a, b) => (a.ordre || 0) - (b.ordre || 0)) || [];

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post(`/itineraires-transports/${itineraire.id}/arrets`, {
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(`/itineraires-transports/${itineraire.id}/arrets/${editingArret.id}`, {
            onSuccess: () => {
                setEditingArret(null);
                setEditData({ nom: '', ordre: '' });
            }
        });
    };

    const handleDelete = (arret) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'arrêt "${arret.nom}" ?`)) {
            router.delete(`/itineraires-transports/${itineraire.id}/arrets/${arret.id}`);
        }
    };

    const startEditing = (arret) => {
        setEditingArret(arret);
        setEditData({
            nom: arret.nom,
            ordre: arret.ordre || ''
        });
    };

    const cancelEditing = () => {
        setEditingArret(null);
        setEditData({ nom: '', ordre: '' });
    };

    const cancelAdd = () => {
        setShowAddForm(false);
        reset();
    };

    return (
        <AppLayout>
            <Head title={`Arrêts - ${itineraire.nom}`} />

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

            <div className="max-w-4xl mx-auto">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Gestion des Arrêts
                            </h1>
                            <p className="text-indigo-100 mt-2 text-lg">
                                {itineraire.nom}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4 text-indigo-200 text-sm">
                                {itineraire.bus && (
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Bus: {itineraire.bus.immatriculation}
                                    </div>
                                )}
                                {itineraire.service && (
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        Service: {itineraire.service.nom}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                            <Link
                                href="/itineraires-transports"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Retour aux itinéraires
                            </Link>
                            <Link
                                href={`/itineraires-transports/${itineraire.id}/edit`}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier l'itinéraire
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Arrêts</p>
                                <p className="text-2xl font-bold text-blue-900">{arretsTries.length}</p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Avec Ordre Défini</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {arretsTries.filter(a => a.ordre !== null).length}
                                </p>
                            </div>
                            <div className="bg-green-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Sans Ordre</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {arretsTries.filter(a => a.ordre === null).length}
                                </p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bouton d'ajout */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Liste des Arrêts</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Gérez les points d'arrêt de l'itinéraire dans l'ordre de passage
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-4 sm:mt-0 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-xl hover:from-indigo-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ajouter un Arrêt
                        </button>
                    </div>
                </div>

                {/* Formulaire d'ajout */}
                {showAddForm && (
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-200 p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvel Arrêt
                            </h3>
                            <button
                                onClick={cancelAdd}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nom de l'arrêt *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nom}
                                        onChange={(e) => setFormData('nom', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                                            errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                        } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                        placeholder="Ex: Arrêt Thiaroye, Arrêt Pikine..."
                                    />
                                    {errors.nom && (
                                        <p className="text-red-600 text-sm mt-2">{errors.nom}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Ordre de passage
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formData.ordre}
                                        onChange={(e) => setFormData('ordre', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white"
                                        placeholder="Ex: 1, 2, 3..."
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Définit l'ordre de passage du bus
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={cancelAdd}
                                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors font-medium disabled:opacity-50"
                                >
                                    {processing ? 'Ajout...' : 'Ajouter l\'arrêt'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Liste des arrêts */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {arretsTries.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {arretsTries.map((arret, index) => (
                                <div key={arret.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                    <div className="px-6 py-6">
                                        {editingArret?.id === arret.id ? (
                                            /* Mode édition */
                                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Nom de l'arrêt *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={editData.nom}
                                                            onChange={(e) => setEditData('nom', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Ordre de passage
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            value={editData.ordre}
                                                            onChange={(e) => setEditData('ordre', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={cancelEditing}
                                                        className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                                                    >
                                                        Annuler
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={editing}
                                                        className="flex-1 px-4 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors font-medium disabled:opacity-50"
                                                    >
                                                        {editing ? 'Mise à jour...' : 'Mettre à jour'}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            /* Mode affichage */
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex items-center flex-1">
                                                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center mr-4">
                                                        {arret.ordre ? (
                                                            <span className="text-indigo-600 font-bold text-lg">
                                                                {arret.ordre}
                                                            </span>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-gray-900">
                                                            {arret.nom}
                                                        </h4>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                            {arret.ordre && (
                                                                <span className="flex items-center">
                                                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                                                    </svg>
                                                                    Ordre {arret.ordre}
                                                                </span>
                                                            )}
                                                            <span className="flex items-center">
                                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                Ajouté le {new Date(arret.created_at).toLocaleDateString('fr-FR')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                                                    <button
                                                        onClick={() => startEditing(arret)}
                                                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200"
                                                        title="Modifier"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(arret)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                        title="Supprimer"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Message vide */
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun arrêt défini</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Commencez par ajouter les points d'arrêt de cet itinéraire.
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-xl hover:from-indigo-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Ajouter le premier arrêt
                            </button>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                {arretsTries.length > 0 && (
                    <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
                        <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="text-sm font-semibold text-yellow-800 mb-2">Conseils d'organisation</h4>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li>• Utilisez l'ordre de passage pour définir le trajet du bus</li>
                                    <li>• Les arrêts sans ordre défini seront affichés à la fin</li>
                                    <li>• Vous pouvez réorganiser les arrêts à tout moment</li>
                                    <li>• Pensez à l'ordre logique du trajet pour optimiser le temps de transport</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Index;