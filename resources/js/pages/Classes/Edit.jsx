import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Components/Layout';
import ClasseForm from './Form';

const ClassesEdit = ({ classe, niveaux, professeurs }) => {
    return (
        <Layout>
            <Head title={`Modifier ${classe.nom}`} />
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ClasseForm 
                        classe={classe} 
                        niveaux={niveaux} 
                        professeurs={professeurs} 
                        isEdit={true} 
                    />
                </div>
            </div>
        </Layout>
    );
};

export default ClassesEdit;