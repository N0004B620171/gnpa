import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import AnneeForm from './Form';

const AnneesEdit = ({ annee }) => {
    return (
        <Layout>
            <Head title={`Modifier ${annee.nom}`} />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnneeForm annee={annee} isEdit={true} />
                </div>
            </div>
        </Layout>
    );
};

export default AnneesEdit;