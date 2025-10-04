import AppLayout from '@/Layouts/AppLayout';
import DataTable from '@/Components/DataTable';
import Button from '@/Components/Button';
import { Link, usePage } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function ElevesIndex({ eleves, filters }) {
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (eleve) => `#${eleve.id}`
    },
    {
      key: 'nom_complet',
      header: 'Élève',
      render: (eleve) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {eleve.photo ? (
              <img className="h-10 w-10 rounded-full" src={eleve.photo} alt="" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium text-sm">
                  {eleve.prenom.charAt(0)}{eleve.nom.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {eleve.prenom} {eleve.nom}
            </div>
            <div className="text-sm text-gray-500">
              {eleve.inscriptions?.[0]?.classe?.nom || 'Non inscrit'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'date_naissance',
      header: 'Date de naissance',
      render: (eleve) => eleve.date_naissance ? new Date(eleve.date_naissance).toLocaleDateString('fr-FR') : '-'
    },
    {
      key: 'sexe',
      header: 'Sexe',
      render: (eleve) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          eleve.sexe === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
        }`}>
          {eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}
        </span>
      )
    },
    {
      key: 'parent',
      header: 'Parent',
      render: (eleve) => eleve.parent ? `${eleve.parent.prenom} ${eleve.parent.nom}` : '-'
    }
  ];

  const actions = [
    {
      label: 'Voir',
      icon: Eye,
      href: (eleve) => `/eleves/${eleve.id}`,
    },
    {
      label: 'Modifier',
      icon: Edit,
      href: (eleve) => `/eleves/${eleve.id}/edit`,
    },
    {
      label: 'Supprimer',
      icon: Trash2,
      variant: 'danger',
      href: (eleve) => `/eleves/${eleve.id}`,
      method: 'delete',
    },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Élèves</h1>
          <p className="mt-1 text-sm text-gray-600">
            Liste de tous les élèves de l'établissement
          </p>
        </div>
        <Link href="/eleves/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Élève
          </Button>
        </Link>
      </div>

      <DataTable
        data={eleves}
        columns={columns}
        actions={actions}
        searchable={true}
        filters={filters}
      />
    </AppLayout>
  );
}