import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import TrimestreForm from './Form';

const TrimestresCreate = ({ annees }) => {
    return (
        <Layout>
            <Head title="Créer un Trimestre" />
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TrimestreForm annees={annees} />
                </div>
            </div>
        </Layout>
    );
};

export default TrimestresCreate;