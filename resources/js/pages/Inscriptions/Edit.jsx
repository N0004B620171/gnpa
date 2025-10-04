import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import InscriptionForm from './Form';

const InscriptionsEdit = ({ inscription, classes, eleves, annees }) => {
    return (
        <Layout>
            <Head title={`Modifier l'Inscription`} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <InscriptionForm 
                        inscription={inscription}
                        classes={classes}
                        eleves={eleves}
                        annees={annees}
                        isEdit={true}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default InscriptionsEdit;