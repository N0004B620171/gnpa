import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';

const EleveForm = ({ eleve, isEdit = false }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        prenom: eleve?.prenom || '',
        nom: eleve?.nom || '',
        date_naissance: eleve?.date_naissance || '',
        sexe: eleve?.sexe || '',
        photo: null,
    });

    const [photoPreview, setPhotoPreview] = useState(eleve?.photo_url || null);

    function handleSubmit(e) {
        e.preventDefault();
        if (isEdit) {
            put(route('eleves.update', eleve.id));
        } else {
            post(route('eleves.store'));
        }
    }

    function handlePhotoChange(e) {
        const file = e.target.files[0];
        setData('photo', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPhotoPreview(eleve?.photo_url || null);
        }
    }

    // Calculer l'âge pour l'aperçu
    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isEdit ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                )}
                            </svg>
                            {isEdit ? `Modifier l'élève` : 'Créer un nouvel élève'}
                        </h1>
                        <p className="text-indigo-100 mt-2 text-lg">
                            {isEdit 
                                ? `Modifiez les informations de ${eleve.prenom} ${eleve.nom}`
                                : 'Ajoutez un nouvel élève à votre établissement'
                            }
                        </p>
                    </div>
                    
                    {/* Badge statut */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="text-sm font-medium">
                            {isEdit ? 'Édition' : 'Nouveau'}
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Informations personnelles */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Informations personnelles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Prénom *
                            </label>
                            <input
                                type="text"
                                value={data.prenom}
                                onChange={(e) => setData('prenom', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.prenom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                placeholder="Entrez le prénom"
                            />
                            {errors.prenom && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.prenom}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Nom *
                            </label>
                            <input
                                type="text"
                                value={data.nom}
                                onChange={(e) => setData('nom', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                                placeholder="Entrez le nom"
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
                    </div>
                </div>

                {/* Informations supplémentaires */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Informations supplémentaires
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Date de naissance
                            </label>
                            <input
                                type="date"
                                value={data.date_naissance}
                                onChange={(e) => setData('date_naissance', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.date_naissance ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white`}
                            />
                            {errors.date_naissance && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.date_naissance}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Sexe
                            </label>
                            <div className="relative">
                                <select
                                    value={data.sexe}
                                    onChange={(e) => setData('sexe', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                        errors.sexe ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                    } focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 bg-white appearance-none`}
                                >
                                    <option value="">-- Choisir --</option>
                                    <option value="M">Masculin</option>
                                    <option value="F">Féminin</option>
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                </svg>
                            </div>
                            {errors.sexe && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.sexe}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Photo */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Photo
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1">
                            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 hover:border-indigo-400 relative ${
                                errors.photo ? 'border-red-500' : 'border-gray-300'
                            }`}>
                                <input
                                    type="file"
                                    onChange={handlePhotoChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-3 text-sm text-gray-600">
                                    <span className="font-medium text-indigo-600">Cliquez pour uploader</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG jusqu'à 2MB</p>
                            </div>
                            {errors.photo && (
                                <div className="flex items-center mt-2 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm">{errors.photo}</span>
                                </div>
                            )}
                        </div>

                        {photoPreview && (
                            <div className="md:w-1/3 flex flex-col items-center">
                                <p className="text-xs text-gray-500 text-center mb-2">
                                    {isEdit && eleve.photo ? 'Nouvelle photo' : 'Aperçu'}
                                </p>
                                <div className="relative">
                                    <img 
                                        src={photoPreview} 
                                        alt="Aperçu de la photo" 
                                        className="h-32 w-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                                    />
                                    {isEdit && eleve.photo && !data.photo && (
                                        <span className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            Actuelle
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Aperçu */}
                {(data.prenom || data.nom || data.date_naissance || data.sexe) && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                        <h4 className="text-sm font-semibold text-indigo-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Aperçu de l'élève
                        </h4>
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                                {photoPreview ? (
                                    <img 
                                        src={photoPreview} 
                                        alt="Aperçu" 
                                        className="h-16 w-16 rounded-xl object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-bold text-xl">
                                        {data.prenom.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-indigo-700">Nom :</span>
                                        <span className="ml-2 text-indigo-900">
                                            {data.prenom && data.nom ? `${data.prenom} ${data.nom}` : <span className="text-red-500">Incomplet</span>}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-indigo-700">Date naissance :</span>
                                        <span className="ml-2 text-indigo-900">
                                            {data.date_naissance ? new Date(data.date_naissance).toLocaleDateString('fr-FR') : <span className="text-orange-500">Non renseignée</span>}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-indigo-700">Âge :</span>
                                        <span className="ml-2 text-indigo-900">
                                            {data.date_naissance ? `${calculateAge(data.date_naissance)} ans` : <span className="text-orange-500">-</span>}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-indigo-700">Sexe :</span>
                                        <span className="ml-2 text-indigo-900">
                                            {data.sexe ? (data.sexe === 'M' ? 'Garçon' : 'Fille') : <span className="text-orange-500">Non spécifié</span>}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                    <Link
                        href={route("eleves.index")}
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
                        className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:from-indigo-700 hover:to-purple-800 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="font-semibold">Enregistrement...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-semibold">
                                    {isEdit ? 'Mettre à jour' : 'Créer l\'élève'}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EleveForm;