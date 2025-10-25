import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Create = ({ services, cycles, niveaux, classes, inscriptions, serviceId }) => {
    const { data, setData, post, processing, errors } = useForm({
        service_id: serviceId || '',
        ciblable_type: '',
        ciblable_id: ''
    });

    const [filteredTargets, setFilteredTargets] = useState([]);
    const [targetLabel, setTargetLabel] = useState('Sélectionnez une cible');

    // Fonction utilitaire pour normaliser les types
    const normalizeType = (type) => {
        if (!type) return '';
        // Remplace tous les \\ par \
        return type.replace(/\\\\/g, '\\');
    };

    // Debug : données reçues
    useEffect(() => {
        console.log('📦 Données reçues depuis Laravel :', {
            cycles: cycles?.length,
            niveaux: niveaux?.length, 
            classes: classes?.length,
            inscriptions: inscriptions?.length
        });
    }, []);

    useEffect(() => {
        const normalizedType = normalizeType(data.ciblable_type);
        console.log('🔄 Type sélectionné:', {
            brut: data.ciblable_type,
            normalisé: normalizedType
        });

        let targets = [];
        let label = 'Sélectionnez une cible';

        // Utilisation du type normalisé pour les comparaisons
        switch (normalizedType) {
            case 'App\\Models\\Cycle':
                targets = cycles || [];
                label = 'Sélectionnez un cycle';
                break;

            case 'App\\Models\\Niveau':
                targets = niveaux || [];
                label = 'Sélectionnez un niveau';
                break;

            case 'App\\Models\\Classe':
                targets = classes || [];
                label = 'Sélectionnez une classe';
                break;

            case 'App\\Models\\Inscription':
                targets = inscriptions || [];
                label = 'Sélectionnez un élève';
                break;

            default:
                targets = [];
                label = 'Sélectionnez une cible';
                break;
        }

        console.log('🎯 Cibles filtrées:', targets);
        setFilteredTargets(targets);
        setTargetLabel(label);

        // Réinitialiser la cible quand le type change
        setData('ciblable_id', '');
    }, [data.ciblable_type, cycles, niveaux, classes, inscriptions]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('📤 Données soumises:', data);
        post('/service-ciblages');
    };

    const getTargetDisplayName = (target) => {
        if (!target) return 'Cible non disponible';

        try {
            const normalizedType = normalizeType(data.ciblable_type);

            switch (normalizedType) {
                case 'App\\Models\\Cycle':
                    return target.nom || `Cycle ${target.id}`;

                case 'App\\Models\\Niveau':
                    const cycleNom = target.cycle?.nom || `Cycle ${target.cycle_id}`;
                    return `${target.nom} (${cycleNom})`;

                case 'App\\Models\\Classe':
                    const niveauNom = target.niveau?.nom || `Niveau ${target.niveau_id}`;
                    return `${target.nom} - ${niveauNom}`;

                case 'App\\Models\\Inscription':
                    const eleve = target.eleve || {};
                    const classe = target.classe || {};
                    return `${eleve.prenom || ''} ${eleve.nom || ''} - ${classe.nom || 'Classe inconnue'}`;

                default:
                    return target.nom || target.id || 'Cible sans nom';
            }
        } catch (error) {
            console.error('❌ Erreur lors du formatage de la cible:', error, target);
            return 'Erreur d\'affichage';
        }
    };

    const getTypeLabel = (type) => {
        const labels = {
            'App\\Models\\Cycle': 'Cycle',
            'App\\Models\\Niveau': 'Niveau', 
            'App\\Models\\Classe': 'Classe',
            'App\\Models\\Inscription': 'Élève'
        };
        return labels[type] || type;
    };

    return (
        <AppLayout>
            <Head title="Nouveau Ciblage de Service" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nouveau Ciblage de Service
                            </h1>
                            <p className="text-purple-100 mt-2 text-lg">
                                Associer un service à une cible spécifique
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Sélection du service */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Service
                        </h3>
                        <select
                            value={data.service_id}
                            onChange={(e) => setData('service_id', e.target.value)}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                errors.service_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                            } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white`}
                            disabled={!!serviceId}
                        >
                            <option value="">Sélectionnez un service</option>
                            {services?.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.nom} - {service.code} ({service.montant} XOF)
                                </option>
                            ))}
                        </select>
                        {errors.service_id && (
                            <p className="text-sm text-red-600 mt-2">{errors.service_id}</p>
                        )}
                    </div>

                    {/* Type + Cible */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Type de Cible */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                </svg>
                                Type de Cible
                            </h3>
                            <select
                                value={data.ciblable_type}
                                onChange={(e) => setData('ciblable_type', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.ciblable_type ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                                } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white`}
                            >
                                <option value="">Sélectionnez un type</option>
                                <option value="App\\Models\\Cycle">Cycle</option>
                                <option value="App\\Models\\Niveau">Niveau</option>
                                <option value="App\\Models\\Classe">Classe</option>
                                <option value="App\\Models\\Inscription">Élève</option>
                            </select>
                            {errors.ciblable_type && (
                                <p className="text-sm text-red-600 mt-2">{errors.ciblable_type}</p>
                            )}
                        </div>

                        {/* Sélection de la cible */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                Cible
                            </h3>
                            <select
                                value={data.ciblable_id}
                                onChange={(e) => setData('ciblable_id', e.target.value)}
                                disabled={!data.ciblable_type}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                                    errors.ciblable_id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                                } focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}
                            >
                                <option value="">
                                    {!data.ciblable_type 
                                        ? 'Choisissez d\'abord un type'
                                        : filteredTargets.length === 0 
                                            ? 'Aucune cible disponible'
                                            : targetLabel
                                    }
                                </option>
                                {filteredTargets.map((target) => (
                                    <option key={target.id} value={target.id}>
                                        {getTargetDisplayName(target)}
                                    </option>
                                ))}
                            </select>

                            {/* Messages d'information */}
                            {data.ciblable_type && (
                                <div className="mt-2">
                                    {filteredTargets.length > 0 ? (
                                        <p className="text-sm text-green-600">
                                            ✅ {filteredTargets.length} cible(s) disponible(s)
                                        </p>
                                    ) : (
                                        <p className="text-sm text-orange-600">
                                            ⚠️ Aucune cible trouvée pour "{getTypeLabel(data.ciblable_type)}"
                                        </p>
                                    )}
                                </div>
                            )}

                            {errors.ciblable_id && (
                                <p className="text-sm text-red-600 mt-2">{errors.ciblable_id}</p>
                            )}
                        </div>
                    </div>

                    {/* Aperçu du ciblage */}
                    {(data.service_id || data.ciblable_type || data.ciblable_id) && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                            <h4 className="text-sm font-semibold text-purple-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" />
                                </svg>
                                Aperçu du ciblage
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Service :</strong>{' '}
                                    {data.service_id 
                                        ? services?.find(s => s.id == data.service_id)?.nom 
                                        : <span className="text-orange-500">Non sélectionné</span>}
                                </div>
                                <div>
                                    <strong>Type :</strong>{' '}
                                    {data.ciblable_type 
                                        ? getTypeLabel(data.ciblable_type) 
                                        : <span className="text-orange-500">Non sélectionné</span>}
                                </div>
                                <div className="md:col-span-2">
                                    <strong>Cible :</strong>{' '}
                                    {data.ciblable_id 
                                        ? getTargetDisplayName(filteredTargets.find(t => t.id == data.ciblable_id))
                                        : <span className="text-orange-500">Non sélectionnée</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Boutons */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                        <Link
                            href={serviceId ? `/service-ciblages?service_id=${serviceId}` : '/service-ciblages'}
                            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 w-full md:w-auto"
                        >
                            Retour à la liste
                        </Link>

                        <button
                            type="submit"
                            disabled={processing || !data.service_id || !data.ciblable_type || !data.ciblable_id}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                        >
                            {processing ? 'Enregistrement...' : 'Créer le ciblage'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Create;