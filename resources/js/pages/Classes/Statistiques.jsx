import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const Statistiques = () => {
    const [periode, setPeriode] = useState('annee');
    const [typeStatistique, setTypeStatistique] = useState('general');

    // Données simulées pour les statistiques
    const statistiques = {
        general: {
            titre: "Vue d'ensemble",
            indicateurs: [
                { 
                    titre: "Élèves inscrits", 
                    valeur: "1,248", 
                    evolution: "+12%", 
                    positif: true,
                    icon: "👨‍🎓",
                    couleur: "from-blue-500 to-cyan-500"
                },
                { 
                    titre: "Taux de présence", 
                    valeur: "94.2%", 
                    evolution: "+2.1%", 
                    positif: true,
                    icon: "📊",
                    couleur: "from-green-500 to-emerald-500"
                },
                { 
                    titre: "Moyenne générale", 
                    valeur: "13.2/20", 
                    evolution: "+0.4", 
                    positif: true,
                    icon: "⭐",
                    couleur: "from-purple-500 to-violet-500"
                },
                { 
                    titre: "Taux de réussite", 
                    valeur: "87.5%", 
                    evolution: "+3.2%", 
                    positif: true,
                    icon: "🎯",
                    couleur: "from-orange-500 to-amber-500"
                }
            ],
            graphiques: [
                {
                    type: "repartition_cycles",
                    titre: "Répartition par cycle",
                    data: [
                        { nom: "Maternelle", eleves: 320, couleur: "#3B82F6" },
                        { nom: "Primaire", eleves: 685, couleur: "#10B981" },
                        { nom: "Collège", eleves: 243, couleur: "#8B5CF6" }
                    ]
                },
                {
                    type: "evolution_inscriptions",
                    titre: "Évolution des inscriptions",
                    data: [
                        { mois: "Jan", inscriptions: 45 },
                        { mois: "Fév", inscriptions: 52 },
                        { mois: "Mar", inscriptions: 48 },
                        { mois: "Avr", inscriptions: 67 },
                        { mois: "Mai", inscriptions: 58 },
                        { mois: "Jun", inscriptions: 72 }
                    ]
                }
            ]
        },
        finances: {
            titre: "Finances",
            indicateurs: [
                { 
                    titre: "Chiffre d'affaires", 
                    valeur: "245,800 €", 
                    evolution: "+8.5%", 
                    positif: true,
                    icon: "💰",
                    couleur: "from-green-500 to-emerald-500"
                },
                { 
                    titre: "Taux de recouvrement", 
                    valeur: "92.3%", 
                    evolution: "+1.2%", 
                    positif: true,
                    icon: "📈",
                    couleur: "from-blue-500 to-cyan-500"
                },
                { 
                    titre: "Factures impayées", 
                    valeur: "18", 
                    evolution: "-5", 
                    positif: true,
                    icon: "⚠️",
                    couleur: "from-orange-500 to-amber-500"
                },
                { 
                    titre: "Dépenses mensuelles", 
                    valeur: "45,200 €", 
                    evolution: "+2.1%", 
                    positif: false,
                    icon: "💸",
                    couleur: "from-red-500 to-rose-500"
                }
            ]
        },
        scolarite: {
            titre: "Scolarité",
            indicateurs: [
                { 
                    titre: "Moyenne générale", 
                    valeur: "13.2/20", 
                    evolution: "+0.4", 
                    positif: true,
                    icon: "📚",
                    couleur: "from-purple-500 to-violet-500"
                },
                { 
                    titre: "Taux de réussite", 
                    valeur: "87.5%", 
                    evolution: "+3.2%", 
                    positif: true,
                    icon: "🎓",
                    couleur: "from-green-500 to-emerald-500"
                },
                { 
                    titre: "Abandons", 
                    valeur: "8", 
                    evolution: "-2", 
                    positif: true,
                    icon: "📉",
                    couleur: "from-orange-500 to-amber-500"
                },
                { 
                    titre: "Taux d'assiduité", 
                    valeur: "94.2%", 
                    evolution: "+1.8%", 
                    positif: true,
                    icon: "✅",
                    couleur: "from-blue-500 to-cyan-500"
                }
            ]
        },
        transport: {
            titre: "Transport",
            indicateurs: [
                { 
                    titre: "Élèves transportés", 
                    valeur: "324", 
                    evolution: "+15%", 
                    positif: true,
                    icon: "🚌",
                    couleur: "from-blue-500 to-cyan-500"
                },
                { 
                    titre: "Taux d'occupation", 
                    valeur: "78.5%", 
                    evolution: "+4.2%", 
                    positif: true,
                    icon: "👥",
                    couleur: "from-green-500 to-emerald-500"
                },
                { 
                    titre: "Retards moyens", 
                    valeur: "3.2 min", 
                    evolution: "-0.8", 
                    positif: true,
                    icon: "⏰",
                    couleur: "from-orange-500 to-amber-500"
                },
                { 
                    titre: "Coût par élève", 
                    valeur: "85 €", 
                    evolution: "+2 €", 
                    positif: false,
                    icon: "💶",
                    couleur: "from-purple-500 to-violet-500"
                }
            ]
        }
    };

    const statsActuelles = statistiques[typeStatistique];

    // Composant pour les indicateurs
    const Indicateur = ({ titre, valeur, evolution, positif, icon, couleur }) => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{titre}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{valeur}</p>
                    <div className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                        positif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        <svg className={`w-3 h-3 mr-1 ${positif ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {positif ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            )}
                        </svg>
                        {evolution}
                    </div>
                </div>
                <div className={`h-12 w-12 bg-gradient-to-r ${couleur} rounded-xl flex items-center justify-center text-white text-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    // Composant pour le graphique de répartition
    const GraphiqueRepartition = ({ data }) => {
        const total = data.reduce((sum, item) => sum + item.eleves, 0);
        
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par cycle</h3>
                <div className="space-y-4">
                    {data.map((item, index) => {
                        const pourcentage = ((item.eleves / total) * 100).toFixed(1);
                        return (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div 
                                        className="w-3 h-3 rounded-full mr-3"
                                        style={{ backgroundColor: item.couleur }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700">{item.nom}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${pourcentage}%`,
                                                backgroundColor: item.couleur
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                                        {pourcentage}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Composant pour le graphique d'évolution
    const GraphiqueEvolution = ({ data }) => {
        const maxValue = Math.max(...data.map(item => item.inscriptions));
        
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des inscriptions</h3>
                <div className="flex items-end justify-between h-40 space-x-2">
                    {data.map((item, index) => {
                        const height = (item.inscriptions / maxValue) * 100;
                        return (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div 
                                    className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-500 hover:opacity-80"
                                    style={{ height: `${height}%` }}
                                ></div>
                                <span className="text-xs text-gray-600 mt-2">{item.mois}</span>
                                <span className="text-sm font-semibold text-gray-900">{item.inscriptions}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Composant pour les meilleures classes
    const MeilleuresClasses = () => {
        const classes = [
            { nom: "CP A", moyenne: 15.2, eleves: 28, progression: "+2.1" },
            { nom: "CE1 B", moyenne: 14.8, eleves: 26, progression: "+1.8" },
            { nom: "CM2 A", moyenne: 14.5, eleves: 30, progression: "+1.2" },
            { nom: "CE2 A", moyenne: 14.3, eleves: 25, progression: "+0.9" },
            { nom: "CP B", moyenne: 14.1, eleves: 27, progression: "+1.5" }
        ];

        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 des classes</h3>
                <div className="space-y-3">
                    {classes.map((classe, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                    index === 0 ? 'bg-yellow-500' : 
                                    index === 1 ? 'bg-gray-400' : 
                                    index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                                }`}>
                                    {index + 1}
                                </div>
                                <div className="ml-3">
                                    <div className="font-medium text-gray-900">{classe.nom}</div>
                                    <div className="text-sm text-gray-500">{classe.eleves} élèves</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-900">{classe.moyenne}/20</div>
                                <div className="text-sm text-green-600">{classe.progression}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Statistiques et Rapports" />

            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Statistiques et Rapports</h1>
                            <p className="text-indigo-100 mt-2 text-lg">
                                Analyse complète des performances de l'établissement
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                <p className="text-sm text-indigo-200">Période</p>
                                <select 
                                    value={periode}
                                    onChange={(e) => setPeriode(e.target.value)}
                                    className="bg-transparent text-white font-medium focus:outline-none"
                                >
                                    <option value="mois">Ce mois</option>
                                    <option value="trimestre">Ce trimestre</option>
                                    <option value="annee">Cette année</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation par type de statistiques */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setTypeStatistique('general')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                typeStatistique === 'general'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            📊 Vue d'ensemble
                        </button>
                        <button
                            onClick={() => setTypeStatistique('scolarite')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                typeStatistique === 'scolarite'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            🎓 Scolarité
                        </button>
                        <button
                            onClick={() => setTypeStatistique('finances')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                typeStatistique === 'finances'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            💰 Finances
                        </button>
                        <button
                            onClick={() => setTypeStatistique('transport')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                typeStatistique === 'transport'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            🚌 Transport
                        </button>
                    </div>
                </div>

                {/* Indicateurs principaux */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{statsActuelles.titre}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsActuelles.indicateurs.map((indicateur, index) => (
                            <Indicateur key={index} {...indicateur} />
                        ))}
                    </div>
                </div>

                {/* Graphiques et visualisations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {typeStatistique === 'general' && (
                        <>
                            <GraphiqueRepartition data={statistiques.general.graphiques[0].data} />
                            <GraphiqueEvolution data={statistiques.general.graphiques[1].data} />
                        </>
                    )}
                    {typeStatistique === 'scolarite' && (
                        <>
                            <MeilleuresClasses />
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des notes</h3>
                                <div className="space-y-3">
                                    {[
                                        { intervalle: "16-20", pourcentage: 15, couleur: "bg-green-500" },
                                        { intervalle: "14-15.9", pourcentage: 25, couleur: "bg-blue-500" },
                                        { intervalle: "12-13.9", pourcentage: 35, couleur: "bg-yellow-500" },
                                        { intervalle: "10-11.9", pourcentage: 18, couleur: "bg-orange-500" },
                                        { intervalle: "0-9.9", pourcentage: 7, couleur: "bg-red-500" }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700 w-16">{item.intervalle}</span>
                                            <div className="flex-1 mx-4">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${item.couleur} transition-all duration-500`}
                                                        style={{ width: `${item.pourcentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                                                {item.pourcentage}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    {typeStatistique === 'finances' && (
                        <>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des revenus</h3>
                                <div className="flex justify-center items-center">
                                    <div className="relative w-48 h-48">
                                        {/* Graphique circulaire simulé */}
                                        <div className="absolute inset-0 rounded-full border-8 border-green-500"></div>
                                        <div className="absolute inset-0 rounded-full border-8 border-blue-500 transform -rotate-90" style={{ clipPath: 'inset(0 50% 0 0)' }}></div>
                                        <div className="absolute inset-0 rounded-full border-8 border-purple-500 transform -rotate-135" style={{ clipPath: 'inset(0 25% 0 0)' }}></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-gray-900">100%</div>
                                                <div className="text-sm text-gray-600">Total</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                            <span className="text-sm">Scolarité</span>
                                        </div>
                                        <span className="text-sm font-semibold">65%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                            <span className="text-sm">Transport</span>
                                        </div>
                                        <span className="text-sm font-semibold">25%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                            <span className="text-sm">Services</span>
                                        </div>
                                        <span className="text-sm font-semibold">10%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des paiements</h3>
                                <div className="space-y-4">
                                    {[
                                        { mois: "Jan", paye: 85, attendu: 100 },
                                        { mois: "Fév", paye: 92, attendu: 100 },
                                        { mois: "Mar", paye: 78, attendu: 100 },
                                        { mois: "Avr", paye: 95, attendu: 100 },
                                        { mois: "Mai", paye: 88, attendu: 100 },
                                        { mois: "Jun", paye: 96, attendu: 100 }
                                    ].map((item, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>{item.mois}</span>
                                                <span>{item.paye}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                                    style={{ width: `${item.paye}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    {typeStatistique === 'transport' && (
                        <>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation des bus</h3>
                                <div className="space-y-4">
                                    {[
                                        { bus: "Bus A", occupation: 85, eleves: 42 },
                                        { bus: "Bus B", occupation: 72, eleves: 36 },
                                        { bus: "Bus C", occupation: 91, eleves: 45 },
                                        { bus: "Bus D", occupation: 68, eleves: 34 },
                                        { bus: "Bus E", occupation: 78, eleves: 39 }
                                    ].map((item, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>{item.bus}</span>
                                                <span>{item.occupation}% ({item.eleves} élèves)</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all duration-500 ${
                                                        item.occupation >= 90 ? 'bg-green-500' :
                                                        item.occupation >= 75 ? 'bg-blue-500' :
                                                        item.occupation >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${item.occupation}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performances des itinéraires</h3>
                                <div className="space-y-3">
                                    {[
                                        { itineraire: "Ligne Nord", ponctualite: 95, satisfaction: 4.2 },
                                        { itineraire: "Ligne Sud", ponctualite: 88, satisfaction: 3.9 },
                                        { itineraire: "Ligne Est", ponctualite: 92, satisfaction: 4.1 },
                                        { itineraire: "Ligne Ouest", ponctualite: 85, satisfaction: 3.8 },
                                        { itineraire: "Ligne Centre", ponctualite: 96, satisfaction: 4.3 }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-medium text-gray-900">{item.itineraire}</div>
                                                <div className="text-sm text-gray-500">Ponctualité: {item.ponctualite}%</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center">
                                                    <span className="text-yellow-500 text-lg">★</span>
                                                    <span className="font-bold text-gray-900 ml-1">{item.satisfaction}</span>
                                                </div>
                                                <div className="text-sm text-gray-500">/5</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions rapides */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/statistiques/export"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Exporter les données
                        </Link>
                        <Link
                            href="/rapports"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Générer un rapport
                        </Link>
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Actualiser les données
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Statistiques;