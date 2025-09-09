import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                {/* Barre de navigation améliorée */}
                <header className="mb-6 w-full max-w-[335px] lg:max-w-6xl">
                    <nav className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm dark:bg-[#1a1a1a]">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">X</span>
                            </div>
                            <span className="font-semibold text-lg">Xuxu</span>
                        </Link>

                        {/* Menu principal */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/"
                                className="text-[#1b1b18] hover:text-blue-600 transition-colors dark:text-[#EDEDEC] dark:hover:text-blue-400"
                            >
                                Accueil
                            </Link>

                            {/* Dropdown Services */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                                    className="flex items-center text-[#1b1b18] hover:text-blue-600 transition-colors dark:text-[#EDEDEC] dark:hover:text-blue-400"
                                >
                                    Services
                                    <svg
                                        className={`ml-1 h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isServicesOpen && (
                                    <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 dark:bg-[#2a2a2a]">
                                        <Link
                                            href="/service/web"
                                            className="block px-4 py-2 text-sm text-[#1b1b18] hover:bg-gray-100 dark:text-[#EDEDEC] dark:hover:bg-[#3a3a3a]"
                                        >
                                            Développement Web
                                        </Link>
                                        <Link
                                            href="/service/mobile"
                                            className="block px-4 py-2 text-sm text-[#1b1b18] hover:bg-gray-100 dark:text-[#EDEDEC] dark:hover:bg-[#3a3a3a]"
                                        >
                                            Applications Mobile
                                        </Link>
                                        <Link
                                            href="/service/consulting"
                                            className="block px-4 py-2 text-sm text-[#1b1b18] hover:bg-gray-100 dark:text-[#EDEDEC] dark:hover:bg-[#3a3a3a]"
                                        >
                                            Conseil IT
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/about"
                                className="text-[#1b1b18] hover:text-blue-600 transition-colors dark:text-[#EDEDEC] dark:hover:text-blue-400"
                            >
                                À propos
                            </Link>
                            <Link
                                href="/about"
                                className="text-[#1b1b18] hover:text-blue-600 transition-colors dark:text-[#EDEDEC] dark:hover:text-blue-400"
                            >
                                À propos
                            </Link>
                            <Link
                                href="/contact"
                                className="text-[#1b1b18] hover:text-blue-600 transition-colors dark:text-[#EDEDEC] dark:hover:text-blue-400"
                            >
                                Contact
                            </Link>
                        </div>

                        {/* Actions utilisateur */}
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-2 focus:outline-none"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="hidden md:inline text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                                            {auth.user.name}
                                        </span>
                                        <svg
                                            className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 dark:bg-[#2a2a2a]">
                                            <Link
                                                href={route('dashboard')}
                                                className="block px-4 py-2 text-sm text-[#1b1b18] hover:bg-gray-100 dark:text-[#EDEDEC] dark:hover:bg-[#3a3a3a]"
                                            >
                                                Tableau de bord
                                            </Link>
                                            <Link
                                                href={route('profile.edit')}
                                                className="block px-4 py-2 text-sm text-[#1b1b18] hover:bg-gray-100 dark:text-[#EDEDEC] dark:hover:bg-[#3a3a3a]"
                                            >
                                                Mon profil
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                className="block px-4 py-2 text-sm text-[#1b1b18] hover:bg-gray-100 dark:text-[#EDEDEC] dark:hover:bg-[#3a3a3a]"
                                            >
                                                Déconnexion
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-transparent px-4 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-1.5 text-sm leading-normal text-white shadow-sm hover:from-blue-600 hover:to-purple-700 transition-all"
                                    >
                                        Inscription
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    xuxu
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}