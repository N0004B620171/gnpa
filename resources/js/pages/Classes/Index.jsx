import React from 'react';

export default function ClassesIndex() {
    const classes = [
        { id: 1, nom: '6ème A', niveau: '6ème', eleves: 28, professeur: 'Sophie Leroy' },
        { id: 2, nom: '5ème B', niveau: '5ème', eleves: 25, professeur: 'Michel Bernard' },
        { id: 3, nom: '4ème C', niveau: '4ème', eleves: 30, professeur: 'Catherine Petit' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <a href="/" className="text-xl font-bold text-indigo-600">🎓 EduManager</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a href="/" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                            <a href="/eleves" className="text-gray-600 hover:text-gray-900">Élèves</a>
                            <a href="/professeurs" className="text-gray-600 hover:text-gray-900">Professeurs</a>
                            <a href="/classes" className="text-indigo-600 font-medium">Classes</a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des Classes</h1>
                        <p className="mt-2 text-gray-600">Liste de toutes les classes de l'établissement</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((classe) => (
                            <div key={classe.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="text-center mb-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-blue-600 text-2xl">🏫</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{classe.nom}</h3>
                                    <p className="text-gray-600">{classe.niveau}</p>
                                </div>
                                
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Élèves:</span>
                                        <span className="font-semibold">{classe.eleves}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Professeur:</span>
                                        <span className="font-semibold text-sm">{classe.professeur}</span>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                                        👥 Élèves
                                    </button>
                                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors">
                                        📊 Notes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques des classes</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">6</div>
                                <div className="text-sm text-blue-600">Classes total</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">83</div>
                                <div className="text-sm text-green-600">Élèves total</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">28</div>
                                <div className="text-sm text-purple-600">Moyenne/Classe</div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">4</div>
                                <div className="text-sm text-orange-600">Niveaux</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}