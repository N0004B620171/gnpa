import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';

const InscriptionCompleteModal = ({
    isOpen,
    onClose,
    classe,
    anneesScolaires,
    services,
    itinerairesTransports,
    onSuccess
}) => {
    const [step, setStep] = useState(1);
    const [nouvelEleve, setNouvelEleve] = useState(false);
    const [servicesSelectionnes, setServicesSelectionnes] = useState([]);
    const [transportSelectionne, setTransportSelectionne] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        // Élève existant ou nouveau
        eleve_id: '',
        nouvel_eleve: false,

        // Informations élève (si nouveau)
        prenom: '',
        nom: '',
        date_naissance: '',
        sexe: '',
        photo: null,

        // Informations parent (si nouveau)
        parent_prenom: '',
        parent_nom: '',
        parent_telephone: '',
        parent_email: '',
        parent_adresse: '',

        // Inscription
        classe_id: classe?.id || '',
        annee_scolaire_id: '',
        date_inscription: new Date().toISOString().split('T')[0],
        statut: 'actif',

        // Services
        services: [],

        // Transport
        itineraire_transport_id: '',
        arret_id: ''
    });

    // Réinitialiser le formulaire quand la modal s'ouvre
    useEffect(() => {
        if (isOpen) {
            reset();
            setStep(1);
            setNouvelEleve(false);
            setServicesSelectionnes([]);
            setTransportSelectionne(null);
            setData('classe_id', classe?.id || '');
        }
    }, [isOpen, classe]);

    // Mettre à jour les services dans le form data
    useEffect(() => {
        setData('services', servicesSelectionnes);
    }, [servicesSelectionnes]);

    // Mettre à jour le transport dans le form data
    useEffect(() => {
        if (transportSelectionne) {
            setData('itineraire_transport_id', transportSelectionne.itineraire_id);
            setData('arret_id', transportSelectionne.arret_id);
        } else {
            setData('itineraire_transport_id', '');
            setData('arret_id', '');
        }
    }, [transportSelectionne]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/inscriptions/complete', {
            onSuccess: () => {
                reset();
                setStep(1);
                setNouvelEleve(false);
                setServicesSelectionnes([]);
                setTransportSelectionne(null);
                onClose();
                if (onSuccess) onSuccess();
            },
            preserveScroll: true
        });
    };

    const handleClose = () => {
        reset();
        setStep(1);
        setNouvelEleve(false);
        setServicesSelectionnes([]);
        setTransportSelectionne(null);
        onClose();
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const toggleService = (service) => {
        setServicesSelectionnes(prev => {
            const existe = prev.find(s => s.id === service.id);
            if (existe) {
                return prev.filter(s => s.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };

    // Dans votre composant React - correction de la fonction toggleNouvelEleve
    const toggleNouvelEleve = () => {
        const nouvelleValeur = !nouvelEleve;
        setNouvelEleve(nouvelleValeur);
        setData('nouvel_eleve', nouvelleValeur);

        if (nouvelleValeur) {
            // Si on passe en mode nouvel élève, on vide l'ID élève existant
            setData('eleve_id', '');
        } else {
            // Si on passe en mode élève existant, on vide les champs nouvel élève
            setData('prenom', '');
            setData('nom', '');
            setData('date_naissance', '');
            setData('sexe', '');
            setData('parent_prenom', '');
            setData('parent_nom', '');
            setData('parent_telephone', '');
            setData('parent_email', '');
            setData('parent_adresse', '');
        }
    };

    const calculerTotalServices = () => {
        return servicesSelectionnes.reduce((total, service) => total + parseFloat(service.montant || 0), 0);
    };

    const getArretsItineraire = (itineraireId) => {
        const itineraire = itinerairesTransports?.find(it => it.id == itineraireId);
        return itineraire?.arrets || [];
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Inscription Complète
                            </h2>
                            <p className="text-blue-100 mt-1">
                                Classe : {classe?.nom} - {classe?.niveau?.nom}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-blue-200 transition-colors p-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Étapes */}
                    <div className="flex justify-between mt-6">
                        {[1, 2, 3, 4].map((stepNumber) => (
                            <div key={stepNumber} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= stepNumber
                                        ? 'bg-white text-blue-600'
                                        : 'bg-blue-400 text-white'
                                    }`}>
                                    {stepNumber}
                                </div>
                                <span className="text-xs mt-1 text-blue-100">
                                    {stepNumber === 1 && 'Élève'}
                                    {stepNumber === 2 && 'Services'}
                                    {stepNumber === 3 && 'Transport'}
                                    {stepNumber === 4 && 'Validation'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Étape 1: Sélection de l'élève */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Informations de l'Élève
                            </h3>

                            {/* Choix type d'élève */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={nouvelEleve}
                                        onChange={toggleNouvelEleve}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        Créer un nouvel élève
                                    </span>
                                </label>
                            </div>

                            {!nouvelEleve ? (
                                /* Élève existant */
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Sélectionner un élève existant *
                                    </label>
                                    <select
                                        value={data.eleve_id}
                                        onChange={(e) => setData('eleve_id', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.eleve_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                            } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                        required
                                    >
                                        <option value="">Sélectionnez un élève</option>
                                        {/* Les élèves seront chargés dynamiquement */}
                                    </select>
                                    {errors.eleve_id && (
                                        <p className="text-red-600 text-sm mt-1">{errors.eleve_id}</p>
                                    )}
                                </div>
                            ) : (
                                /* Nouvel élève */
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Prénom *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.prenom}
                                                onChange={(e) => setData('prenom', e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.prenom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                                                required
                                            />
                                            {errors.prenom && (
                                                <p className="text-red-600 text-sm mt-1">{errors.prenom}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Nom *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nom}
                                                onChange={(e) => setData('nom', e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.nom ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                                    } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200`}
                                                required
                                            />
                                            {errors.nom && (
                                                <p className="text-red-600 text-sm mt-1">{errors.nom}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Date de naissance
                                            </label>
                                            <input
                                                type="date"
                                                value={data.date_naissance}
                                                onChange={(e) => setData('date_naissance', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Sexe
                                            </label>
                                            <select
                                                value={data.sexe}
                                                onChange={(e) => setData('sexe', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                            >
                                                <option value="">Sélectionnez</option>
                                                <option value="M">Garçon</option>
                                                <option value="F">Fille</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Informations parent */}
                                    <div className="border-t pt-6">
                                        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                                            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Informations du Parent
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Prénom du parent
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.parent_prenom}
                                                    onChange={(e) => setData('parent_prenom', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Nom du parent
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.parent_nom}
                                                    onChange={(e) => setData('parent_nom', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Téléphone
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={data.parent_telephone}
                                                    onChange={(e) => setData('parent_telephone', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={data.parent_email}
                                                    onChange={(e) => setData('parent_email', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Adresse
                                            </label>
                                            <textarea
                                                value={data.parent_adresse}
                                                onChange={(e) => setData('parent_adresse', e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Année scolaire */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Année Scolaire *
                                </label>
                                <select
                                    value={data.annee_scolaire_id}
                                    onChange={(e) => setData('annee_scolaire_id', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border-2 ${errors.annee_scolaire_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                        } focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white`}
                                    required
                                >
                                    <option value="">Sélectionnez une année scolaire</option>
                                    {anneesScolaires?.map((annee) => (
                                        <option key={annee.id} value={annee.id}>
                                            {annee.nom} {annee.actif && '(Active)'}
                                        </option>
                                    ))}
                                </select>
                                {errors.annee_scolaire_id && (
                                    <p className="text-red-600 text-sm mt-1">{errors.annee_scolaire_id}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Étape 2: Services */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Services Optionnels
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {services?.filter(service => service.actif).map((service) => (
                                    <div key={service.id} className="border-2 rounded-xl p-4 hover:border-purple-300 transition-all duration-200">
                                        <label className="flex items-start space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={servicesSelectionnes.some(s => s.id === service.id)}
                                                onChange={() => toggleService(service)}
                                                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="font-semibold text-gray-900">{service.nom}</span>
                                                        {service.code && (
                                                            <span className="text-sm text-gray-500 ml-2">({service.code})</span>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-purple-600">
                                                        {new Intl.NumberFormat('fr-FR', {
                                                            style: 'currency',
                                                            currency: 'XOF'
                                                        }).format(service.montant || 0)}
                                                    </span>
                                                </div>
                                                {service.description && (
                                                    <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                                                )}
                                                <div className="flex items-center mt-2">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${service.obligatoire
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {service.obligatoire ? 'Obligatoire' : 'Optionnel'}
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Total services */}
                            {servicesSelectionnes.length > 0 && (
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-purple-800">Total des services sélectionnés :</span>
                                        <span className="text-xl font-bold text-purple-600">
                                            {new Intl.NumberFormat('fr-FR', {
                                                style: 'currency',
                                                currency: 'XOF'
                                            }).format(calculerTotalServices())}
                                        </span>
                                    </div>
                                    <div className="text-sm text-purple-600 mt-2">
                                        {servicesSelectionnes.length} service{servicesSelectionnes.length > 1 ? 's' : ''} sélectionné{servicesSelectionnes.length > 1 ? 's' : ''}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Étape 3: Transport */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Transport Scolaire
                            </h3>

                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={transportSelectionne !== null}
                                        onChange={(e) => {
                                            if (!e.target.checked) {
                                                setTransportSelectionne(null);
                                            }
                                        }}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        Souscrire au service de transport
                                    </span>
                                </label>
                            </div>

                            {transportSelectionne !== null && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Itinéraire *
                                        </label>
                                        <select
                                            value={transportSelectionne?.itineraire_id || ''}
                                            onChange={(e) => {
                                                const itineraireId = e.target.value;
                                                setTransportSelectionne(prev => ({
                                                    ...prev,
                                                    itineraire_id: itineraireId,
                                                    arret_id: '' // Réinitialiser l'arrêt
                                                }));
                                            }}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white"
                                        >
                                            <option value="">Sélectionnez un itinéraire</option>
                                            {itinerairesTransports?.map((itineraire) => (
                                                <option key={itineraire.id} value={itineraire.id}>
                                                    {itineraire.nom}
                                                    {itineraire.bus && ` - Bus: ${itineraire.bus.immatriculation}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {transportSelectionne?.itineraire_id && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Arrêt *
                                            </label>
                                            <select
                                                value={transportSelectionne?.arret_id || ''}
                                                onChange={(e) => {
                                                    setTransportSelectionne(prev => ({
                                                        ...prev,
                                                        arret_id: e.target.value
                                                    }));
                                                }}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 bg-white"
                                            >
                                                <option value="">Sélectionnez un arrêt</option>
                                                {getArretsItineraire(transportSelectionne.itineraire_id).map((arret) => (
                                                    <option key={arret.id} value={arret.id}>
                                                        {arret.nom}
                                                        {arret.ordre && ` (Arrêt ${arret.ordre})`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Étape 4: Validation */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Récapitulatif
                            </h3>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                <h4 className="text-lg font-semibold text-blue-800 mb-4">Détails de l'Inscription</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h5 className="font-semibold text-gray-900">Informations Élève</h5>
                                        {nouvelEleve ? (
                                            <>
                                                <div>
                                                    <span className="text-sm text-gray-600">Nom complet:</span>
                                                    <p className="font-medium">{data.prenom} {data.nom}</p>
                                                </div>
                                                {data.date_naissance && (
                                                    <div>
                                                        <span className="text-sm text-gray-600">Date de naissance:</span>
                                                        <p className="font-medium">{new Date(data.date_naissance).toLocaleDateString('fr-FR')}</p>
                                                    </div>
                                                )}
                                                {data.sexe && (
                                                    <div>
                                                        <span className="text-sm text-gray-600">Sexe:</span>
                                                        <p className="font-medium">{data.sexe === 'M' ? 'Garçon' : 'Fille'}</p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div>
                                                <span className="text-sm text-gray-600">Élève existant sélectionné</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <h5 className="font-semibold text-gray-900">Inscription</h5>
                                        <div>
                                            <span className="text-sm text-gray-600">Classe:</span>
                                            <p className="font-medium">{classe?.nom}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Année scolaire:</span>
                                            <p className="font-medium">
                                                {anneesScolaires?.find(a => a.id == data.annee_scolaire_id)?.nom}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Date d'inscription:</span>
                                            <p className="font-medium">{new Date(data.date_inscription).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Services sélectionnés */}
                                {servicesSelectionnes.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-blue-200">
                                        <h5 className="font-semibold text-gray-900 mb-3">Services</h5>
                                        <div className="space-y-2">
                                            {servicesSelectionnes.map((service) => (
                                                <div key={service.id} className="flex justify-between text-sm">
                                                    <span>{service.nom}</span>
                                                    <span className="font-medium">
                                                        {new Intl.NumberFormat('fr-FR', {
                                                            style: 'currency',
                                                            currency: 'XOF'
                                                        }).format(service.montant || 0)}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
                                                <span>Total services:</span>
                                                <span>
                                                    {new Intl.NumberFormat('fr-FR', {
                                                        style: 'currency',
                                                        currency: 'XOF'
                                                    }).format(calculerTotalServices())}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Transport */}
                                {transportSelectionne && (
                                    <div className="mt-6 pt-6 border-t border-blue-200">
                                        <h5 className="font-semibold text-gray-900 mb-3">Transport</h5>
                                        <div className="text-sm">
                                            <div>
                                                <span className="text-gray-600">Itinéraire: </span>
                                                <span className="font-medium">
                                                    {itinerairesTransports?.find(it => it.id == transportSelectionne.itineraire_id)?.nom}
                                                </span>
                                            </div>
                                            {transportSelectionne.arret_id && (
                                                <div>
                                                    <span className="text-gray-600">Arrêt: </span>
                                                    <span className="font-medium">
                                                        {getArretsItineraire(transportSelectionne.itineraire_id).find(a => a.id == transportSelectionne.arret_id)?.nom}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={step === 1}
                            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Précédent
                        </button>

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium flex items-center gap-2"
                            >
                                Suivant
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 transition-all duration-200 font-medium flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Inscription en cours...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Confirmer l'inscription</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InscriptionCompleteModal;