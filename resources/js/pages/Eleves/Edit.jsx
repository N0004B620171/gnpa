import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import EleveForm from './Form';

const ElevesEdit = ({ eleve }) => {
    return (
        <Layout>
            <Head title={`Modifier ${eleve.prenom} ${eleve.nom}`} />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <EleveForm eleve={eleve} isEdit={true} />
                </div>
            </div>
        </Layout>
    );
};

export default ElevesEdit;