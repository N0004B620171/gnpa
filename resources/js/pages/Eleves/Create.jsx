import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function ElevesCreate({ parents, classes, anneesScolaires }) {
  const { data, setData, errors, post, processing } = useForm({
    prenom: '',
    nom: '',
    date_naissance: '',
    sexe: '',
    photo: '',
    parent_eleve_id: '',
    nouveau_parent: false,
    parent_prenom: '',
    parent_nom: '',
    parent_telephone: '',
    parent_email: '',
    inscrire_maintenant: false,
    classe_id: '',
    annee_scolaire_id: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post('/eleves');
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/eleves" className="mr-4">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ajouter un Élève</h1>
            <p className="mt-1 text-sm text-gray-600">
              Créer un nouveau profil d'élève
            </p>
          </div>
        </div>
      </div>

      <Card>
        <form onSubmit={submit} className="space-y-6">
          {/* Informations de l'élève */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  value={data.prenom}
                  onChange={(e) => setData('prenom', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
              </div>

              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  value={data.nom}
                  onChange={(e) => setData('nom', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
              </div>

              <div>
                <label htmlFor="date_naissance" className="block text-sm font-medium text-gray-700">
                  Date de naissance
                </label>
                <input
                  type="date"
                  id="date_naissance"
                  value={data.date_naissance}
                  onChange={(e) => setData('date_naissance', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="sexe" className="block text-sm font-medium text-gray-700">
                  Sexe
                </label>
                <select
                  id="sexe"
                  value={data.sexe}
                  onChange={(e) => setData('sexe', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parent */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Parent</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="nouveau_parent"
                  checked={data.nouveau_parent}
                  onChange={(e) => setData('nouveau_parent', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="nouveau_parent" className="ml-2 block text-sm text-gray-900">
                  Créer un nouveau parent
                </label>
              </div>

              {!data.nouveau_parent ? (
                <div>
                  <label htmlFor="parent_eleve_id" className="block text-sm font-medium text-gray-700">
                    Parent existant
                  </label>
                  <select
                    id="parent_eleve_id"
                    value={data.parent_eleve_id}
                    onChange={(e) => setData('parent_eleve_id', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sélectionner un parent</option>
                    {parents.map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.prenom} {parent.nom}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="parent_prenom" className="block text-sm font-medium text-gray-700">
                      Prénom du parent *
                    </label>
                    <input
                      type="text"
                      id="parent_prenom"
                      value={data.parent_prenom}
                      onChange={(e) => setData('parent_prenom', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="parent_nom" className="block text-sm font-medium text-gray-700">
                      Nom du parent *
                    </label>
                    <input
                      type="text"
                      id="parent_nom"
                      value={data.parent_nom}
                      onChange={(e) => setData('parent_nom', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="parent_email" className="block text-sm font-medium text-gray-700">
                      Email du parent *
                    </label>
                    <input
                      type="email"
                      id="parent_email"
                      value={data.parent_email}
                      onChange={(e) => setData('parent_email', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="parent_telephone" className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="parent_telephone"
                      value={data.parent_telephone}
                      onChange={(e) => setData('parent_telephone', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inscription immédiate */}
          <div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="inscrire_maintenant"
                checked={data.inscrire_maintenant}
                onChange={(e) => setData('inscrire_maintenant', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="inscrire_maintenant" className="ml-2 block text-sm text-gray-900">
                Inscrire immédiatement dans une classe
              </label>
            </div>

            {data.inscrire_maintenant && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label htmlFor="classe_id" className="block text-sm font-medium text-gray-700">
                    Classe *
                  </label>
                  <select
                    id="classe_id"
                    value={data.classe_id}
                    onChange={(e) => setData('classe_id', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>
                        {classe.niveau?.cycle?.nom} - {classe.niveau?.nom} {classe.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="annee_scolaire_id" className="block text-sm font-medium text-gray-700">
                    Année scolaire *
                  </label>
                  <select
                    id="annee_scolaire_id"
                    value={data.annee_scolaire_id}
                    onChange={(e) => setData('annee_scolaire_id', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sélectionner une année</option>
                    {anneesScolaires.map((annee) => (
                      <option key={annee.id} value={annee.id}>
                        {annee.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link href="/eleves">
              <Button variant="secondary" type="button">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Création...' : 'Créer l\'élève'}
            </Button>
          </div>
        </form>
      </Card>
    </AppLayout>
  );
}