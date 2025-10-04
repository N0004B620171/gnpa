import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import NiveauForm from './Form';

const NiveauxEdit = ({ niveau, cycles }) => {
    return (
        <Layout>
            <Head title={`Modifier ${niveau.nom}`} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <NiveauForm niveau={niveau} cycles={cycles} isEdit={true} />
                </div>
            </div>
        </Layout>
    );
};

export default NiveauxEdit;