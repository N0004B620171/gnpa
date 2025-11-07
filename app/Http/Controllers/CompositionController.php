<?php

namespace App\Http\Controllers;

use App\Helpers\BulletinHelper;
use App\Models\Composition;
use App\Models\Trimestre;
use App\Models\Classe;
use App\Models\Matiere;
use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompositionController extends Controller
{
    // Dans la méthode index du contrôleur
    public function index(Request $request)
    {
        $query = Composition::with(['trimestre.anneeScolaire', 'classe.niveau', 'matieres']);

        // Filtre par recherche textuelle
        if ($request->has('q') && $request->q != '') {
            $search = $request->q;
            $query->where('nom', 'LIKE', "%{$search}%")
                ->orWhereHas('classe', function ($q) use ($search) {
                    $q->where('nom', 'LIKE', "%{$search}%");
                });
        }

        // Filtre par trimestre
        if ($request->has('trimestre_id') && $request->trimestre_id != '') {
            $query->where('trimestre_id', $request->trimestre_id);
        }

        // Filtre par classe
        if ($request->has('classe_id') && $request->classe_id != '') {
            $query->where('classe_id', $request->classe_id);
        }

        // Filtre par type (is_controle)
        if ($request->has('is_controle') && $request->is_controle != '') {
            $query->where('is_controle', $request->is_controle === 'true');
        }

        $compositions = $query->latest()->paginate(10);

        // Charger les trimestres actifs avec leurs années scolaires
        $trimestres = Trimestre::with('anneeScolaire')
            ->whereHas('anneeScolaire', function ($query) {
                $query->where('actif', true);
            })
            ->get()
            ->map(function ($trimestre) {
                return [
                    'id' => $trimestre->id,
                    'nom' => $trimestre->nom . ' - ' . $trimestre->anneeScolaire->nom,
                    'annee_scolaire' => $trimestre->anneeScolaire->nom
                ];
            });

        // Charger les classes pour le formulaire
        $classes = Classe::with('niveau')->get()->map(function ($classe) {
            return [
                'id' => $classe->id,
                'nom' => $classe->nom . ' - ' . $classe->niveau->nom,
                'niveau_nom' => $classe->niveau->nom
            ];
        });

        return Inertia::render('Compositions/Index', [
            'compositions' => $compositions,
            'trimestres' => $trimestres,
            'classes' => $classes,
            'filters' => [
                'q' => $request->q,
                'trimestre_id' => $request->trimestre_id,
                'classe_id' => $request->classe_id,
                'is_controle' => $request->is_controle
            ]
        ]);
    }

    public function create()
    {
        // Charger les trimestres pour le formulaire de création
        $trimestres = Trimestre::with('anneeScolaire')
            ->whereHas('anneeScolaire', function ($query) {
                $query->where('actif', true);
            })
            ->get()
            ->map(function ($trimestre) {
                return [
                    'id' => $trimestre->id,
                    'nom' => $trimestre->nom . ' - ' . $trimestre->anneeScolaire->nom
                ];
            });

        // Charger les classes pour le formulaire
        $classes = Classe::with('niveau')->get()->map(function ($classe) {
            return [
                'id' => $classe->id,
                'nom' => $classe->nom . ' - ' . $classe->niveau->nom
            ];
        });

        // Charger les matières disponibles
        $matieres = Matiere::all();

        return Inertia::render('Compositions/Create', [
            'trimestres' => $trimestres,
            'classes' => $classes,
            'matieres' => $matieres
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'trimestre_id' => 'required|exists:trimestres,id',
            'classe_id' => 'required|exists:classes,id',
            'nom' => 'required|string|max:100',
            'date' => 'required|date',
            'langue' => 'required|string|in:fr,en,ar',
            'matieres' => 'required|array|min:1',
            'matieres.*' => 'exists:matieres,id'
        ]);

        DB::beginTransaction();
        try {
            $composition = Composition::create($request->only([
                'trimestre_id',
                'classe_id',
                'nom',
                'date',
                'langue'
            ]));

            // Attacher les matières à la composition
            if ($request->has('matieres') && is_array($request->matieres)) {
                $composition->matieres()->attach($request->matieres);
                Log::info('Matières attachées', ['count' => count($request->matieres), 'matieres' => $request->matieres]);

                // ⚡ Déclenche l’observer "saved"
                $composition->load('matieres');
                $composition->touch();
            }
            DB::commit();

            return redirect()->route('compositions.index')
                ->with('success', 'Composition créée avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur lors de la création: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function show(Composition $composition)
    {
        $composition->load([
            'trimestre.anneeScolaire',
            'classe.niveau',
            'matieres',
            'notes.inscription.eleve'
        ]);

        return Inertia::render('Compositions/Show', [
            'composition' => $composition
        ]);
    }

    public function edit(Composition $composition)
    {
        $composition->load(['trimestre.anneeScolaire', 'classe.niveau', 'matieres']);

        // Charger les trimestres pour le formulaire d'édition
        $trimestres = Trimestre::with('anneeScolaire')
            ->whereHas('anneeScolaire', function ($query) {
                $query->where('actif', true);
            })
            ->get()
            ->map(function ($trimestre) {
                return [
                    'id' => $trimestre->id,
                    'nom' => $trimestre->nom . ' - ' . $trimestre->anneeScolaire->nom
                ];
            });

        // Charger les classes pour le formulaire
        $classes = Classe::with('niveau')->get()->map(function ($classe) {
            return [
                'id' => $classe->id,
                'nom' => $classe->nom . ' - ' . $classe->niveau->nom
            ];
        });

        // Charger les matières disponibles
        $matieres = Matiere::all();

        return Inertia::render('Compositions/Edit', [
            'composition' => $composition,
            'trimestres' => $trimestres,
            'classes' => $classes,
            'matieres' => $matieres
        ]);
    }

    public function update(Request $request, Composition $composition)
    {
        $request->validate([
            'trimestre_id' => 'required|exists:trimestres,id',
            'classe_id' => 'required|exists:classes,id',
            'nom' => 'required|string|max:100',
            'date' => 'required|date',
            'langue' => 'required|string|in:fr,en,ar',
            'matieres' => 'required|array|min:1',
            'matieres.*' => 'exists:matieres,id'
        ]);

        DB::beginTransaction();
        try {
            $composition->update($request->only([
                'trimestre_id',
                'classe_id',
                'nom',
                'date',
                'langue'
            ]));

            // Synchroniser les matières
            $composition->matieres()->sync($request->matieres);

            DB::commit();

            return redirect()->route('compositions.index')
                ->with('success', 'Composition mise à jour avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur lors de la mise à jour: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function destroy(Composition $composition)
    {
        // Vérifier s'il y a des notes associées
        if ($composition->notes()->exists()) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer cette composition car elle contient des notes');
        }

        DB::beginTransaction();
        try {
            // Détacher les matières
            $composition->matieres()->detach();
            $composition->delete();

            DB::commit();

            return redirect()->route('compositions.index')
                ->with('success', 'Composition supprimée avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur lors de la suppression: ' . $e->getMessage());
        }
    }

    public function detachMatiere(Composition $composition, $matiereId)
    {
        DB::beginTransaction();
        try {
            $notesCount = $composition->notes()->where('matiere_id', $matiereId)->count();

            if ($notesCount > 0) {
                return back()->with('error', 'Impossible de retirer cette matière car elle contient des notes.');
            }

            $composition->matieres()->detach($matiereId);

            DB::commit();

            return back()->with('success', 'Matière retirée et bulletins mis à jour.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur: ' . $e->getMessage());
        }
    }

    public function getCompositionData(Composition $composition, Request $request)
    {
        $matiereId = $request->get('matiere_id');

        // Charger la composition avec toutes les relations nécessaires
        $composition->load([
            'classe.inscriptions.eleve.parentEleve',
            'matieres',
            'trimestre.anneeScolaire',
            'notes' => function ($query) use ($matiereId) {
                if ($matiereId) {
                    $query->where('matiere_id', $matiereId);
                }
                $query->with('matiere');
            }
        ]);

        // Récupérer toutes les notes existantes pour cette composition
        $existingNotesQuery = Note::where('composition_id', $composition->id);
        if ($matiereId) {
            $existingNotesQuery->where('matiere_id', $matiereId);
        }

        $existingNotes = $existingNotesQuery->get()
            ->groupBy(['inscription_id', 'matiere_id'])
            ->toArray();

        // Calculer les statistiques de saisie
        $totalEleves = $composition->classe->inscriptions->count();
        $matieresStats = [];

        foreach ($composition->matieres as $matiere) {
            $notesCount = Note::where('composition_id', $composition->id)
                ->where('matiere_id', $matiere->id)
                ->count();

            $matieresStats[$matiere->id] = [
                'saisies' => $notesCount,
                'total' => $totalEleves,
                'pourcentage' => $totalEleves > 0 ? round(($notesCount / $totalEleves) * 100, 1) : 0
            ];
        }

        return response()->json([
            'composition' => $composition,
            'existingNotes' => $existingNotes,
            'matieresStats' => $matieresStats,
            'totalEleves' => $totalEleves
        ]);
    }
}
