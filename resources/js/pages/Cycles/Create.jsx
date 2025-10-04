import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import CycleForm from './Form';

const CyclesCreate = () => {
    return (
        <Layout>
            <Head title="Créer un Cycle" />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <CycleForm />
                </div>
            </div>
        </Layout>
    );
};

export default CyclesCreate;