<?php

namespace App\Http\Controllers;

use App\Models\Matiere;
use App\Models\Niveau;
use App\Models\Professeur;
use App\Models\Composition;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MatiereController extends Controller
{
    public function index(Request $request)
    {
        $query = Matiere::with(['niveau.cycle', 'professeur', 'compositions']);

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('nom', 'LIKE', "%{$search}%")
                  ->orWhereHas('niveau', function($q) use ($search) {
                      $q->where('nom', 'LIKE', "%{$search}%");
                  })
                  ->orWhereHas('professeur', function($q) use ($search) {
                      $q->where('prenom', 'LIKE', "%{$search}%")
                        ->orWhere('nom', 'LIKE', "%{$search}%");
                  });
        }

        if ($request->has('niveau_id') && $request->niveau_id != '') {
            $query->where('niveau_id', $request->niveau_id);
        }

        $perPage = $request->get('perPage', 10);
        $matieres = $query->withCount(['notes', 'compositions'])->paginate($perPage);

        return Inertia::render('Matieres/Index', [
            'matieres' => $matieres,
            'niveaux' => Niveau::with('cycle')->get(),
            'professeurs' => Professeur::all(),
            'filters' => [
                'search' => $request->search,
                'niveau_id' => $request->niveau_id,
                'perPage' => $perPage
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Matieres/Create', [
            'niveaux' => Niveau::with('cycle')->get(),
            'professeurs' => Professeur::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:matieres,nom',
            'coefficient' => 'required|integer|min:1|max:10',
            'niveau_id' => 'nullable|exists:niveaux,id',
            'professeur_id' => 'nullable|exists:professeurs,id'
        ]);

        Matiere::create($request->all());

        return redirect()->route('matieres.index')
            ->with('success', 'Matière créée avec succès');
    }

    public function show(Matiere $matiere)
    {
        $matiere->load([
            'niveau.cycle',
            'professeur',
            'notes.inscription.eleve',
            'notes.composition.trimestre.anneeScolaire',
            'compositions.trimestre.anneeScolaire',
            'compositions.classe.niveau'
        ]);

        // Charger les compositions disponibles pour l'ajout
        $compositionsDisponibles = Composition::with(['trimestre.anneeScolaire', 'classe.niveau'])
            ->whereDoesntHave('matieres', function($query) use ($matiere) {
                $query->where('matiere_id', $matiere->id);
            })
            ->get();

        // Calculer les statistiques
        $statistiques = [
            'total_notes' => $matiere->notes->count(),
            'moyenne_matiere' => $matiere->notes->avg('note'),
            'compositions_count' => $matiere->compositions->count(),
            'derniere_note' => $matiere->notes->sortByDesc('created_at')->first()
        ];

        return Inertia::render('Matieres/Show', [
            'matiere' => $matiere,
            'compositionsDisponibles' => $compositionsDisponibles,
            'statistiques' => $statistiques
        ]);
    }

    public function edit(Matiere $matiere)
    {
        return Inertia::render('Matieres/Edit', [
            'matiere' => $matiere,
            'niveaux' => Niveau::with('cycle')->get(),
            'professeurs' => Professeur::all()
        ]);
    }

    public function update(Request $request, Matiere $matiere)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:matieres,nom,' . $matiere->id,
            'coefficient' => 'required|integer|min:1|max:10',
            'niveau_id' => 'nullable|exists:niveaux,id',
            'professeur_id' => 'nullable|exists:professeurs,id'
        ]);

        $matiere->update($request->all());

        return redirect()->route('matieres.show', $matiere)
            ->with('success', 'Matière mise à jour avec succès');
    }

    public function destroy(Matiere $matiere)
    {
        if ($matiere->notes()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer cette matière car elle contient des notes');
        }

        DB::beginTransaction();
        try {
            // Détacher la matière de toutes les compositions
            $matiere->compositions()->detach();
            $matiere->delete();

            DB::commit();

            return redirect()->route('matieres.index')
                ->with('success', 'Matière supprimée avec succès');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur lors de la suppression: ' . $e->getMessage());
        }
    }

    public function attachComposition(Request $request, Matiere $matiere)
    {
        Log::info('Début attachComposition', [
            'matiere_id' => $matiere->id,
            'composition_id' => $request->composition_id
        ]);

        $request->validate([
            'composition_id' => 'required|exists:compositions,id'
        ]);

        DB::beginTransaction();
        try {
            // Vérifier si la composition est déjà attachée
            if ($matiere->compositions()->where('composition_id', $request->composition_id)->exists()) {
                return redirect()->back()
                    ->with('error', 'Cette matière est déjà associée à cette composition');
            }

            // Attacher la composition
            $matiere->compositions()->attach($request->composition_id);

            DB::commit();
            Log::info('Composition attachée avec succès');

            return redirect()->back()
                ->with('success', 'Matière ajoutée à la composition avec succès');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur attachComposition', ['error' => $e->getMessage()]);
            return redirect()->back()
                ->with('error', 'Erreur lors de l\'ajout: ' . $e->getMessage());
        }
    }

    public function detachComposition(Matiere $matiere, $compositionId)
    {
        DB::beginTransaction();
        try {
            // Vérifier s'il y a des notes pour cette matière dans la composition
            $notesCount = $matiere->notes()
                ->whereHas('composition', function($query) use ($compositionId) {
                    $query->where('id', $compositionId);
                })
                ->count();

            if ($notesCount > 0) {
                return redirect()->back()
                    ->with('error', 'Impossible de retirer cette matière car elle contient des notes');
            }

            // Détacher la composition
            $matiere->compositions()->detach($compositionId);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Matière retirée de la composition avec succès');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur lors du retrait: ' . $e->getMessage());
        }
    }

    public function getCompositions(Matiere $matiere)
    {
        $compositions = $matiere->compositions()
            ->with(['trimestre.anneeScolaire', 'classe.niveau'])
            ->get();

        return response()->json($compositions);
    }
}