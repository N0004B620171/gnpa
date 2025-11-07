import React, { useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Select from 'react-select';

const Create = ({ trimestres, classes, matieres }) => {
    const { data, setData, post, processing, errors } = useForm({
        trimestre_id: '',
        classe_id: '',
        nom: '',
        date: '',
        langue: 'fr',
        is_controle: false,
        matieres: []
    });

    const [selectedMatieres, setSelectedMatieres] = useState([]);

    // Préparer les options pour react-select
    const trimestreOptions = useMemo(() => [
        { value: '', label: 'Sélectionner un trimestre' },
        ...trimestres.map((trimestre) => ({
            value: trimestre.id,
            label: trimestre.nom,
            ...trimestre
        }))
    ], [trimestres]);

    const classeOptions = useMemo(() => [
        { value: '', label: 'Sélectionner une classe' },
        ...classes.map((classe) => ({
            value: classe.id,
            label: classe.nom,
            ...classe
        }))
    ], [classes]);

    const langueOptions = [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'Anglais' },
        { value: 'ar', label: 'Arabe' }
    ];

    // Préparer les options pour le multi-select des matières
    const matiereOptions = useMemo(() => {
        let filteredMatieres = matieres;
        return filteredMatieres.map((matiere) => ({
            value: matiere.id,
            label: `${matiere.nom} (Coef. ${matiere.coefficient})`,
            coefficient: matiere.coefficient,
            niveau: matiere.niveau,
            professeur: matiere.professeur,
            ...matiere
        }));
    }, [matieres, classes, data.classe_id]);

    // Styles personnalisés pour react-select
    const customStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '56px',
            borderRadius: '12px',
            border: `2px solid ${state.isFocused ? '#3b82f6' : errors[state.name] ? '#ef4444' : '#e5e7eb'}`,
            boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#3b82f6' : errors[state.name] ? '#ef4444' : '#d1d5db'
            },
            backgroundColor: 'white'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
            padding: '12px 16px',
            fontSize: '14px',
            '&:active': {
                backgroundColor: state.isSelected ? '#3b82f6' : '#bfdbfe'
            }
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            zIndex: 50
        }),
        menuList: (base) => ({
            ...base,
            borderRadius: '10px',
            padding: '4px'
        }),
        placeholder: (base) => ({
            ...base,
            color: '#6b7280',
            fontSize: '14px'
        }),
        singleValue: (base) => ({
            ...base,
            color: '#1f2937',
            fontSize: '14px',
            fontWeight: '500'
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#e0e7ff',
            borderRadius: '8px',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#3730a3',
            fontWeight: '500',
            fontSize: '13px'
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#6366f1',
            ':hover': {
                backgroundColor: '#6366f1',
                color: 'white'
            }
        }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? '#3b82f6' : '#6b7280',
            '&:hover': {
                color: '#3b82f6'
            }
        }),
        clearIndicator: (base) => ({
            ...base,
            color: '#6b7280',
            '&:hover': {
                color: '#ef4444'
            }
        })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Données envoyées:', data);
        post('/compositions');
    };

    const handleMatiereChange = (selectedOptions) => {
        const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedMatieres(selectedOptions || []);
        setData('matieres', selectedIds);
    };




    // Valeurs sélectionnées pour react-select
    const selectedTrimestre = trimestreOptions.find(opt => opt.value == data.trimestre_id) || null;
    const selectedClasse = classeOptions.find(opt => opt.value == data.classe_id) || null;
    const selectedLangue = langueOptions.find(opt => opt.value == data.langue) || langueOptions[0];

    return (
        <AppLayout>
            <Head title="Nouvelle Composition" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête avec gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Créer une nouvelle composition
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg">
                                Organisez une nouvelle évaluation pour une classe
                            </p>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-sm font-medium">Nouveau</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Informations de base */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Informations de la composition
                        </h3>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Nom de la composition *
                                </label>
                                <input
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                        } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                    placeholder="Ex: Composition de Mathématiques, Examen de Français..."
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
                                    Type de composition
                                </label>
                                <div className="flex space-x-4 mt-2">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="is_controle"
                                            checked={!data.is_controle}
                                            onChange={() => setData('is_controle', false)}
                                            className="hidden"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 ${!data.is_controle ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                            }`}>
                                            {!data.is_controle && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <span className="text-gray-700">Composition normale</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="is_controle"
                                            checked={data.is_controle}
                                            onChange={() => setData('is_controle', true)}
                                            className="hidden"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 ${data.is_controle ? 'border-green-500 bg-green-500' : 'border-gray-300'
                                            }`}>
                                            {data.is_controle && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <span className="text-gray-700">Contrôle continu</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Trimestre *
                                </label>
                                <Select
                                    options={trimestreOptions}
                                    value={selectedTrimestre}
                                    onChange={(selectedOption) => setData('trimestre_id', selectedOption?.value || '')}
                                    styles={customStyles}
                                    isClearable
                                    placeholder="Sélectionner un trimestre"
                                />
                                {errors.trimestre_id && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.trimestre_id}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Classe *
                                </label>
                                <Select
                                    options={classeOptions}
                                    value={selectedClasse}
                                    onChange={(selectedOption) => {
                                        setData('classe_id', selectedOption?.value || '');
                                        // Réinitialiser les matières sélectionnées quand la classe change
                                        setSelectedMatieres([]);
                                        setData('matieres', []);
                                    }}
                                    styles={customStyles}
                                    isClearable
                                    placeholder="Sélectionner une classe"
                                />
                                {errors.classe_id && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.classe_id}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Langue *
                                </label>
                                <Select
                                    options={langueOptions}
                                    value={selectedLangue}
                                    onChange={(selectedOption) => setData('langue', selectedOption?.value || 'fr')}
                                    styles={customStyles}
                                    isSearchable={false}
                                />
                                {errors.langue && (
                                    <div className="flex items-center mt-2 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm">{errors.langue}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sélection des matières */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Matières à évaluer *
                        </h3>

                        {errors.matieres && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium">{errors.matieres}</span>
                                </div>
                            </div>
                        )}

                        {!data.classe_id ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="text-lg font-medium">Veuillez d'abord sélectionner une classe</p>
                                <p className="text-sm mt-1">Les matières disponibles s'afficheront automatiquement</p>
                            </div>
                        ) : matiereOptions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="text-lg font-medium">Aucune matière disponible</p>
                                <p className="text-sm mt-1">Aucune matière n'est associée au niveau de cette classe</p>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Sélectionnez les matières *
                                </label>
                                <Select
                                    options={matiereOptions}
                                    value={selectedMatieres}
                                    onChange={handleMatiereChange}
                                    styles={customStyles}
                                    isMulti
                                    isSearchable
                                    placeholder="Recherchez et sélectionnez les matières..."
                                    noOptionsMessage={() => "Aucune matière trouvée"}
                                    formatOptionLabel={({ label, coefficient, niveau, professeur }) => (
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-medium">{label.split(' (Coef.')[0]}</div>
                                                <div className="text-xs text-gray-500 flex space-x-2 mt-1">
                                                    {niveau && (
                                                        <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                                                            {niveau.nom}
                                                        </span>
                                                    )}
                                                    {professeur && (
                                                        <span className="text-gray-600">
                                                            Prof: {professeur.prenom} {professeur.nom}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                                Coef. {coefficient}
                                            </span>
                                        </div>
                                    )}
                                />
                                <div className="mt-2 text-sm text-gray-500">
                                    {selectedMatieres.length} matière(s) sélectionnée(s)
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Aperçu */}
                    {(data.nom || data.trimestre_id || data.classe_id || selectedMatieres.length > 0) && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Aperçu de la composition
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100">
                                    <div>
                                        <div className="font-medium text-blue-900">
                                            {data.nom || 'Nom de la composition'}
                                        </div>
                                        <div className="text-sm text-blue-600">
                                            {data.date && `Date: ${new Date(data.date).toLocaleDateString('fr-FR')}`}
                                            {data.trimestre_id && ` • ${trimestres.find(t => t.id == data.trimestre_id)?.nom}`}
                                            {data.classe_id && ` • ${classes.find(c => c.id == data.classe_id)?.nom}`}
                                            {` • ${selectedLangue.label}`}
                                            {data.is_controle && ` • Contrôle continu`}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-blue-500">Matières</div>
                                        <div className="text-sm font-bold text-blue-700">
                                            {selectedMatieres.length} sélectionnée(s)
                                        </div>
                                    </div>
                                </div>

                                {selectedMatieres.length > 0 && (
                                    <div className="bg-white rounded-xl border border-blue-100 p-4">
                                        <h5 className="text-sm font-semibold text-blue-900 mb-2">Matières sélectionnées :</h5>
                                        <div className="space-y-2 text-sm">
                                            {selectedMatieres.map(matiere => (
                                                <div key={matiere.value} className="flex justify-between items-center py-1">
                                                    <span className="text-blue-700">{matiere.label.split(' (Coef.')[0]}</span>
                                                    <span className="text-blue-600">Coef. {matiere.coefficient}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="text-sm text-blue-700">
                                    💡 Vous pourrez saisir les notes après la création de la composition
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href="/compositions"
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour à la liste
                        </Link>

                        <button
                            type="submit"
                            disabled={processing || selectedMatieres.length === 0}
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
                                    <span className="font-semibold">
                                        {`Créer la composition (${selectedMatieres.length} matière${selectedMatieres.length > 1 ? 's' : ''})`}
                                    </span>
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