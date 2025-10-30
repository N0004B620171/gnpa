import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Transfert = ({ 
    anneeActive, 
    annees, 
    classes, 
    niveaux, 
    dernierTransfert, 
    statsAnneeActive 
}) => {
    const { flash } = usePage().props;
    const [selectedAncienneAnnee, setSelectedAncienneAnnee] = useState(anneeActive?.id || '');
    const [selectedNouvelleAnnee, setSelectedNouvelleAnnee] = useState('');
    const [mappingClasses, setMappingClasses] = useState({});
    const [loading, setLoading] = useState(false);
    const [filtreNiveau, setFiltreNiveau] = useState('');

    // Filtrer les classes par niveau
    const classesFiltrees = filtreNiveau 
        ? classes.filter(classe => classe.niveau_id == filtreNiveau)
        : classes;

    // Initialiser le mapping des classes
    useEffect(() => {
        const initialMapping = {};
        classesFiltrees.forEach(classe => {
            initialMapping[classe.id] = '';
        });
        setMappingClasses(initialMapping);
    }, [classesFiltrees]);

    const handleTransfert = async () => {
        if (!selectedAncienneAnnee || !selectedNouvelleAnnee) {
            alert('Veuillez sélectionner les années scolaire de départ et d\'arrivée');
            return;
        }

        // Vérifier que toutes les classes ont une destination
        const classesSansDestination = Object.entries(mappingClasses)
            .filter(([_, nouvelleClasseId]) => !nouvelleClasseId)
            .map(([ancienneClasseId]) => {
                const classe = classes.find(c => c.id == ancienneClasseId);
                return classe?.nom;
            });

        if (classesSansDestination.length > 0) {
            alert(`Les classes suivantes n'ont pas de destination : ${classesSansDestination.join(', ')}`);
            return;
        }

        if (!confirm('Êtes-vous sûr de vouloir effectuer le transfert ? Cette action est irréversible.')) {
            return;
        }

        setLoading(true);
        try {
            await router.post('/transfert/transferer', {
                ancienne_annee_id: selectedAncienneAnnee,
                nouvelle_annee_id: selectedNouvelleAnnee,
                mapping_classes: mappingClasses
            });
        } catch (error) {
            console.error('Erreur lors du transfert:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnnulerTransfert = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler ce transfert ?')) {
            return;
        }

        try {
            await router.post(`/transfert/annuler/${id}`);
        } catch (error) {
            console.error('Erreur lors de l\'annulation:', error);
        }
    };

    const getStatutColor = (statut) => {
        const colors = {
            'passant': 'text-green-600 bg-green-50 border-green-200',
            'redoublant': 'text-orange-600 bg-orange-50 border-orange-200',
            'sortant': 'text-red-600 bg-red-50 border-red-200'
        };
        return colors[statut] || 'text-gray-600 bg-gray-50 border-gray-200';
    };

    return (
        <AppLayout>
            <Head title="Transfert d'Année Scolaire" />

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Transfert d'Année Scolaire
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Gérez le passage des élèves vers la nouvelle année scolaire
                            </p>
                        </div>
                        <div className="flex gap-3 mt-4 lg:mt-0">
                            <Link
                                href="/historique-transferts"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Historique
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Statistiques de l'année active */}
                {statsAnneeActive && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Élèves inscrits</p>
                                    <p className="text-2xl font-bold text-blue-900">{statsAnneeActive.total_eleves}</p>
                                </div>
                                <div className="bg-blue-100 rounded-full p-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Classes</p>
                                    <p className="text-2xl font-bold text-green-900">{statsAnneeActive.total_classes}</p>
                                </div>
                                <div className="bg-green-100 rounded-full p-3">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Classes avec élèves</p>
                                    <p className="text-2xl font-bold text-purple-900">{statsAnneeActive.classes_avec_eleves}</p>
                                </div>
                                <div className="bg-purple-100 rounded-full p-3">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Configuration du transfert */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuration du Transfert</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Sélection des années */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Année scolaire de départ *
                                </label>
                                <select
                                    value={selectedAncienneAnnee}
                                    onChange={(e) => setSelectedAncienneAnnee(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                >
                                    <option value="">Sélectionnez l'année de départ</option>
                                    {annees.map((annee) => (
                                        <option key={annee.id} value={annee.id}>
                                            {annee.nom} {annee.actif && '(Actuelle)'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Année scolaire d'arrivée *
                                </label>
                                <select
                                    value={selectedNouvelleAnnee}
                                    onChange={(e) => setSelectedNouvelleAnnee(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                >
                                    <option value="">Sélectionnez l'année d'arrivée</option>
                                    {annees
                                        .filter(annee => annee.id != selectedAncienneAnnee)
                                        .map((annee) => (
                                            <option key={annee.id} value={annee.id}>
                                                {annee.nom}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Filtre par niveau */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Filtrer par niveau
                                </label>
                                <select
                                    value={filtreNiveau}
                                    onChange={(e) => setFiltreNiveau(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                >
                                    <option value="">Tous les niveaux</option>
                                    {niveaux.map((niveau) => (
                                        <option key={niveau.id} value={niveau.id}>
                                            {niveau.nom} - {niveau.cycle?.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dernier transfert */}
                        {dernierTransfert && (
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Dernier Transfert
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="font-medium text-gray-700">De :</span>
                                        <span className="ml-2 text-gray-900">{dernierTransfert.ancienne_annee?.nom}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Vers :</span>
                                        <span className="ml-2 text-gray-900">{dernierTransfert.nouvelle_annee?.nom}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Date :</span>
                                        <span className="ml-2 text-gray-900">
                                            {new Date(dernierTransfert.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    {dernierTransfert.annulable && (
                                        <button
                                            onClick={() => handleAnnulerTransfert(dernierTransfert.id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors mt-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Annuler ce transfert
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mapping des classes */}
                {selectedAncienneAnnee && selectedNouvelleAnnee && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Mapping des Classes - {classesFiltrees.length} classe(s)
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Définissez la destination de chaque classe pour la nouvelle année scolaire
                            </p>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {classesFiltrees.map((classe) => (
                                <div key={classe.id} className="p-6 hover:bg-gray-50/50 transition-all duration-200">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        {classe.nom[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {classe.nom}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <span className="text-sm text-gray-600">
                                                            Niveau: {classe.niveau?.nom}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            Cycle: {classe.niveau?.cycle?.nom}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            Élèves: {classe.inscriptions?.length || 0}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            Professeur: {classe.professeur ? `${classe.professeur.prenom} ${classe.professeur.nom}` : 'Non assigné'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:w-80">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Classe de destination
                                            </label>
                                            <select
                                                value={mappingClasses[classe.id] || ''}
                                                onChange={(e) => setMappingClasses(prev => ({
                                                    ...prev,
                                                    [classe.id]: e.target.value
                                                }))}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                            >
                                                <option value="">Sélectionnez la destination</option>
                                                {classes
                                                    .filter(c => c.niveau?.cycle_id === classe.niveau?.cycle_id)
                                                    .map((nouvelleClasse) => (
                                                        <option key={nouvelleClasse.id} value={nouvelleClasse.id}>
                                                            {nouvelleClasse.nom} - {nouvelleClasse.niveau?.nom}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bouton de transfert */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex justify-end">
                                <button
                                    onClick={handleTransfert}
                                    disabled={loading || Object.keys(mappingClasses).length === 0}
                                    className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="font-semibold">Transfert en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            <span className="font-semibold">Exécuter le Transfert</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Message si aucune année sélectionnée */}
                {(!selectedAncienneAnnee || !selectedNouvelleAnnee) && (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                        <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Configuration requise</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Veuillez sélectionner les années scolaire de départ et d'arrivée pour configurer le transfert.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Transfert;