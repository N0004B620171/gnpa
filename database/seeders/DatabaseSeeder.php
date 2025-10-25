<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Désactiver les contraintes de clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Vider les tables
        $this->truncateTables();

        // Peupler les tables
        $this->seedCycles();
        $this->seedNiveaux();
        $this->seedParentEleves();
        $this->seedProfesseurs();
        $this->seedClasses();
        $this->seedEleves();
        $this->seedAnneeScolaires();
        $this->seedTrimestres();
        $this->seedMatieres();
        $this->seedInscriptions();
        $this->seedCompositions();
        $this->seedCompositionMatieres();
        $this->seedNotes();
        $this->seedBulletins();
        $this->seedBulletinDetails();

        // Réactiver les contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }

    private function truncateTables()
    {
        $tables = [
            'bulletin_details',
            'bulletins',
            'notes',
            'composition_matieres',
            'compositions',
            'matieres',
            'inscriptions',
            'trimestres',
            'annee_scolaires',
            'eleves',
            'classes',
            'professeurs',
            'parent_eleves',
            'niveaux',
            'cycles'
        ];

        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }
    }

    private function seedCycles()
    {
        $cycles = [
            ['nom' => 'Cycle Primaire'],
            ['nom' => 'Cycle Secondaire'],
            ['nom' => 'Cycle Secondaire Technique'],
        ];

        foreach ($cycles as $cycle) {
            DB::table('cycles')->insert([
                'uid' => Str::uuid(),
                'nom' => $cycle['nom'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedNiveaux()
    {
        $cycles = DB::table('cycles')->get();
        
        $niveaux = [
            // Cycle Primaire
            ['cycle_id' => $cycles[0]->id, 'nom' => 'CP', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[0]->id, 'nom' => 'CP', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[0]->id, 'nom' => 'CE', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[0]->id, 'nom' => 'CE', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[0]->id, 'nom' => 'CM', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[0]->id, 'nom' => 'CM', 'moyenne_min_pour_passage' => 10],
            
            // Cycle Secondaire
            ['cycle_id' => $cycles[1]->id, 'nom' => '6ème', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[1]->id, 'nom' => '5ème', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[1]->id, 'nom' => '4ème', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[1]->id, 'nom' => '3ème', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[1]->id, 'nom' => '2nde', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[1]->id, 'nom' => '1ère', 'moyenne_min_pour_passage' => 10],
            ['cycle_id' => $cycles[1]->id, 'nom' => 'Tle', 'moyenne_min_pour_passage' => 10],
        ];

        foreach ($niveaux as $niveau) {
            DB::table('niveaux')->insert([
                'uid' => Str::uuid(),
                'cycle_id' => $niveau['cycle_id'],
                'nom' => $niveau['nom'],
                'moyenne_min_pour_passage' => $niveau['moyenne_min_pour_passage'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedParentEleves()
    {
        $parents = [
            ['prenom' => 'Jean', 'nom' => 'Dupont', 'telephone' => '0123456789', 'email' => 'jean.dupont@email.com', 'adresse' => '123 Rue Principale'],
            ['prenom' => 'Marie', 'nom' => 'Martin', 'telephone' => '0234567890', 'email' => 'marie.martin@email.com', 'adresse' => '456 Avenue Centrale'],
            ['prenom' => 'Pierre', 'nom' => 'Durand', 'telephone' => '0345678901', 'email' => 'pierre.durand@email.com', 'adresse' => '789 Boulevard Secondaire'],
            ['prenom' => 'Sophie', 'nom' => 'Leroy', 'telephone' => '0456789012', 'email' => 'sophie.leroy@email.com', 'adresse' => '321 Rue de la Gare'],
            ['prenom' => 'Michel', 'nom' => 'Moreau', 'telephone' => '0567890123', 'email' => 'michel.moreau@email.com', 'adresse' => '654 Avenue du Parc'],
        ];

        foreach ($parents as $parent) {
            DB::table('parent_eleves')->insert([
                'uid' => Str::uuid(),
                'prenom' => $parent['prenom'],
                'nom' => $parent['nom'],
                'telephone' => $parent['telephone'],
                'email' => $parent['email'],
                'adresse' => $parent['adresse'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedProfesseurs()
    {
        $professeurs = [
            ['prenom' => 'Alain', 'nom' => 'Petit', 'telephone' => '0678901234', 'email' => 'alain.petit@ecole.com', 'specialite' => 'Mathématiques'],
            ['prenom' => 'Catherine', 'nom' => 'Roux', 'telephone' => '0789012345', 'email' => 'catherine.roux@ecole.com', 'specialite' => 'Français'],
            ['prenom' => 'David', 'nom' => 'Blanc', 'telephone' => '0890123456', 'email' => 'david.blanc@ecole.com', 'specialite' => 'Histoire-Géographie'],
            ['prenom' => 'Élise', 'nom' => 'Garcia', 'telephone' => '0901234567', 'email' => 'elise.garcia@ecole.com', 'specialite' => 'Sciences'],
            ['prenom' => 'François', 'nom' => 'Lemoine', 'telephone' => '0112345678', 'email' => 'francois.lemoine@ecole.com', 'specialite' => 'Anglais'],
            ['prenom' => 'Géraldine', 'nom' => 'Chevalier', 'telephone' => '0223456789', 'email' => 'geraldine.chevalier@ecole.com', 'specialite' => 'EPS'],
        ];

        foreach ($professeurs as $prof) {
            DB::table('professeurs')->insert([
                'uid' => Str::uuid(),
                'prenom' => $prof['prenom'],
                'nom' => $prof['nom'],
                'telephone' => $prof['telephone'],
                'email' => $prof['email'],
                'specialite' => $prof['specialite'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedClasses()
    {
        $niveaux = DB::table('niveaux')->get();
        $professeurs = DB::table('professeurs')->get();

        $classes = [
            ['niveau_id' => $niveaux[0]->id, 'nom' => 'A', 'professeur_id' => $professeurs[0]->id],
            ['niveau_id' => $niveaux[0]->id, 'nom' => 'B', 'professeur_id' => $professeurs[1]->id],
            ['niveau_id' => $niveaux[6]->id, 'nom' => 'A', 'professeur_id' => $professeurs[2]->id],
            ['niveau_id' => $niveaux[6]->id, 'nom' => 'B', 'professeur_id' => $professeurs[3]->id],
            ['niveau_id' => $niveaux[10]->id, 'nom' => 'A', 'professeur_id' => $professeurs[4]->id],
            ['niveau_id' => $niveaux[12]->id, 'nom' => 'A', 'professeur_id' => $professeurs[5]->id],
            ['niveau_id' => $niveaux[0]->id, 'nom' => 'C', 'professeur_id' => $professeurs[0]->id],
            ['niveau_id' => $niveaux[0]->id, 'nom' => 'D', 'professeur_id' => $professeurs[1]->id],
            ['niveau_id' => $niveaux[6]->id, 'nom' => 'C', 'professeur_id' => $professeurs[2]->id],
            ['niveau_id' => $niveaux[6]->id, 'nom' => 'D', 'professeur_id' => $professeurs[3]->id],
            ['niveau_id' => $niveaux[10]->id, 'nom' => 'C', 'professeur_id' => $professeurs[4]->id],
            ['niveau_id' => $niveaux[12]->id, 'nom' => 'D', 'professeur_id' => $professeurs[5]->id],
        ];

        foreach ($classes as $classe) {
            DB::table('classes')->insert([
                'uid' => Str::uuid(),
                'niveau_id' => $classe['niveau_id'],
                'nom' => $classe['nom'],
                'professeur_id' => $classe['professeur_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedEleves()
    {
        $parents = DB::table('parent_eleves')->get();

        $eleves = [
            ['prenom' => 'Lucas', 'nom' => 'Dupont', 'date_naissance' => '2010-05-15', 'sexe' => 'M', 'parent_eleve_id' => $parents[0]->id],
            ['prenom' => 'Emma', 'nom' => 'Dupont', 'date_naissance' => '2011-08-22', 'sexe' => 'F', 'parent_eleve_id' => $parents[0]->id],
            ['prenom' => 'Hugo', 'nom' => 'Martin', 'date_naissance' => '2010-03-10', 'sexe' => 'M', 'parent_eleve_id' => $parents[1]->id],
            ['prenom' => 'Léa', 'nom' => 'Martin', 'date_naissance' => '2012-11-30', 'sexe' => 'F', 'parent_eleve_id' => $parents[1]->id],
            ['prenom' => 'Thomas', 'nom' => 'Durand', 'date_naissance' => '2009-12-05', 'sexe' => 'M', 'parent_eleve_id' => $parents[2]->id],
            ['prenom' => 'Chloé', 'nom' => 'Leroy', 'date_naissance' => '2010-07-18', 'sexe' => 'F', 'parent_eleve_id' => $parents[3]->id],
            ['prenom' => 'Nathan', 'nom' => 'Moreau', 'date_naissance' => '2011-02-25', 'sexe' => 'M', 'parent_eleve_id' => $parents[4]->id],
            ['prenom' => 'Manon', 'nom' => 'Moreau', 'date_naissance' => '2009-09-12', 'sexe' => 'F', 'parent_eleve_id' => $parents[4]->id],
        ];

        foreach ($eleves as $eleve) {
            DB::table('eleves')->insert([
                'uid' => Str::uuid(),
                'prenom' => $eleve['prenom'],
                'nom' => $eleve['nom'],
                'date_naissance' => $eleve['date_naissance'],
                'sexe' => $eleve['sexe'],
                'parent_eleve_id' => $eleve['parent_eleve_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedAnneeScolaires()
    {
        $annees = [
            [
                'nom' => '2023-2024',
                'date_debut' => '2023-09-04',
                'date_fin' => '2024-07-05',
                'actif' => true
            ],
            [
                'nom' => '2022-2023',
                'date_debut' => '2022-09-05',
                'date_fin' => '2023-07-04',
                'actif' => false
            ],
        ];

        foreach ($annees as $annee) {
            DB::table('annee_scolaires')->insert([
                'uid' => Str::uuid(),
                'nom' => $annee['nom'],
                'date_debut' => $annee['date_debut'],
                'date_fin' => $annee['date_fin'],
                'actif' => $annee['actif'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedTrimestres()
    {
        $anneeActive = DB::table('annee_scolaires')->where('actif', true)->first();

        $trimestres = [
            [
                'numero' => 1,
                'nom' => 'Premier Trimestre',
                'date_debut' => '2023-09-04',
                'date_fin' => '2023-12-16',
                'bareme' => 20
            ],
            [
                'numero' => 2,
                'nom' => 'Deuxième Trimestre',
                'date_debut' => '2024-01-08',
                'date_fin' => '2024-04-06',
                'bareme' => 20
            ],
            [
                'numero' => 3,
                'nom' => 'Troisième Trimestre',
                'date_debut' => '2024-04-22',
                'date_fin' => '2024-07-05',
                'bareme' => 20
            ],
        ];

        foreach ($trimestres as $trimestre) {
            DB::table('trimestres')->insert([
                'uid' => Str::uuid(),
                'annee_scolaire_id' => $anneeActive->id,
                'numero' => $trimestre['numero'],
                'nom' => $trimestre['nom'],
                'date_debut' => $trimestre['date_debut'],
                'date_fin' => $trimestre['date_fin'],
                'bareme' => $trimestre['bareme'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedMatieres()
    {
        $niveaux = DB::table('niveaux')->get();
        $professeurs = DB::table('professeurs')->get();

        $matieres = [
            ['nom' => 'Mathématiques', 'coefficient' => 4, 'niveau_id' => null, 'professeur_id' => $professeurs[0]->id],
            ['nom' => 'Français', 'coefficient' => 4, 'niveau_id' => null, 'professeur_id' => $professeurs[1]->id],
            ['nom' => 'Histoire-Géographie', 'coefficient' => 2, 'niveau_id' => null, 'professeur_id' => $professeurs[2]->id],
            ['nom' => 'Sciences', 'coefficient' => 3, 'niveau_id' => null, 'professeur_id' => $professeurs[3]->id],
            ['nom' => 'Anglais', 'coefficient' => 2, 'niveau_id' => null, 'professeur_id' => $professeurs[4]->id],
            ['nom' => 'EPS', 'coefficient' => 1, 'niveau_id' => null, 'professeur_id' => $professeurs[5]->id],
        ];

        foreach ($matieres as $matiere) {
            DB::table('matieres')->insert([
                'uid' => Str::uuid(),
                'nom' => $matiere['nom'],
                'coefficient' => $matiere['coefficient'],
                'niveau_id' => $matiere['niveau_id'],
                'professeur_id' => $matiere['professeur_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedInscriptions()
    {
        $classes = DB::table('classes')->get();
        $eleves = DB::table('eleves')->get();
        $anneeActive = DB::table('annee_scolaires')->where('actif', true)->first();

        $inscriptions = [];
        $eleveIndex = 0;

        foreach ($classes as $classe) {
            // Assigner 2 élèves par classe
            for ($i = 0; $i < 2; $i++) {
                if ($eleveIndex < count($eleves)) {
                    $inscriptions[] = [
                        'classe_id' => $classe->id,
                        'eleve_id' => $eleves[$eleveIndex]->id,
                        'annee_scolaire_id' => $anneeActive->id,
                        'statut' => 'actif',
                        'date_inscription' => now(),
                    ];
                    $eleveIndex++;
                }
            }
        }

        foreach ($inscriptions as $inscription) {
            DB::table('inscriptions')->insert([
                'uid' => Str::uuid(),
                'date_inscription' => $inscription['date_inscription'],
                'statut' => $inscription['statut'],
                'classe_id' => $inscription['classe_id'],
                'eleve_id' => $inscription['eleve_id'],
                'annee_scolaire_id' => $inscription['annee_scolaire_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedCompositions()
    {
        $trimestres = DB::table('trimestres')->get();
        $classes = DB::table('classes')->get();

        $compositions = [];
        $langues = ['Français', 'Anglais'];

        foreach ($trimestres as $trimestre) {
            foreach ($classes as $classe) {
                foreach ($langues as $langue) {
                    $compositions[] = [
                        'trimestre_id' => $trimestre->id,
                        'classe_id' => $classe->id,
                        'langue' => $langue,
                        'nom' => "Composition {$trimestre->numero} - {$classe->nom} - {$langue}",
                    ];
                }
            }
        }

        foreach ($compositions as $composition) {
            DB::table('compositions')->insert([
                'uid' => Str::uuid(),
                'trimestre_id' => $composition['trimestre_id'],
                'classe_id' => $composition['classe_id'],
                'langue' => $composition['langue'],
                'nom' => $composition['nom'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedCompositionMatieres()
    {
        $compositions = DB::table('compositions')->get();
        $matieres = DB::table('matieres')->get();

        foreach ($compositions as $composition) {
            foreach ($matieres as $matiere) {
                DB::table('composition_matieres')->insert([
                    'uid' => Str::uuid(),
                    'composition_id' => $composition->id,
                    'matiere_id' => $matiere->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function seedNotes()
    {
        $inscriptions = DB::table('inscriptions')->get();
        $compositions = DB::table('compositions')->get();
        $matieres = DB::table('matieres')->get();

        foreach ($inscriptions as $inscription) {
            foreach ($compositions as $composition) {
                foreach ($matieres as $matiere) {
                    $note = rand(8, 18) + (rand(0, 10) / 10); // Note entre 8.0 et 18.9
                    
                    DB::table('notes')->insert([
                        'uid' => Str::uuid(),
                        'inscription_id' => $inscription->id,
                        'composition_id' => $composition->id,
                        'matiere_id' => $matiere->id,
                        'note' => $note,
                        'sur' => 20,
                        'appreciation' => $this->getAppreciation($note),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    private function seedBulletins()
    {
        $inscriptions = DB::table('inscriptions')
            ->join('eleves', 'inscriptions.eleve_id', '=', 'eleves.id')
            ->join('classes', 'inscriptions.classe_id', '=', 'classes.id')
            ->join('niveaux', 'classes.niveau_id', '=', 'niveaux.id')
            ->join('annee_scolaires', 'inscriptions.annee_scolaire_id', '=', 'annee_scolaires.id')
            ->select('inscriptions.*', 'eleves.nom as eleve_nom', 'classes.nom as classe_nom', 
                    'niveaux.nom as niveau_nom', 'annee_scolaires.nom as annee_scolaire_nom')
            ->get();

        $trimestres = DB::table('trimestres')->get();
        $professeurs = DB::table('professeurs')->get();

        foreach ($inscriptions as $inscription) {
            foreach ($trimestres as $trimestre) {
                $moyenne = rand(10, 16) + (rand(0, 9) / 10); // Moyenne entre 10.0 et 16.9
                $rang = rand(1, 25);
                $moyenneClasse = rand(11, 14) + (rand(0, 9) / 10);

                DB::table('bulletins')->insert([
                    'uid' => Str::uuid(),
                    'inscription_id' => $inscription->id,
                    'trimestre_id' => $trimestre->id,
                    'annuel' => false,
                    'annee_scolaire_nom' => $inscription->annee_scolaire_nom,
                    'trimestre_nom' => $trimestre->nom,
                    'eleve_nom' => $inscription->eleve_nom,
                    'classe_nom' => $inscription->classe_nom,
                    'niveau_nom' => $inscription->niveau_nom,
                    'moyenne_eleve' => $moyenne,
                    'rang' => $rang,
                    'moyenne_classe' => $moyenneClasse,
                    'professeur_nom' => $professeurs[0]->prenom . ' ' . $professeurs[0]->nom,
                    'professeur_fonction' => 'Professeur Principal',
                    'directeur_nom' => 'M. Le Directeur',
                    'directeur_fonction' => 'Directeur de l\'établissement',
                    'parent_nom' => 'Parent d\'élève',
                    'parent_lien' => 'Père/Mère',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function seedBulletinDetails()
    {
        $bulletins = DB::table('bulletins')->get();
        $matieres = DB::table('matieres')->get();

        foreach ($bulletins as $bulletin) {
            foreach ($matieres as $matiere) {
                $note = rand(8, 18) + (rand(0, 10) / 10);
                $noteNormalisee = ($note / 20) * $bulletin->moyenne_eleve;

                DB::table('bulletin_details')->insert([
                    'uid' => Str::uuid(),
                    'bulletin_id' => $bulletin->id,
                    'matiere_id' => $matiere->id,
                    'matiere_nom' => $matiere->nom,
                    'coefficient' => $matiere->coefficient,
                    'professeur_nom' => 'Professeur ' . $matiere->nom,
                    'note' => $note,
                    'sur' => 20,
                    'note_normalisee' => $noteNormalisee,
                    'appreciation' => $this->getAppreciation($note),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function getAppreciation($note)
    {
        if ($note >= 16) return 'Excellent';
        if ($note >= 14) return 'Très bien';
        if ($note >= 12) return 'Bien';
        if ($note >= 10) return 'Assez bien';
        if ($note >= 8) return 'Passable';
        return 'Insuffisant';
    }
}