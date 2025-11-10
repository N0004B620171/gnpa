import React, { useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Select from 'react-select';

const Edit = ({ inscription, eleves, classes, anneesScolaires }) => {
    const { data, setData, put, processing, errors } = useForm({
        eleve_id: inscription.eleve_id,
        classe_id: inscription.classe_id,
        annee_scolaire_id: inscription.annee_scolaire_id,
        date_inscription: inscription.date_inscription.split('T')[0],
        statut: inscription.statut
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/inscriptions/${inscription.id}`);
    };

    // Préparer les options pour react-select
    const eleveOptions = useMemo(() =>
        eleves.map(eleve => ({
            value: eleve.id,
            label: `${eleve.prenom} ${eleve.nom}`,
            ...eleve
        })),
        [eleves]
    );

    const classeOptions = useMemo(() =>
        classes.map(classe => ({
            value: classe.id,
            label: `${classe.niveau?.nom} ${classe.nom} - ${classe.niveau?.cycle ? ` (${classe.niveau.cycle.nom})` : ''}`,
            ...classe
        })),
        [classes]
    );

    const anneeOptions = useMemo(() =>
        anneesScolaires.map(annee => ({
            value: annee.id,
            label: annee.nom,
            ...annee
        })),
        [anneesScolaires]
    );

    // Trouver les valeurs sélectionnées
    const selectedEleveOption = useMemo(() =>
        eleveOptions.find(opt => opt.value == data.eleve_id) || null,
        [eleveOptions, data.eleve_id]
    );

    const selectedClasseOption = useMemo(() =>
        classeOptions.find(opt => opt.value == data.classe_id) || null,
        [classeOptions, data.classe_id]
    );

    const selectedAnneeOption = useMemo(() =>
        anneeOptions.find(opt => opt.value == data.annee_scolaire_id) || null,
        [anneeOptions, data.annee_scolaire_id]
    );

    const customStyles = {
        control: (base, state) => ({
            ...base,
            padding: '4px 8px',
            borderRadius: '12px',
            borderWidth: '2px',
            borderColor: state.isFocused
                ? (errors.classe_id || errors.annee_scolaire_id ? '#ef4444' : '#3b82f6')
                : (errors.classe_id || errors.annee_scolaire_id ? '#ef4444' : '#e5e7eb'),
            boxShadow: state.isFocused
                ? `0 0 0 4px ${(errors.classe_id || errors.annee_scolaire_id ? '#fecaca' : '#dbeafe')}`
                : 'none',
            '&:hover': {
                borderColor: state.isFocused
                    ? (errors.classe_id || errors.annee_scolaire_id ? '#ef4444' : '#3b82f6')
                    : (errors.classe_id || errors.annee_scolaire_id ? '#ef4444' : '#d1d5db'),
            },
            transition: 'all 0.2s',
            backgroundColor: state.isDisabled ? '#f9fafb' : '#ffffff',
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
        singleValue: (base, state) => ({
            ...base,
            color: state.isDisabled ? '#6b7280' : '#1f2937',
            fontSize: '16px',
        }),
        placeholder: (base) => ({
            ...base,
            color: '#9ca3af',
            fontSize: '16px',
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isDisabled ? '#d1d5db' : '#6b7280',
            '&:hover': {
                color: state.isDisabled ? '#d1d5db' : '#374151',
            },
        }),
        clearIndicator: (base, state) => ({
            ...base,
            color: state.isDisabled ? '#d1d5db' : '#6b7280',
            '&:hover': {
                color: state.isDisabled ? '#d1d5db' : '#374151',
            },
        }),
        indicatorSeparator: (base, state) => ({
            ...base,
            backgroundColor: state.isDisabled ? '#e5e7eb' : '#e5e7eb',
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

    return (
        <AppLayout>
            <Head title={`Modifier l'inscription`} />

            <div className="max-w-2xl mx-auto">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier l'Inscription
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Mettez à jour les informations de l'inscription
                            </p>
                        </div>

                        {/* Badge statut */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Édition</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    <div className="space-y-8">
                        {/* Informations de l'inscription */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Informations de l'inscription
                            </h3>

                            <div className="space-y-6">
                                {/* Sélection de l'élève (désactivé) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Élève *
                                    </label>
                                    <Select
                                        options={eleveOptions}
                                        value={selectedEleveOption}
                                        onChange={(selectedOption) => setData('eleve_id', selectedOption?.value || '')}
                                        placeholder="Élève sélectionné"
                                        styles={disabledStyles}
                                        isDisabled={true}
                                        noOptionsMessage={() => "Aucun élève trouvé"}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        L'élève ne peut pas être modifié pour cette inscription
                                    </div>
                                </div>

                                {/* Sélection de la classe */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Classe *
                                    </label>
                                    <Select
                                        options={classeOptions}
                                        value={selectedClasseOption}
                                        onChange={(selectedOption) => setData('classe_id', selectedOption?.value || '')}
                                        placeholder="Sélectionnez une classe..."
                                        styles={customStyles}
                                        isClearable
                                        noOptionsMessage={() => "Aucune classe trouvée"}
                                    />
                                    {errors.classe_id && (
                                        <div className="flex items-center mt-2 text-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">{errors.classe_id}</span>
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-1">
                                        Sélectionnez la nouvelle classe pour l'élève
                                    </div>
                                </div>

                                {/* Sélection de l'année scolaire */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Année Scolaire *
                                    </label>
                                    <Select
                                        options={anneeOptions}
                                        value={selectedAnneeOption}
                                        onChange={(selectedOption) => setData('annee_scolaire_id', selectedOption?.value || '')}
                                        placeholder="Sélectionnez une année scolaire..."
                                        styles={customStyles}
                                        isClearable
                                        noOptionsMessage={() => "Aucune année scolaire trouvée"}
                                    />
                                    {errors.annee_scolaire_id && (
                                        <div className="flex items-center mt-2 text-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">{errors.annee_scolaire_id}</span>
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-1">
                                        Sélectionnez l'année scolaire pour l'inscription
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Date et statut */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Paramètres supplémentaires
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Date d'inscription
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_inscription}
                                        onChange={(e) => setData('date_inscription', e.target.value)}
                                        className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.date_inscription ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                            } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                    />
                                    {errors.date_inscription && (
                                        <div className="flex items-center mt-2 text-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">{errors.date_inscription}</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Statut
                                    </label>
                                    <select
                                        value={data.statut}
                                        onChange={(e) => setData('statut', e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                    >
                                        <option value="actif">Actif</option>
                                        <option value="inactif">Inactif</option>
                                    </select>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Statut actuel de l'inscription
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Aperçu des modifications */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu des modifications
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-blue-100">
                                    <div>
                                        <div className="font-medium text-blue-900">
                                            {selectedEleveOption?.label || 'Élève non sélectionné'}
                                        </div>
                                        <div className="text-xs text-blue-600">Élève (non modifiable)</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-blue-100">
                                    <div>
                                        <div className="font-medium text-blue-900">
                                            {selectedClasseOption?.label || 'Classe non sélectionnée'}
                                        </div>
                                        <div className="text-xs text-blue-600">Nouvelle classe</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-blue-100">
                                    <div>
                                        <div className="font-medium text-blue-900">
                                            {selectedAnneeOption?.label || 'Année non sélectionnée'}
                                        </div>
                                        <div className="text-xs text-blue-600">Nouvelle année scolaire</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                            <Link
                                href={`/inscriptions/${inscription.id}`}
                                className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Annuler
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
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;