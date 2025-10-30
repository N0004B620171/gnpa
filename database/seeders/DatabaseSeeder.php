<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Désactiver les contraintes de clés étrangères temporairement
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Vider les tables
        $tables = [
            'users',
            'cycles',
            'niveaux',
            'parent_eleves',
            'professeurs',
            'classes',
            'eleves',
            'annee_scolaires',
            'trimestres',
            'inscriptions',
            'matieres',
            'compositions',
            'notes',
            'bulletins',
            'bulletin_details',
            'langues',
            'cycle_langue',
            'services',
            'service_ciblages',
            'factures',
            'facture_details',
            'paiements',
            'buses',
            'itineraire_transports',
            'arrets',
            'affectation_transports',
            'materiels',
            'inventaire_classes',
            'inventaire_enseignants',
            'historique_transferts',
            'transferts_annees'
        ];

        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }

        // 1. Langues
        $langues = [
            ['uid' => Str::uuid(), 'code' => 'FR', 'nom' => 'Français'],
            ['uid' => Str::uuid(), 'code' => 'EN', 'nom' => 'Anglais'],
            ['uid' => Str::uuid(), 'code' => 'AR', 'nom' => 'Arabe'],
            ['uid' => Str::uuid(), 'code' => 'ES', 'nom' => 'Espagnol'],
        ];
        DB::table('langues')->insert($langues);

        // 2. Cycles
        $cycles = [
            ['uid' => Str::uuid(), 'nom' => 'Primaire', 'bareme' => 10.00, 'nombre_trimestres' => 3, 'systeme' => 'standard'],
            ['uid' => Str::uuid(), 'nom' => 'Collège', 'bareme' => 20.00, 'nombre_trimestres' => 3, 'systeme' => 'standard'],
            ['uid' => Str::uuid(), 'nom' => 'Lycée', 'bareme' => 20.00, 'nombre_trimestres' => 3, 'systeme' => 'standard'],
        ];
        DB::table('cycles')->insert($cycles);

        // 3. Cycle_Langue (association cycles et langues)
        $cycleLangues = [
            ['cycle_id' => 1, 'langue_id' => 1], // Primaire - Français
            ['cycle_id' => 1, 'langue_id' => 2], // Primaire - Anglais
            ['cycle_id' => 2, 'langue_id' => 1], // Collège - Français
            ['cycle_id' => 2, 'langue_id' => 2], // Collège - Anglais
            ['cycle_id' => 3, 'langue_id' => 1], // Lycée - Français
            ['cycle_id' => 3, 'langue_id' => 2], // Lycée - Anglais
        ];
        DB::table('cycle_langue')->insert($cycleLangues);

        // 4. Niveaux
        $niveaux = [
            // Primaire
            ['uid' => Str::uuid(), 'cycle_id' => 1, 'nom' => 'CI', 'moyenne_min_pour_passage' => 5.0],
            ['uid' => Str::uuid(), 'cycle_id' => 1, 'nom' => 'CP', 'moyenne_min_pour_passage' => 5.0],
            ['uid' => Str::uuid(), 'cycle_id' => 1, 'nom' => 'CE1', 'moyenne_min_pour_passage' => 5.5],
            ['uid' => Str::uuid(), 'cycle_id' => 1, 'nom' => 'CE2', 'moyenne_min_pour_passage' => 5.5],
            ['uid' => Str::uuid(), 'cycle_id' => 1, 'nom' => 'CM1', 'moyenne_min_pour_passage' => 6.0],
            ['uid' => Str::uuid(), 'cycle_id' => 1, 'nom' => 'CM2', 'moyenne_min_pour_passage' => 6.0],

            // Collège
            ['uid' => Str::uuid(), 'cycle_id' => 2, 'nom' => '6ème', 'moyenne_min_pour_passage' => 10.0],
            ['uid' => Str::uuid(), 'cycle_id' => 2, 'nom' => '5ème', 'moyenne_min_pour_passage' => 10.0],
            ['uid' => Str::uuid(), 'cycle_id' => 2, 'nom' => '4ème', 'moyenne_min_pour_passage' => 10.0],
            ['uid' => Str::uuid(), 'cycle_id' => 2, 'nom' => '3ème', 'moyenne_min_pour_passage' => 10.0],

            // Lycée
            ['uid' => Str::uuid(), 'cycle_id' => 3, 'nom' => 'Seconde', 'moyenne_min_pour_passage' => 10.0],
            ['uid' => Str::uuid(), 'cycle_id' => 3, 'nom' => 'Première', 'moyenne_min_pour_passage' => 10.0],
            ['uid' => Str::uuid(), 'cycle_id' => 3, 'nom' => 'Terminale', 'moyenne_min_pour_passage' => 10.0],
        ];
        DB::table('niveaux')->insert($niveaux);

        // 5. Professeurs
        $professeurs = [
            ['uid' => Str::uuid(), 'prenom' => 'Marie', 'nom' => 'Dupont', 'telephone' => '0123456789', 'email' => 'marie.dupont@ecole.com', 'specialite' => 'Mathématiques'],
            ['uid' => Str::uuid(), 'prenom' => 'Pierre', 'nom' => 'Martin', 'telephone' => '0123456790', 'email' => 'pierre.martin@ecole.com', 'specialite' => 'Français'],
            ['uid' => Str::uuid(), 'prenom' => 'Sophie', 'nom' => 'Bernard', 'telephone' => '0123456791', 'email' => 'sophie.bernard@ecole.com', 'specialite' => 'Histoire-Géographie'],
            ['uid' => Str::uuid(), 'prenom' => 'Luc', 'nom' => 'Petit', 'telephone' => '0123456792', 'email' => 'luc.petit@ecole.com', 'specialite' => 'Sciences'],
            ['uid' => Str::uuid(), 'prenom' => 'Isabelle', 'nom' => 'Moreau', 'telephone' => '0123456793', 'email' => 'isabelle.moreau@ecole.com', 'specialite' => 'Anglais'],
            ['uid' => Str::uuid(), 'prenom' => 'Antoine', 'nom' => 'Leroy', 'telephone' => '0123456794', 'email' => 'antoine.leroy@ecole.com', 'specialite' => 'EPS'],
        ];
        DB::table('professeurs')->insert($professeurs);

        // 6. Classes
        $classes = [
            // Primaire
            ['uid' => Str::uuid(), 'niveau_id' => 1, 'nom' => 'CI-A', 'professeur_id' => 1, 'capacite' => 25],
            ['uid' => Str::uuid(), 'niveau_id' => 2, 'nom' => 'CP-A', 'professeur_id' => 2, 'capacite' => 28],
            ['uid' => Str::uuid(), 'niveau_id' => 3, 'nom' => 'CE1-A', 'professeur_id' => 3, 'capacite' => 30],
            ['uid' => Str::uuid(), 'niveau_id' => 4, 'nom' => 'CE2-A', 'professeur_id' => 4, 'capacite' => 30],
            ['uid' => Str::uuid(), 'niveau_id' => 5, 'nom' => 'CM1-A', 'professeur_id' => 5, 'capacite' => 32],
            ['uid' => Str::uuid(), 'niveau_id' => 6, 'nom' => 'CM2-A', 'professeur_id' => 6, 'capacite' => 32],

            // Collège
            ['uid' => Str::uuid(), 'niveau_id' => 7, 'nom' => '6ème-A', 'professeur_id' => 1, 'capacite' => 35],
            ['uid' => Str::uuid(), 'niveau_id' => 8, 'nom' => '5ème-A', 'professeur_id' => 2, 'capacite' => 35],
            ['uid' => Str::uuid(), 'niveau_id' => 9, 'nom' => '4ème-A', 'professeur_id' => 3, 'capacite' => 35],
            ['uid' => Str::uuid(), 'niveau_id' => 10, 'nom' => '3ème-A', 'professeur_id' => 4, 'capacite' => 35],

            // Lycée
            ['uid' => Str::uuid(), 'niveau_id' => 11, 'nom' => 'Seconde-A', 'professeur_id' => 5, 'capacite' => 35],
            ['uid' => Str::uuid(), 'niveau_id' => 12, 'nom' => 'Première-A', 'professeur_id' => 6, 'capacite' => 35],
            ['uid' => Str::uuid(), 'niveau_id' => 13, 'nom' => 'Terminale-A', 'professeur_id' => 1, 'capacite' => 35],
        ];
        DB::table('classes')->insert($classes);

        // 7. Parents d'élèves
        $parentEleves = [
            ['uid' => Str::uuid(), 'prenom' => 'Jean', 'nom' => 'Durand', 'telephone' => '0612345678', 'email' => 'jean.durand@email.com', 'adresse' => '123 Rue de Paris, 75001 Paris'],
            ['uid' => Str::uuid(), 'prenom' => 'Catherine', 'nom' => 'Leroy', 'telephone' => '0612345679', 'email' => 'catherine.leroy@email.com', 'adresse' => '456 Avenue Victor Hugo, 75016 Paris'],
            ['uid' => Str::uuid(), 'prenom' => 'Michel', 'nom' => 'Moreau', 'telephone' => '0612345680', 'email' => 'michel.moreau@email.com', 'adresse' => '789 Boulevard Saint-Germain, 75006 Paris'],
            ['uid' => Str::uuid(), 'prenom' => 'Nathalie', 'nom' => 'Simon', 'telephone' => '0612345681', 'email' => 'nathalie.simon@email.com', 'adresse' => '321 Rue de Rivoli, 75004 Paris'],
            ['uid' => Str::uuid(), 'prenom' => 'Philippe', 'nom' => 'Garcia', 'telephone' => '0612345682', 'email' => 'philippe.garcia@email.com', 'adresse' => '654 Rue du Faubourg Saint-Antoine, 75012 Paris'],
        ];
        DB::table('parent_eleves')->insert($parentEleves);

        // 8. Élèves
        $eleves = [
            // Primaire
            ['uid' => Str::uuid(), 'prenom' => 'Lucas', 'nom' => 'Durand', 'date_naissance' => '2018-03-15', 'sexe' => 'M', 'parent_eleve_id' => 1],
            ['uid' => Str::uuid(), 'prenom' => 'Emma', 'nom' => 'Durand', 'date_naissance' => '2017-07-22', 'sexe' => 'F', 'parent_eleve_id' => 1],
            ['uid' => Str::uuid(), 'prenom' => 'Thomas', 'nom' => 'Leroy', 'date_naissance' => '2016-11-08', 'sexe' => 'M', 'parent_eleve_id' => 2],
            ['uid' => Str::uuid(), 'prenom' => 'Léa', 'nom' => 'Moreau', 'date_naissance' => '2015-05-30', 'sexe' => 'F', 'parent_eleve_id' => 3],
            ['uid' => Str::uuid(), 'prenom' => 'Hugo', 'nom' => 'Simon', 'date_naissance' => '2014-09-12', 'sexe' => 'M', 'parent_eleve_id' => 4],
            ['uid' => Str::uuid(), 'prenom' => 'Chloé', 'nom' => 'Garcia', 'date_naissance' => '2013-12-25', 'sexe' => 'F', 'parent_eleve_id' => 5],

            // Collège
            ['uid' => Str::uuid(), 'prenom' => 'Mathis', 'nom' => 'Durand', 'date_naissance' => '2011-02-14', 'sexe' => 'M', 'parent_eleve_id' => 1],
            ['uid' => Str::uuid(), 'prenom' => 'Manon', 'nom' => 'Leroy', 'date_naissance' => '2010-08-19', 'sexe' => 'F', 'parent_eleve_id' => 2],
            ['uid' => Str::uuid(), 'prenom' => 'Enzo', 'nom' => 'Moreau', 'date_naissance' => '2009-04-03', 'sexe' => 'M', 'parent_eleve_id' => 3],
            ['uid' => Str::uuid(), 'prenom' => 'Camille', 'nom' => 'Simon', 'date_naissance' => '2008-10-17', 'sexe' => 'F', 'parent_eleve_id' => 4],

            // Lycée
            ['uid' => Str::uuid(), 'prenom' => 'Alexandre', 'nom' => 'Garcia', 'date_naissance' => '2007-01-28', 'sexe' => 'M', 'parent_eleve_id' => 5],
            ['uid' => Str::uuid(), 'prenom' => 'Sarah', 'nom' => 'Durand', 'date_naissance' => '2006-06-11', 'sexe' => 'F', 'parent_eleve_id' => 1],
            ['uid' => Str::uuid(), 'prenom' => 'Nathan', 'nom' => 'Leroy', 'date_naissance' => '2005-11-05', 'sexe' => 'M', 'parent_eleve_id' => 2],
        ];
        DB::table('eleves')->insert($eleves);

        // 9. Années scolaires
        $anneeScolaires = [
            [
                'uid' => Str::uuid(),
                'nom' => '2023-2024',
                'date_debut' => '2023-09-04',
                'date_fin' => '2024-07-05',
                'actif' => true,
                'description' => 'Année scolaire 2023-2024'
            ],
            [
                'uid' => Str::uuid(),
                'nom' => '2024-2025',
                'date_debut' => '2024-09-02',
                'date_fin' => '2025-07-04',
                'actif' => false,
                'description' => 'Année scolaire 2024-2025'
            ],
        ];
        DB::table('annee_scolaires')->insert($anneeScolaires);

        // 10. Trimestres pour l'année active
        $trimestres = [
            // Primaire - 2023-2024
            ['uid' => Str::uuid(), 'annee_scolaire_id' => 1, 'cycle_id' => 1, 'numero' => 1, 'nom' => 'Premier Trimestre', 'date_debut' => '2023-09-04', 'date_fin' => '2023-12-16', 'bareme' => 10.00, 'is_active' => false, 'mark_as_last' => false],
            ['uid' => Str::uuid(), 'annee_scolaire_id' => 1, 'cycle_id' => 1, 'numero' => 2, 'nom' => 'Deuxième Trimestre', 'date_debut' => '2024-01-08', 'date_fin' => '2024-03-30', 'bareme' => 10.00, 'is_active' => true, 'mark_as_last' => false],
            ['uid' => Str::uuid(), 'annee_scolaire_id' => 1, 'cycle_id' => 1, 'numero' => 3, 'nom' => 'Troisième Trimestre', 'date_debut' => '2024-04-15', 'date_fin' => '2024-07-05', 'bareme' => 10.00, 'is_active' => false, 'mark_as_last' => true],

            // Collège - 2023-2024
            ['uid' => Str::uuid(), 'annee_scolaire_id' => 1, 'cycle_id' => 2, 'numero' => 1, 'nom' => 'Premier Trimestre', 'date_debut' => '2023-09-04', 'date_fin' => '2023-12-16', 'bareme' => 20.00, 'is_active' => false, 'mark_as_last' => false],
            ['uid' => Str::uuid(), 'annee_scolaire_id' => 1, 'cycle_id' => 2, 'numero' => 2, 'nom' => 'Deuxième Trimestre', 'date_debut' => '2024-01-08', 'date_fin' => '2024-03-30', 'bareme' => 20.00, 'is_active' => true, 'mark_as_last' => false],
            ['uid' => Str::uuid(), 'annee_scolaire_id' => 1, 'cycle_id' => 2, 'numero' => 3, 'nom' => 'Troisième Trimestre', 'date_debut' => '2024-04-15', 'date_fin' => '2024-07-05', 'bareme' => 20.00, 'is_active' => false, 'mark_as_last' => true],
        ];
        DB::table('trimestres')->insert($trimestres);

        // 11. Matières
        $matieres = [
            // Primaire
            ['uid' => Str::uuid(), 'nom' => 'Français', 'coefficient' => 3, 'niveau_id' => 1, 'professeur_id' => 2],
            ['uid' => Str::uuid(), 'nom' => 'Mathématiques', 'coefficient' => 3, 'niveau_id' => 1, 'professeur_id' => 1],
            ['uid' => Str::uuid(), 'nom' => 'Éveil', 'coefficient' => 2, 'niveau_id' => 1, 'professeur_id' => 4],

            // Collège
            ['uid' => Str::uuid(), 'nom' => 'Français', 'coefficient' => 4, 'niveau_id' => 7, 'professeur_id' => 2],
            ['uid' => Str::uuid(), 'nom' => 'Mathématiques', 'coefficient' => 4, 'niveau_id' => 7, 'professeur_id' => 1],
            ['uid' => Str::uuid(), 'nom' => 'Histoire-Géographie', 'coefficient' => 3, 'niveau_id' => 7, 'professeur_id' => 3],
            ['uid' => Str::uuid(), 'nom' => 'Sciences', 'coefficient' => 3, 'niveau_id' => 7, 'professeur_id' => 4],
            ['uid' => Str::uuid(), 'nom' => 'Anglais', 'coefficient' => 2, 'niveau_id' => 7, 'professeur_id' => 5],
            ['uid' => Str::uuid(), 'nom' => 'EPS', 'coefficient' => 1, 'niveau_id' => 7, 'professeur_id' => 6],
        ];
        DB::table('matieres')->insert($matieres);

        // 12. Inscriptions
        $inscriptions = [];
        for ($i = 1; $i <= 13; $i++) { // Pour chaque élève
            $inscriptions[] = [
                'uid' => Str::uuid(),
                'date_inscription' => '2023-09-04',
                'statut' => 'actif',
                'classe_id' => min($i, 13), // Répartir dans les classes
                'eleve_id' => $i,
                'annee_scolaire_id' => 1,
            ];
        }
        DB::table('inscriptions')->insert($inscriptions);

        // 13. Compositions
        $compositions = [
            // Trimestre 2 - Primaire
            ['uid' => Str::uuid(), 'trimestre_id' => 2, 'classe_id' => 1, 'langue' => 'FR', 'nom' => 'Composition principale'],
            ['uid' => Str::uuid(), 'trimestre_id' => 2, 'classe_id' => 2, 'langue' => 'FR', 'nom' => 'Composition principale'],

            // Trimestre 2 - Collège
            ['uid' => Str::uuid(), 'trimestre_id' => 5, 'classe_id' => 7, 'langue' => 'FR', 'nom' => 'Composition principale'],
        ];
        DB::table('compositions')->insert($compositions);

        // 14. Notes (exemple pour quelques élèves)
        $notes = [];
        $matieresPrimaire = [1, 2, 3]; // Français, Maths, Éveil
        $matieresCollege = [4, 5, 6, 7, 8, 9]; // Toutes les matières collège

        // Notes pour élève 1 (CI-A)
        foreach ($matieresPrimaire as $matiereId) {
            $notes[] = [
                'uid' => Str::uuid(),
                'inscription_id' => 1,
                'composition_id' => 1,
                'matiere_id' => $matiereId,
                'note' => rand(8, 18) / 2, // Notes entre 4 et 9
                'sur' => 10.00,
                'appreciation' => 'Très bon travail',
            ];
        }

        // Notes pour élève 7 (6ème-A)
        foreach ($matieresCollege as $matiereId) {
            $notes[] = [
                'uid' => Str::uuid(),
                'inscription_id' => 7,
                'composition_id' => 3,
                'matiere_id' => $matiereId,
                'note' => rand(10, 38) / 2, // Notes entre 5 et 19
                'sur' => 20.00,
                'appreciation' => 'Bon travail',
            ];
        }

        DB::table('notes')->insert($notes);

        // 15. Services
        $services = [
            ['uid' => Str::uuid(), 'nom' => 'Scolarité', 'code' => 'SCOL_MENS', 'montant' => 5000.00, 'montant_a_payer' => 10000.00, 'obligatoire' => true, 'description' => 'Frais de scolarité mensuels', 'actif' => true],
            ['uid' => Str::uuid(), 'nom' => 'Transport scolaire', 'code' => 'TRANS', 'montant' => 2000.00, 'montant_a_payer' => null, 'obligatoire' => false, 'description' => 'Service de transport scolaire', 'actif' => true],
            ['uid' => Str::uuid(), 'nom' => 'Cantine', 'code' => 'CANT', 'montant' => 1500.00, 'montant_a_payer' => null, 'obligatoire' => false, 'description' => 'Service de restauration', 'actif' => true],
            ['uid' => Str::uuid(), 'nom' => 'Frais de dossier', 'code' => 'DOSSIER', 'montant' => 0.00, 'montant_a_payer' => 5000.00, 'obligatoire' => true, 'description' => 'Frais d\'inscription et de dossier', 'actif' => true],
        ];
        DB::table('services')->insert($services);

        // 16. Service Ciblages
        // Dans la section "16. Service Ciblages" du seeder, remplacez par :
        $serviceCiblages = [
            // Scolarité pour tous les niveaux
            ['uid' => Str::uuid(), 'service_id' => 1, 'ciblable_type' => 'App\\Models\\Niveau', 'ciblable_id' => 1],
            ['uid' => Str::uuid(), 'service_id' => 1, 'ciblable_type' => 'App\\Models\\Niveau', 'ciblable_id' => 2],
            // Transport pour certaines classes
            ['uid' => Str::uuid(), 'service_id' => 2, 'ciblable_type' => 'App\\Models\\Classe', 'ciblable_id' => 1],
            ['uid' => Str::uuid(), 'service_id' => 2, 'ciblable_type' => 'App\\Models\\Classe', 'ciblable_id' => 2],
        ];
        DB::table('service_ciblages')->insert($serviceCiblages);

        // 17. Bus
        $buses = [
            ['uid' => Str::uuid(), 'immatriculation' => 'AB-123-CD', 'marque' => 'Mercedes', 'modele' => 'Sprinter', 'capacite' => 50, 'chauffeur_nom' => 'Mohamed Diop', 'chauffeur_telephone' => '0771234567', 'etat' => 'actif'],
            ['uid' => Str::uuid(), 'immatriculation' => 'EF-456-GH', 'marque' => 'Toyota', 'modele' => 'Coaster', 'capacite' => 30, 'chauffeur_nom' => 'Ibrahim Ndiaye', 'chauffeur_telephone' => '0777654321', 'etat' => 'actif'],
        ];
        DB::table('buses')->insert($buses);

        // 18. Matériels
        $materiels = [
            ['uid' => Str::uuid(), 'nom' => 'Table élève', 'reference' => 'TAB-ELV-01', 'description' => 'Table individuelle pour élève'],
            ['uid' => Str::uuid(), 'nom' => 'Chaise élève', 'reference' => 'CHA-ELV-01', 'description' => 'Chaise standard pour élève'],
            ['uid' => Str::uuid(), 'nom' => 'Tableau blanc', 'reference' => 'TAB-BLANC-01', 'description' => 'Tableau blanc effaçable'],
            ['uid' => Str::uuid(), 'nom' => 'Ordinateur portable', 'reference' => 'HP-250-G8', 'description' => 'Ordinateur portable HP pour enseignant'],
            ['uid' => Str::uuid(), 'nom' => 'Projecteur vidéo', 'reference' => 'EPSON-XP', 'description' => 'Projecteur multimédia'],
        ];
        DB::table('materiels')->insert($materiels);

        // 19. Inventaire des classes
        $inventaireClasses = [
            ['uid' => Str::uuid(), 'classe_id' => 1, 'materiel_id' => 1, 'quantite' => 25, 'etat' => 'bon', 'date_ajout' => '2023-09-01', 'observation' => 'Nouveau matériel'],
            ['uid' => Str::uuid(), 'classe_id' => 1, 'materiel_id' => 2, 'quantite' => 25, 'etat' => 'bon', 'date_ajout' => '2023-09-01', 'observation' => 'Nouveau matériel'],
            ['uid' => Str::uuid(), 'classe_id' => 1, 'materiel_id' => 3, 'quantite' => 1, 'etat' => 'bon', 'date_ajout' => '2023-09-01', 'observation' => 'Tableau neuf'],
        ];
        DB::table('inventaire_classes')->insert($inventaireClasses);

        // 20. Inventaire des enseignants
        $inventaireEnseignants = [
            ['uid' => Str::uuid(), 'professeur_id' => 1, 'materiel_id' => 4, 'quantite' => 1, 'etat' => 'bon', 'date_attribution' => '2023-09-01', 'observation' => 'Pour préparer les cours'],
            ['uid' => Str::uuid(), 'professeur_id' => 2, 'materiel_id' => 5, 'quantite' => 1, 'etat' => 'bon', 'date_attribution' => '2023-09-01', 'observation' => 'Projecteur pour cours multimédias'],
        ];
        DB::table('inventaire_enseignants')->insert($inventaireEnseignants);

        // 21. Utilisateurs
        $users = [
            // Administrateur
            [
                'name' => 'Administrateur',
                'email' => 'admin@ecole.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'userable_type' => 'App\\Models\\Professeur',
                'userable_id' => 1,
                'remember_token' => Str::random(10),
            ],
            // Professeurs
            [
                'name' => 'Marie Dupont',
                'email' => 'marie.dupont@ecole.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'userable_type' => 'App\\Models\\Professeur',
                'userable_id' => 1,
                'remember_token' => Str::random(10),
            ],
            [
                'name' => 'Pierre Martin',
                'email' => 'pierre.martin@ecole.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'userable_type' => 'App\\Models\\Professeur',
                'userable_id' => 2,
                'remember_token' => Str::random(10),
            ],
            // Parent
            [
                'name' => 'Jean Durand',
                'email' => 'jean.durand@email.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'userable_type' => 'App\\Models\\ParentEleve',
                'userable_id' => 1,
                'remember_token' => Str::random(10),
            ],
        ];
        DB::table('users')->insert($users);

        // Réactiver les contraintes de clés étrangères
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('Base de données peuplée avec succès!');
        $this->command->info('Comptes de test créés:');
        $this->command->info('Admin: admin@ecole.com / password');
        $this->command->info('Professeur: marie.dupont@ecole.com / password');
        $this->command->info('Parent: jean.durand@email.com / password');
    }
}
