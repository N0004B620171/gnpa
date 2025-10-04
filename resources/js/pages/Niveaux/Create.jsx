import React from 'react';
import { Head } from '@inertiajs/react';
import NiveauForm from './Form';
import Layout from '@/Components/Layout';


const NiveauxCreate = ({ cycles }) => {
    return (
        <Layout>
            <Head title="Créer un Niveau" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <NiveauForm cycles={cycles} />
                </div>
            </div>
        </Layout>
    );
};

export default NiveauxCreate;