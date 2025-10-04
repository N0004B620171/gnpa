import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import ProfesseurForm from './Form';

const ProfesseursCreate = () => {
    return (
        <Layout>
            <Head title="Créer un Professeur" />
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProfesseurForm />
                </div>
            </div>
        </Layout>
    );
};

export default ProfesseursCreate;