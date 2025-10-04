import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import { Users, GraduationCap, BookOpen, BarChart3, TrendingUp } from 'lucide-react';

const stats = [
  { name: 'Total Élèves', value: '1,248', icon: Users, change: '+12%', changeType: 'positive' },
  { name: 'Professeurs', value: '42', icon: GraduationCap, change: '+3%', changeType: 'positive' },
  { name: 'Classes Actives', value: '36', icon: BookOpen, change: '+2%', changeType: 'positive' },
  { name: 'Taux de Réussite', value: '89%', icon: BarChart3, change: '+5%', changeType: 'positive' },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-600">
          Vue d'ensemble de votre établissement scolaire
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                      <span className="sr-only">{stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by</span>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Contenu supplémentaire */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activités récentes</h3>
          <div className="space-y-3">
            {[
              'Nouvelle inscription en 6ème A',
              'Notes ajoutées pour le trimestre 1',
              'Réunion parents-professeurs planifiée',
              'Bulletins du 2ème trimestre générés'
            ].map((activity, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                {activity}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Prochaines échéances</h3>
          <div className="space-y-3">
            {[
              { date: '15 Jan', event: 'Composition de Mathématiques', class: '4ème B' },
              { date: '18 Jan', event: 'Réunion des professeurs', class: 'Salle des profs' },
              { date: '22 Jan', event: 'Date limite des notes', class: 'Trimestre 2' },
            ].map((deadline, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium mr-3">
                    {deadline.date}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{deadline.event}</div>
                    <div className="text-xs text-gray-500">{deadline.class}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}