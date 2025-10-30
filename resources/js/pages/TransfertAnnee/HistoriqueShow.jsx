import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const HistoriqueShow = ({ historique, transferts, stats }) => {
    const handleAnnulerTransfert = async () => {
        if (!confirm('Êtes-vous sûr de vouloir annuler ce transfert ?')) {
            return;
        }

        try {
            await router.post(`/historique-transferts/annuler/${historique.id}`);
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

    const getStatutLabel = (statut) => {
        const labels = {
            'passant': 'Passant',
            'redoublant': 'Redoublant',
            'sortant': 'Sortant'
        };
        return labels[statut] || statut;
    };

    return (
        <AppLayout>
            <Head title={`Détails du Transfert - ${historique.ancienne_annee?.nom} → ${historique.nouvelle_annee?.nom}`} />

            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Détails du Transfert</h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                {historique.ancienne_annee?.nom} → {historique.nouvelle_annee?.nom}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4 text-blue-200 text-sm">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(historique.created_at).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {new Date(historique.created_at).toLocaleTimeString('fr-FR')}
                                </div>
                                <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${
                                    historique.annulable 
                                        ? 'text-green-600 bg-green-50 border-green-200' 
                                        : 'text-red-600 bg-red-50 border-red-200'
                                }`}>
                                    {historique.annulable ? 'Annulable' : 'Finalisé'}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                            <Link
                                href="/historique-transferts"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Retour à l'historique
                            </Link>
                            {historique.annulable && (
                                <button
                                    onClick={handleAnnulerTransfert}
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-all duration-200 transform hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Annuler le transfert
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total</p>
                                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
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
                                <p className="text-sm font-medium text-green-600">Passants</p>
                                <p className="text-2xl font-bold text-green-900">{stats.passants}</p>
                            </div>
                            <div className="bg-green-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">Redoublants</p>
                                <p className="text-2xl font-bold text-orange-900">{stats.redoublants}</p>
                            </div>
                            <div className="bg-orange-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Sortants</p>
                                <p className="text-2xl font-bold text-red-900">{stats.sortants}</p>
                            </div>
                            <div className="bg-red-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liste des transferts d'élèves */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Détails des Élèves - {transferts.length} élève(s)
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {transferts.map((transfert) => (
                            <div key={transfert.id} className="p-6 hover:bg-gray-50/50 transition-all duration-200">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                <span className="text-blue-600 font-bold text-lg">
                                                    {transfert.inscription.eleve.prenom[0]}{transfert.inscription.eleve.nom[0]}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {transfert.inscription.eleve.prenom} {transfert.inscription.eleve.nom}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    <span className="text-sm text-gray-600">
                                                        Classe actuelle: {transfert.inscription.classe.nom}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        Niveau: {transfert.inscription.classe.niveau.nom}
                                                    </span>
                                                    {transfert.nouvelle_classe && (
                                                        <span className="text-sm text-green-600">
                                                            Nouvelle classe: {transfert.nouvelle_classe.nom}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatutColor(transfert.statut)}`}>
                                            {getStatutLabel(transfert.statut)}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">
                                                {transfert.ancienne_annee.nom} → {transfert.nouvelle_annee.nom}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(transfert.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message vide */}
                    {transferts.length === 0 && (
                        <div className="text-center py-16">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun élève transféré</h3>
                            <p className="text-gray-600">Aucun élève n'a été transféré lors de cette migration.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default HistoriqueShow;