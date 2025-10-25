import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Edit = ({ annee, annee_actuelle }) => {
    const { errors } = usePage().props;

    // Protection contre les données manquantes
    if (!annee) {
        return (
            <AppLayout>
                <Head title="Année scolaire non trouvée" />
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Année scolaire non trouvée
                    </h1>
                    <p className="text-gray-600 mb-6">
                        L'année scolaire que vous essayez de modifier n'existe pas.
                    </p>
                    <Link
                        href="/annees-scolaires"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                    >
                        Retour à la liste
                    </Link>
                </div>
            </AppLayout>
        );
    }

    const { data, setData, put, processing } = useForm({
        nom: annee.nom || '',
        date_debut: annee.date_debut || '',
        date_fin: annee.date_fin || '',
        actif: annee.actif || false,
        description: annee.description || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/annees-scolaires/${annee.id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const calculateDateFin = (dateDebut) => {
        if (!dateDebut) return '';
        const date = new Date(dateDebut);
        date.setFullYear(date.getFullYear() + 1);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    };

    const handleDateDebutChange = (dateDebut) => {
        setData('date_debut', dateDebut);
        if (dateDebut && !data.date_fin) {
            setData('date_fin', calculateDateFin(dateDebut));
        }
    };

    return (
        <AppLayout>
            <Head title={`Modifier ${annee.nom}`} />

            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier l'année scolaire
                            </h1>
                            <p className="text-indigo-100 mt-2 text-lg">
                                Mettez à jour les informations de {annee.nom}
                            </p>
                        </div>
                        
                        {/* Badge statut */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Édition</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations de l'année scolaire */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Informations de l'année scolaire
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom de l'année *
                                </label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                    } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: 2023-2024"
                                />
                                {errors.nom && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.nom}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white resize-none"
                                    placeholder="Description optionnelle de l'année scolaire..."
                                    maxLength={500}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {data.description.length}/500 caractères
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Date de début *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_debut}
                                        onChange={(e) => handleDateDebutChange(e.target.value)}
                                        className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                            errors.date_debut ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                        } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                    />
                                    {errors.date_debut && (
                                        <div className="flex items-center mt-2 text-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">{errors.date_debut}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Date de fin *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_fin}
                                        onChange={(e) => setData('date_fin', e.target.value)}
                                        className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                            errors.date_fin ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                        } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                    />
                                    {errors.date_fin && (
                                        <div className="flex items-center mt-2 text-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">{errors.date_fin}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`rounded-xl p-4 border ${
                                annee.actif 
                                    ? 'bg-green-50 border-green-200' 
                                    : 'bg-blue-50 border-blue-200'
                            }`}>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="actif"
                                        checked={data.actif}
                                        onChange={(e) => setData('actif', e.target.checked)}
                                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="actif" className="ml-3 block text-sm font-medium text-gray-900">
                                        Définir comme année scolaire active
                                    </label>
                                </div>
                                <p className={`text-sm mt-2 ${
                                    annee.actif 
                                        ? 'text-green-700' 
                                        : annee_actuelle && annee_actuelle.id !== annee.id
                                        ? 'text-blue-700'
                                        : 'text-gray-700'
                                }`}>
                                    {annee.actif 
                                        ? '✅ Cette année scolaire est actuellement active.'
                                        : annee_actuelle && annee_actuelle.id !== annee.id
                                        ? `⚠️ L'année active actuelle est "${annee_actuelle.nom}". En activant celle-ci, l'autre sera désactivée.`
                                        : '📝 Cette année scolaire est inactive.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Aperçu */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                        <h4 className="text-sm font-semibold text-indigo-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Aperçu des modifications
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-indigo-100">
                                <div>
                                    <div className="font-medium text-indigo-900">
                                        {data.nom || 'Nom de l\'année'}
                                    </div>
                                    <div className="text-sm text-indigo-600">
                                        {data.date_debut && data.date_fin 
                                            ? `${formatDate(data.date_debut)} - ${formatDate(data.date_fin)}`
                                            : 'Période non définie'
                                        }
                                    </div>
                                    {data.description && (
                                        <div className="text-sm text-gray-600 mt-2">
                                            {data.description}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-indigo-500">Statut</div>
                                    <div className={`text-sm font-bold ${data.actif ? 'text-green-600' : 'text-gray-600'}`}>
                                        {data.actif ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                            </div>
                            
                            {annee.trimestres && annee.trimestres.length > 0 && (
                                <div className="bg-white rounded-xl border border-indigo-100 p-4">
                                    <h5 className="text-sm font-semibold text-indigo-900 mb-2">
                                        Trimestres existants ({annee.trimestres.length}) :
                                    </h5>
                                    <div className="space-y-2 text-sm">
                                        {annee.trimestres.map((trimestre) => (
                                            <div key={trimestre.id} className="flex justify-between items-center py-1">
                                                <span className="text-indigo-700">{trimestre.nom}</span>
                                                <span className="text-indigo-600">
                                                    {formatDate(trimestre.date_debut)} - {formatDate(trimestre.date_fin)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Link
                                href={`/annees-scolaires/${annee.id}`}
                                className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full sm:w-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Retour aux détails
                            </Link>
                            <Link
                                href="/annees-scolaires"
                                className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full sm:w-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                </svg>
                                Liste des années
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="font-semibold">Mise à jour...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-semibold">Mettre à jour</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;