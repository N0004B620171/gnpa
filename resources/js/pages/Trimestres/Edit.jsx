import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import TrimestreForm from './Form';

const TrimestresEdit = ({ trimestre, annees }) => {
    return (
        <Layout>
            <Head title={`Modifier ${trimestre.nom}`} />
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TrimestreForm trimestre={trimestre} annees={annees} isEdit={true} />
                </div>
            </div>
        </Layout>
    );
};

export default TrimestresEdit;