import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const BulletinShow = ({ bulletin }) => {
    const { data, setData, put, processing, errors } = useForm({
        details: bulletin.details || []
    });

    const [saving, setSaving] = useState(false);

    const updateDetail = (index, field, value) => {
        const updatedDetails = [...data.details];
        updatedDetails[index][field] = value;
        
        if (field === 'note' || field === 'sur') {
            const note = field === 'note' ? value : updatedDetails[index].note;
            const sur = field === 'sur' ? value : updatedDetails[index].sur;
            updatedDetails[index].note_normalisee = sur > 0 ? Math.round((note / sur) * 20 * 100) / 100 : 0;
        }
        
        setData('details', updatedDetails);
    };

    const saveAll = () => {
        setSaving(true);
        router.put('/bulletin-details/bulk-update', {
            details: data.details
        }, {
            onFinish: () => setSaving(false)
        });
    };

    const saveDetail = (detail) => {
        router.put(`/bulletin-details/${detail.id}`, {
            note: detail.note,
            sur: detail.sur,
            note_normalisee: detail.note_normalisee,
            appreciation: detail.appreciation,
            coefficient: detail.coefficient,
        });
    };

    const downloadPDF = () => {
        window.open(`/bulletins/${bulletin.id}/download`, '_blank');
    };

    const getNoteColor = (note) => {
        if (note >= 16) return 'text-green-600 bg-green-50 border-green-200';
        if (note >= 14) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (note >= 12) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
        if (note >= 10) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const calculateMoyenne = () => {
        if (data.details.length === 0) return 0;
        
        const totalNotes = data.details.reduce((sum, detail) => 
            sum + (detail.note_normalisee * detail.coefficient), 0);
        const totalCoefficients = data.details.reduce((sum, detail) => 
            sum + detail.coefficient, 0);
        
        return totalCoefficients > 0 ? Math.round((totalNotes / totalCoefficients) * 100) / 100 : 0;
    };

    const moyenne = calculateMoyenne();

    return (
        <AppLayout>
            <Head title={`Détails du Bulletin - ${bulletin.eleve_nom}`} />

            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center mb-4">
                                <Link
                                    href="/bulletins"
                                    className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Retour aux bulletins
                                </Link>
                            </div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Détails du Bulletin
                            </h1>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-purple-100">
                                <div>
                                    <span className="font-semibold">Élève:</span> {bulletin.eleve_nom}
                                </div>
                                <div>
                                    <span className="font-semibold">Classe:</span> {bulletin.classe_nom} - {bulletin.niveau_nom}
                                </div>
                                <div>
                                    <span className="font-semibold">Période:</span> {bulletin.trimestre_nom} - {bulletin.annee_scolaire_nom}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-0 flex space-x-3">
                            <div className={`text-3xl font-bold ${getNoteColor(moyenne)} bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-center`}>
                                Moyenne: {moyenne}/20
                            </div>
                            <button
                                onClick={downloadPDF}
                                className="inline-flex items-center gap-2 px-6 py-4 bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-xl text-white hover:bg-green-500/30 transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Télécharger PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tableau des détails */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Notes par matière
                            </h2>
                            <button
                                onClick={saveAll}
                                disabled={saving}
                                className="mt-2 lg:mt-0 inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sauvegarde...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Sauvegarder tout
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Matière</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Coefficient</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Note</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sur</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Note /20</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Appréciation</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.details.map((detail, index) => (
                                    <tr key={detail.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {detail.matiere_nom}
                                            </div>
                                            {detail.professeur_nom && (
                                                <div className="text-sm text-gray-500">
                                                    {detail.professeur_nom}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="1"
                                                value={detail.coefficient}
                                                onChange={(e) => updateDetail(index, 'coefficient', parseInt(e.target.value) || 1)}
                                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                step="0.25"
                                                min="0"
                                                value={detail.note}
                                                onChange={(e) => updateDetail(index, 'note', parseFloat(e.target.value) || 0)}
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                step="1"
                                                min="1"
                                                value={detail.sur}
                                                onChange={(e) => updateDetail(index, 'sur', parseInt(e.target.value) || 1)}
                                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`w-20 px-3 py-2 rounded text-center font-medium border ${getNoteColor(detail.note_normalisee)}`}>
                                                {detail.note_normalisee}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={detail.appreciation || ''}
                                                onChange={(e) => updateDetail(index, 'appreciation', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Commentaire..."
                                                maxLength={100}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => saveDetail(detail)}
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Sauvegarder
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Résumé */}
                    {data.details.length > 0 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold text-gray-700">Total coefficients:</span>{' '}
                                    {data.details.reduce((sum, detail) => sum + detail.coefficient, 0)}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Moyenne générale:</span>{' '}
                                    <span className={`font-bold ${getNoteColor(moyenne)}`}>
                                        {moyenne}/20
                                    </span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Rang:</span>{' '}
                                    <span className="font-bold text-gray-900">#{bulletin.rang}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Moyenne classe:</span>{' '}
                                    <span className="font-bold text-gray-900">{bulletin.moyenne_classe}/20</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Informations du bulletin */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du Bulletin</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium">{bulletin.annuel ? 'Annuel' : 'Trimestriel'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date de création:</span>
                                <span className="font-medium">{new Date(bulletin.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Dernière modification:</span>
                                <span className="font-medium">{new Date(bulletin.updated_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                        <div className="space-y-3">
                            <Link
                                href={`/bulletins/${bulletin.id}/edit`}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier les signatures
                            </Link>
                            <button
                                onClick={() => {
                                    if (confirm('Êtes-vous sûr de vouloir supprimer ce bulletin ?')) {
                                        router.delete(`/bulletins/${bulletin.id}`);
                                    }
                                }}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer le bulletin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default BulletinShow;