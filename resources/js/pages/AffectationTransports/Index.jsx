import React, { useState, useEffect } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ affectations, filters, inscriptions, itineraires }) => {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.q || '');
    const [perPage, setPerPage] = useState(20);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingAffectation, setEditingAffectation] = useState(null);
    const [selectedItineraire, setSelectedItineraire] = useState(null);
    const [arrets, setArrets] = useState([]);
    const [loadingArrets, setLoadingArrets] = useState(false);

    const { data: createData, setData: setCreateData, post, processing, errors, reset } = useForm({
        inscription_id: '',
        itineraire_transport_id: '',
        arret_id: '',
        actif: true
    });

    const { data: editData, setData: setEditData, put, processing: editing } = useForm({
        arret_id: '',
        actif: true
    });

    // Charger les arrêts quand un itinéraire est sélectionné
    useEffect(() => {
        if (createData.itineraire_transport_id) {
            loadArrets(createData.itineraire_transport_id);
        } else {
            setArrets([]);
            setSelectedItineraire(null);
        }
    }, [createData.itineraire_transport_id]);

    const loadArrets = async (itineraireId) => {
        setLoadingArrets(true);
        try {
            const response = await fetch(`/affectations-transports/arrets/${itineraireId}`);
            const data = await response.json();
            setArrets(data.arrets || []);
            
            const itineraire = itineraires.find(i => i.id == itineraireId);
            setSelectedItineraire(itineraire);
        } catch (error) {
            console.error('Erreur lors du chargement des arrêts:', error);
            setArrets([]);
        } finally {
            setLoadingArrets(false);
        }
    };

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const handleSearch = debounce((value) => {
        router.get('/affectations-transports', { 
            q: value,
            perPage 
        }, {
            preserveState: true,
            replace: true
        });
    }, 300);

    const handlePerPageChange = (value) => {
        setPerPage(value);
        router.get('/affectations-transports', { 
            q: search,
            perPage: value 
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post('/affectations-transports', {
            onSuccess: () => {
                reset();
                setShowCreateForm(false);
                setSelectedItineraire(null);
                setArrets([]);
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(`/affectations-transports/${editingAffectation.id}`, {
            onSuccess: () => {
                setEditingAffectation(null);
                setEditData({ arret_id: '', actif: true });
            }
        });
    };

    const handleDelete = (affectation) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'affectation de transport pour ${affectation.inscription.eleve.prenom} ${affectation.inscription.eleve.nom} ?`)) {
            router.delete(`/affectations-transports/${affectation.id}`);
        }
    };

    const startEditing = (affectation) => {
        setEditingAffectation(affectation);
        setEditData({
            arret_id: affectation.arret_id || '',
            actif: affectation.actif
        });
        
        // Charger les arrêts pour l'itinéraire en cours d'édition
        if (affectation.itineraire_transport_id) {
            loadArrets(affectation.itineraire_transport_id);
        }
    };

    const cancelEditing = () => {
        setEditingAffectation(null);
        setEditData({ arret_id: '', actif: true });
        setArrets([]);
    };

    const cancelCreate = () => {
        setShowCreateForm(false);
        reset();
        setSelectedItineraire(null);
        setArrets([]);
    };

    const getStatutColor = (actif) => {
        return actif 
            ? 'text-green-600 bg-green-50 border-green-200' 
            : 'text-red-600 bg-red-50 border-red-200';
    };

    const getStatutLabel = (actif) => {
        return actif ? 'Actif' : 'Inactif';
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(montant);
    };

    // Trouver l'inscription sélectionnée
    const selectedInscription = createData.inscription_id 
        ? inscriptions.find(i => i.id == createData.inscription_id)
        : null;

    return (
        <AppLayout>
            <Head title="Gestion des Affectations Transport" />

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Affectations Transport
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Gérez les affectations des élèves aux transports scolaires
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="mt-4 lg:mt-0 inline-flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Nouvelle Affectation
                        </button>
                    </div>
                </div>

                {/* Filtres et Recherche */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher un élève ou un itinéraire..."
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
                                value={perPage}
                                onChange={(e) => handlePerPageChange(e.target.value)}
                                className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="10">10/page</option>
                                <option value="20">20/page</option>
                                <option value="50">50/page</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Affectations</p>
                                <p className="text-2xl font-bold text-blue-900">{affectations.total}</p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Actives</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {affectations.data.filter(a => a.actif).length}
                                </p>
                            </div>
                            <div className="bg-green-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Inactives</p>
                                <p className="text-2xl font-bold text-red-900">
                                    {affectations.data.filter(a => !a.actif).length}
                                </p>
                            </div>
                            <div className="bg-red-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Avec Arrêt Défini</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {affectations.data.filter(a => a.arret_id).length}
                                </p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liste des Affectations */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* En-tête du tableau (Desktop) */}
                    <div className="hidden lg:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                        <div className="col-span-3">Élève</div>
                        <div className="col-span-2">Itinéraire</div>
                        <div className="col-span-2">Bus</div>
                        <div className="col-span-2">Arrêt</div>
                        <div className="col-span-2">Statut</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {affectations?.data.map((affectation) => (
                            <div key={affectation.id} className="hover:bg-gray-50/50 transition-all duration-200">
                                <div className="px-6 py-6">
                                    {/* Version Mobile */}
                                    <div className="lg:hidden space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        {affectation.inscription.eleve.prenom[0]}{affectation.inscription.eleve.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {affectation.inscription.eleve.prenom} {affectation.inscription.eleve.nom}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{affectation.inscription.classe.nom}</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatutColor(affectation.actif)}`}>
                                                {getStatutLabel(affectation.actif)}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Itinéraire:</span> {affectation?.itineraire?.nom}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Bus:</span> {affectation?.itineraire?.bus ? `${affectation?.itineraire?.bus.immatriculation} - ${affectation?.itineraire?.bus.marque} ${affectation?.itineraire?.bus.modele}` : 'Non assigné'}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Arrêt:</span> {affectation?.arret?.nom || 'Non spécifié'}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-600">
                                                    {affectation?.inscription?.annee_scolaire?.nom}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => startEditing(affectation)}
                                                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(affectation)}
                                                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
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
                                                        {affectation?.inscription?.eleve?.prenom[0]}{affectation?.inscription?.eleve?.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {affectation?.inscription?.eleve?.prenom} {affectation?.inscription?.eleve?.nom}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {affectation?.inscription?.classe?.nom} • {affectation?.inscription?.annee_scolaire?.nom}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-lg font-medium text-gray-900">
                                                {affectation?.itineraire?.nom}
                                            </div>
                                            {affectation?.itineraire?.service && (
                                                <div className="text-sm text-gray-600">
                                                    {formatMontant(affectation?.itineraire?.service?.montant)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">
                                                {affectation?.itineraire?.bus ? affectation?.itineraire?.bus.immatriculation : 'Non assigné'}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">
                                                {affectation?.arret?.nom || 'Non spécifié'}
                                            </div>
                                            {affectation?.arret && (
                                                <div className="text-xs text-gray-500">
                                                    Ordre: {affectation?.arret?.ordre}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatutColor(affectation?.actif)}`}>
                                                {getStatutLabel(affectation?.actif)}
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => startEditing(affectation)}
                                                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200"
                                                    title="Modifier"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(affectation)}
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                    title="Supprimer"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    {affectations.data.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune affectation trouvée</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {search 
                                    ? 'Aucune affectation ne correspond à vos critères de recherche.' 
                                    : 'Commencez par affecter vos premiers élèves aux transports.'}
                            </p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvelle Affectation
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {affectations.data.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Affichage de <span className="font-semibold">{affectations.from}</span> à <span className="font-semibold">{affectations.to}</span> sur <span className="font-semibold">{affectations.total}</span> résultats
                        </div>
                        <div className="flex space-x-1">
                            {affectations.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.get(link.url || '#')}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        link.active
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

            {/* Modal de création */}
            {showCreateForm && (
                <CreateModal
                    createData={createData}
                    setCreateData={setCreateData}
                    errors={errors}
                    processing={processing}
                    inscriptions={inscriptions}
                    itineraires={itineraires}
                    selectedInscription={selectedInscription}
                    selectedItineraire={selectedItineraire}
                    arrets={arrets}
                    loadingArrets={loadingArrets}
                    formatMontant={formatMontant}
                    handleCreateSubmit={handleCreateSubmit}
                    cancelCreate={cancelCreate}
                />
            )}

            {/* Modal d'édition */}
            {editingAffectation && (
                <EditModal
                    editingAffectation={editingAffectation}
                    editData={editData}
                    setEditData={setEditData}
                    editing={editing}
                    arrets={arrets}
                    formatMontant={formatMontant}
                    handleEditSubmit={handleEditSubmit}
                    cancelEditing={cancelEditing}
                />
            )}
        </AppLayout>
    );
};

// Modal de création
const CreateModal = ({ 
    createData, setCreateData, errors, processing, inscriptions, itineraires, 
    selectedInscription, selectedItineraire, arrets, loadingArrets, formatMontant,
    handleCreateSubmit, cancelCreate 
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouvelle Affectation
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Affecter un élève à un transport scolaire
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleCreateSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                    {/* Informations de l'élève */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Informations de l'Élève
                        </h3>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Élève à affecter *
                            </label>
                            <select
                                value={createData.inscription_id}
                                onChange={(e) => setCreateData('inscription_id', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.inscription_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                            >
                                <option value="">Sélectionnez un élève</option>
                                {inscriptions.map((inscription) => (
                                    <option key={inscription.id} value={inscription.id}>
                                        {inscription.eleve.prenom} {inscription.eleve.nom} - {inscription.classe.nom} ({inscription.annee_scolaire.nom})
                                    </option>
                                ))}
                            </select>
                            {errors.inscription_id && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.inscription_id}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informations du transport */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Informations du Transport
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Itinéraire de transport *
                                </label>
                                <select
                                    value={createData.itineraire_transport_id}
                                    onChange={(e) => setCreateData('itineraire_transport_id', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.itineraire_transport_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                >
                                    <option value="">Sélectionnez un itinéraire</option>
                                    {itineraires.map((itineraire) => (
                                        <option key={itineraire.id} value={itineraire.id}>
                                            {itineraire.nom}
                                            {itineraire.bus && ` - Bus: ${itineraire.bus.immatriculation}`}
                                            {itineraire.service && ` - ${formatMontant(itineraire.service.montant)}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.itineraire_transport_id && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.itineraire_transport_id}</span>
                                    </div>
                                )}
                            </div>

                            {createData.itineraire_transport_id && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Arrêt spécifique (optionnel)
                                    </label>
                                    <select
                                        value={createData.arret_id}
                                        onChange={(e) => setCreateData('arret_id', e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                        disabled={loadingArrets}
                                    >
                                        <option value="">Sélectionnez un arrêt</option>
                                        {arrets.map((arret) => (
                                            <option key={arret.id} value={arret.id}>
                                                {arret.ordre && `[${arret.ordre}] `}{arret.nom}
                                            </option>
                                        ))}
                                    </select>
                                    {loadingArrets && (
                                        <p className="text-sm text-gray-500 mt-2">Chargement des arrêts...</p>
                                    )}
                                    <p className="text-sm text-gray-500 mt-2">
                                        {arrets.length} arrêt(s) disponible(s) pour cet itinéraire
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* État de l'affectation */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            État de l'Affectation
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-all duration-200">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Active</div>
                                        <div className="text-sm text-gray-600">L'élève peut utiliser le transport</div>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="actif"
                                    value="true"
                                    checked={createData.actif === true}
                                    onChange={(e) => setCreateData('actif', true)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-all duration-200">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                        <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Inactive</div>
                                        <div className="text-sm text-gray-600">L'élève ne peut pas utiliser le transport</div>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="actif"
                                    value="false"
                                    checked={createData.actif === false}
                                    onChange={(e) => setCreateData('actif', false)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Aperçu */}
                    {(selectedInscription || selectedItineraire) && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu de l'Affectation
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {selectedInscription && (
                                    <>
                                        <div>
                                            <span className="font-medium text-blue-700">Élève :</span>
                                            <span className="ml-2 text-blue-900">
                                                {selectedInscription.eleve.prenom} {selectedInscription.eleve.nom}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-blue-700">Classe :</span>
                                            <span className="ml-2 text-blue-900">
                                                {selectedInscription.classe.nom}
                                            </span>
                                        </div>
                                    </>
                                )}
                                {selectedItineraire && (
                                    <>
                                        <div>
                                            <span className="font-medium text-blue-700">Itinéraire :</span>
                                            <span className="ml-2 text-blue-900">
                                                {selectedItineraire.nom}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-blue-700">Bus :</span>
                                            <span className="ml-2 text-blue-900">
                                                {selectedItineraire.bus ? selectedItineraire.bus.immatriculation : 'Aucun bus'}
                                            </span>
                                        </div>
                                        {selectedItineraire.service && (
                                            <div className="md:col-span-2">
                                                <span className="font-medium text-blue-700">Service :</span>
                                                <span className="ml-2 text-blue-900 font-bold">
                                                    {selectedItineraire.service.nom} ({formatMontant(selectedItineraire.service.montant)})
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                                {createData.arret_id && (
                                    <div className="md:col-span-2">
                                        <span className="font-medium text-blue-700">Arrêt :</span>
                                        <span className="ml-2 text-blue-900">
                                            {arrets.find(a => a.id == createData.arret_id)?.nom}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium text-blue-700">Statut :</span>
                                    <span className={`ml-2 font-medium ${
                                        createData.actif ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {createData.actif ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Information facturation */}
                    {selectedItineraire?.service && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <span className="text-sm font-medium text-green-800">
                                    Une facture de {formatMontant(selectedItineraire.service.montant)} sera automatiquement générée pour le mois en cours
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={cancelCreate}
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={processing || !createData.inscription_id || !createData.itineraire_transport_id}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="font-semibold">Création...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-semibold">Créer l'affectation</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal d'édition
const EditModal = ({ 
    editingAffectation, editData, setEditData, editing, arrets, formatMontant,
    handleEditSubmit, cancelEditing 
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier l'Affectation
                            </h1>
                            <p className="text-green-100 mt-2 text-lg">
                                {editingAffectation.inscription.eleve.prenom} {editingAffectation.inscription.eleve.nom}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                    {/* Informations en lecture seule */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Élève</h3>
                            <p className="text-gray-700">
                                {editingAffectation.inscription.eleve.prenom} {editingAffectation.inscription.eleve.nom}
                            </p>
                            <p className="text-sm text-gray-600">
                                {editingAffectation.inscription.classe.nom} • {editingAffectation.inscription.annee_scolaire.nom}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Itinéraire</h3>
                            <p className="text-gray-700">{editingAffectation.itineraire.nom}</p>
                            {editingAffectation.itineraire.service && (
                                <p className="text-sm text-gray-600">
                                    {formatMontant(editingAffectation.itineraire.service.montant)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sélection de l'arrêt */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Arrêt spécifique
                        </label>
                        <select
                            value={editData.arret_id}
                            onChange={(e) => setEditData('arret_id', e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white"
                        >
                            <option value="">Sélectionnez un arrêt</option>
                            {arrets.map((arret) => (
                                <option key={arret.id} value={arret.id}>
                                    {arret.ordre && `[${arret.ordre}] `}{arret.nom}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-2">
                            {arrets.length} arrêt(s) disponible(s) pour cet itinéraire
                        </p>
                    </div>

                    {/* État de l'affectation */}
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={editData.actif}
                                onChange={(e) => setEditData('actif', e.target.checked)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm font-semibold text-gray-700">Activer l'affectation</span>
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                            Quand désactivé, l'élève ne pourra plus utiliser ce transport
                        </p>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={editing}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            {editing ? 'Mise à jour...' : 'Mettre à jour'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Index;