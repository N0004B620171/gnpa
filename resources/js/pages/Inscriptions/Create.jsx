import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import InscriptionForm from './Form';

const InscriptionsCreate = ({ classes, eleves, annees, annee_active }) => {
    return (
        <Layout>
            <Head title="Créer une Inscription" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <InscriptionForm 
                        classes={classes}
                        eleves={eleves}
                        annees={annees}
                        annee_active={annee_active}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default InscriptionsCreate;