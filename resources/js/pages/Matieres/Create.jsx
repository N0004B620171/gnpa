import React, { useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Select from 'react-select';

const Create = ({ niveaux, professeurs }) => {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        coefficient: 1, // Coefficient désactivé à 1
        niveau_id: '',
        professeur_id: ''
    });

    const [selectedNiveau, setSelectedNiveau] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/matieres');
    };

    // Préparer les options pour react-select
    const niveauOptions = useMemo(() => [
        { value: '', label: 'Tous les niveaux (Matière générale)', data: null },
        ...niveaux.map(niveau => ({
            value: niveau.id,
            label: `${niveau.nom} - ${niveau.cycle?.nom}`,
            data: niveau
        }))
    ], [niveaux]);

    const professeurOptions = useMemo(() => [
        { value: '', label: 'Aucun professeur assigné', data: null },
        ...professeurs.map(professeur => ({
            value: professeur.id,
            label: `${professeur.prenom} ${professeur.nom}${professeur.specialite ? ` - ${professeur.specialite}` : ''}`,
            data: professeur
        }))
    ], [professeurs]);

    // Trouver les valeurs sélectionnées
    const selectedNiveauOption = useMemo(() =>
        niveauOptions.find(opt => opt.value == data.niveau_id) || niveauOptions[0],
        [niveauOptions, data.niveau_id]
    );

    const selectedProfesseurOption = useMemo(() =>
        professeurOptions.find(opt => opt.value == data.professeur_id) || professeurOptions[0],
        [professeurOptions, data.professeur_id]
    );

    const handleNiveauChange = (selectedOption) => {
        const niveauId = selectedOption ? selectedOption.value : '';
        setData('niveau_id', niveauId);
        const niveau = selectedOption ? selectedOption.data : null;
        setSelectedNiveau(niveau);
    };

    const handleProfesseurChange = (selectedOption) => {
        const professeurId = selectedOption ? selectedOption.value : '';
        setData('professeur_id', professeurId);
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            padding: '4px 8px',
            borderRadius: '12px',
            borderWidth: '2px',
            borderColor: state.isFocused
                ? (errors.niveau_id || errors.professeur_id ? '#ef4444' : '#3b82f6')
                : (errors.niveau_id || errors.professeur_id ? '#ef4444' : '#e5e7eb'),
            boxShadow: state.isFocused
                ? `0 0 0 4px ${(errors.niveau_id || errors.professeur_id ? '#fecaca' : '#dbeafe')}`
                : 'none',
            '&:hover': {
                borderColor: state.isFocused
                    ? (errors.niveau_id || errors.professeur_id ? '#ef4444' : '#3b82f6')
                    : (errors.niveau_id || errors.professeur_id ? '#ef4444' : '#d1d5db'),
            },
            transition: 'all 0.2s',
            backgroundColor: '#ffffff',
            minHeight: '56px',
            fontSize: '16px',
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            overflow: 'hidden',
        }),
        menuList: (base) => ({
            ...base,
            padding: 0,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#3b82f6'
                : state.isFocused
                    ? '#dbeafe'
                    : '#ffffff',
            color: state.isSelected ? '#ffffff' : '#1f2937',
            padding: '12px 16px',
            fontSize: '16px',
            '&:active': {
                backgroundColor: '#2563eb',
            },
        }),
        singleValue: (base) => ({
            ...base,
            color: '#1f2937',
            fontSize: '16px',
        }),
        placeholder: (base) => ({
            ...base,
            color: '#9ca3af',
            fontSize: '16px',
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: '#6b7280',
            '&:hover': {
                color: '#374151',
            },
        }),
        clearIndicator: (base) => ({
            ...base,
            color: '#6b7280',
            '&:hover': {
                color: '#374151',
            },
        }),
    };

    const disabledStyles = {
        ...customStyles,
        control: (base, state) => ({
            ...customStyles.control(base, state),
            backgroundColor: '#f9fafb',
            borderColor: '#e5e7eb',
            cursor: 'not-allowed',
        }),
        singleValue: (base) => ({
            ...base,
            color: '#6b7280',
        })
    };

    const coefficientOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


    return (
        <AppLayout>
            <Head title="Nouvelle Matière" />

            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer une nouvelle matière
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Ajoutez une nouvelle matière à l'établissement
                            </p>
                        </div>

                        {/* Badge statut */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations de la matière */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Informations de la matière
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom de la matière *
                                </label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                        } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: Mathématiques, Français, Histoire-Géographie..."
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
                                    Coefficient *
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {coefficientOptions.map((coeff) => (
                                        <button
                                            disabled="true"
                                            key={coeff}
                                            type="button"
                                            onClick={() => setData('coefficient', coeff)}
                                            className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${data.coefficient === coeff
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                                                }`}
                                        >
                                            {coeff}
                                        </button>
                                    ))}
                                </div>
                                {errors.coefficient && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.coefficient}</span>
                                    </div>
                                )}
                                <div className="text-xs text-gray-500 mt-2">
                                    Le coefficient détermine le poids de la matière dans le calcul des moyennes
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Niveau associé
                                </label>
                                <Select
                                    options={niveauOptions}
                                    value={selectedNiveauOption}
                                    onChange={handleNiveauChange}
                                    placeholder="Sélectionnez un niveau..."
                                    styles={customStyles}
                                    isClearable
                                    noOptionsMessage={() => "Aucun niveau trouvé"}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    Laisser "Tous les niveaux" si la matière est commune à tous les niveaux
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Professeur responsable
                                </label>
                                <Select
                                    options={professeurOptions}
                                    value={selectedProfesseurOption}
                                    onChange={handleProfesseurChange}
                                    placeholder="Sélectionnez un professeur..."
                                    styles={customStyles}
                                    isClearable
                                    noOptionsMessage={() => "Aucun professeur trouvé"}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    Optionnel - vous pourrez assigner un professeur plus tard
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aperçu */}
                    {(data.nom || data.niveau_id) && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu de la matière
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100">
                                    <div>
                                        <div className="font-medium text-blue-900">
                                            {data.nom || 'Nom de la matière'}
                                        </div>
                                        <div className="text-sm text-blue-600">
                                            Coefficient: <span className="font-bold">1</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-blue-500">Niveau</div>
                                        <div className="text-sm font-bold text-blue-700">
                                            {selectedNiveau ?
                                                `${selectedNiveau.nom}`
                                                : 'Tous niveaux'
                                            }
                                        </div>
                                    </div>
                                </div>
                                {data.professeur_id && (
                                    <div className="flex items-center p-3 bg-white rounded-xl border border-blue-100">
                                        <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 font-bold text-xs">
                                                {professeurs.find(p => p.id == data.professeur_id)?.prenom[0]}{professeurs.find(p => p.id == data.professeur_id)?.nom[0]}
                                            </span>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-blue-900">
                                                {professeurs.find(p => p.id == data.professeur_id)?.prenom} {professeurs.find(p => p.id == data.professeur_id)?.nom}
                                            </div>
                                            <div className="text-xs text-blue-600">Professeur responsable</div>
                                        </div>
                                    </div>
                                )}
                                <div className="text-sm text-blue-700">
                                    💡 Vous pourrez associer cette matière à des compositions après sa création
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/matieres"
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à la liste
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="font-semibold">Création en cours...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-semibold">Créer la matière</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Create;