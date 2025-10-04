import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import ParentEleveForm from './Form';

const ParentElevesEdit = ({ parentEleve }) => {
    return (
        <Layout>
            <Head title={`Modifier ${parentEleve.prenom} ${parentEleve.nom}`} />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ParentEleveForm parentEleve={parentEleve} isEdit={true} />
                </div>
            </div>
        </Layout>
    );
};

export default ParentElevesEdit;