import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    DollarSign,
    Bus,
    FileText,
    Settings,
    Users,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
    const { url } = usePage(); // exemple : /transport/bus

    const isActive = (path) => url.startsWith(path);
    const isGroupActive = (groupPath) => url.startsWith(groupPath);

    const [openGroups, setOpenGroups] = useState({
        finances: isGroupActive('/finances'),
        transport: isGroupActive('/transport'),
    });

    useEffect(() => {
        setOpenGroups({
            finances: isGroupActive('/finances'),
            transport: isGroupActive('/transport'),
        });
    }, [url]);

    const toggleGroup = (group) => {
        setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
    };

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 flex items-center gap-2 border-b border-gray-100">
                <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
                <div>
                    <h1 className="text-lg font-semibold text-purple-700">
                        École Primaire
                    </h1>
                    <p className="text-xs text-gray-500">Gestion Scolaire</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 text-sm font-medium text-gray-700">
                {/* Tableau de bord */}
                <Link
                    href="/"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        isActive('/')
                            ? 'bg-purple-100 text-purple-700 font-semibold'
                            : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    <FileText className="h-5 w-5" />
                    Tableau de bord
                </Link>

                {/* Finances */}
                <button
                    onClick={() => toggleGroup('finances')}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        isGroupActive('/finances')
                            ? 'bg-purple-50 text-purple-700 font-semibold'
                            : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-purple-600" />
                        Finances
                    </div>
                    {openGroups.finances ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </button>

                {openGroups.finances && (
                    <div className="ml-6 mt-1 space-y-1">
                        <Link
                            href="/finances/services"
                            className={`block px-3 py-2 rounded-lg transition-all ${
                                isActive('/finances/services')
                                    ? 'bg-purple-100 text-purple-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            Services
                        </Link>
                        <Link
                            href="/finances/factures"
                            className={`block px-3 py-2 rounded-lg transition-all ${
                                isActive('/finances/factures')
                                    ? 'bg-purple-100 text-purple-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            Factures
                        </Link>
                        <Link
                            href="/finances/paiements"
                            className={`block px-3 py-2 rounded-lg transition-all ${
                                isActive('/finances/paiements')
                                    ? 'bg-purple-100 text-purple-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            Paiements
                        </Link>
                    </div>
                )}

                {/* Transport */}
                <button
                    onClick={() => toggleGroup('transport')}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        isGroupActive('/transport')
                            ? 'bg-orange-50 text-orange-700 font-semibold'
                            : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Bus className="h-5 w-5 text-orange-600" />
                        Transport
                    </div>
                    {openGroups.transport ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </button>

                {openGroups.transport && (
                    <div className="ml-6 mt-1 space-y-1">
                        <Link
                            href="/transport/bus"
                            className={`block px-3 py-2 rounded-lg transition-all ${
                                isActive('/transport/bus')
                                    ? 'bg-orange-100 text-orange-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            Bus
                        </Link>
                    </div>
                )}

                {/* Utilisateurs */}
                <Link
                    href="/utilisateurs"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        isActive('/utilisateurs')
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    <Users className="h-5 w-5 text-blue-600" />
                    Utilisateurs
                </Link>

                {/* Paramètres */}
                <Link
                    href="/parametres"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        isActive('/parametres')
                            ? 'bg-gray-100 text-gray-800 font-semibold'
                            : 'hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    <Settings className="h-5 w-5" />
                    Paramètres
                </Link>
            </nav>

            {/* Footer user */}
            <div className="p-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-full font-semibold">
                        A
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            Administrateur
                        </div>
                        <div className="text-xs text-gray-500">Admin</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
