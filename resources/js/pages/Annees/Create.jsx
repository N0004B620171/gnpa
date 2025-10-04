import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import AnneeForm from './Form';

const AnneesCreate = () => {
    return (
        <Layout>
            <Head title="Créer une Année Scolaire" />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnneeForm />
                </div>
            </div>
        </Layout>
    );
};

export default AnneesCreate;