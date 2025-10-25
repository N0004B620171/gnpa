<?php

namespace App\Http\Controllers;

use App\Models\Bulletin;
use App\Models\Inscription;
use App\Models\Trimestre;
use App\Models\AnneeScolaire;
use App\Models\Classe;
use App\Helpers\BulletinHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BulletinController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Bulletin::with([
            'inscription.eleve',
            'inscription.classe.niveau',
            'trimestre.anneeScolaire'
        ]);

        // Filtres
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('eleve_nom', 'like', "%{$search}%")
                  ->orWhere('classe_nom', 'like', "%{$search}%")
                  ->orWhere('niveau_nom', 'like', "%{$search}%");
            });
        }

        if ($request->has('annee_scolaire_id') && $request->annee_scolaire_id) {
            $anneeScolaire = AnneeScolaire::find($request->annee_scolaire_id);
            if ($anneeScolaire) {
                $query->where('annee_scolaire_nom', $anneeScolaire->nom);
            }
        }

        if ($request->has('trimestre_id') && $request->trimestre_id) {
            $query->where('trimestre_id', $request->trimestre_id);
        }

        if ($request->has('classe_id') && $request->classe_id) {
            $query->whereHas('inscription.classe', function($q) use ($request) {
                $q->where('id', $request->classe_id);
            });
        }

        if ($request->has('annuel')) {
            $query->where('annuel', $request->boolean('annuel'));
        }

        // Tri
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $bulletins = $query->paginate($request->get('per_page', 20))
            ->withQueryString();

        // Calcul des statistiques
        $statsQuery = Bulletin::query();
        if ($request->has('annee_scolaire_id') && $request->annee_scolaire_id) {
            $anneeScolaire = AnneeScolaire::find($request->annee_scolaire_id);
            if ($anneeScolaire) {
                $statsQuery->where('annee_scolaire_nom', $anneeScolaire->nom);
            }
        }

        $stats = $statsQuery->selectRaw('
            COUNT(*) as total_bulletins,
            AVG(moyenne_eleve) as moyenne_generale,
            AVG(moyenne_classe) as moyenne_classe_generale,
            SUM(CASE WHEN moyenne_eleve >= 10 THEN 1 ELSE 0 END) as admis,
            SUM(CASE WHEN moyenne_eleve < 10 THEN 1 ELSE 0 END) as non_admis
        ')->first();

        return Inertia::render('Bulletins/Index', [
            'bulletins' => $bulletins,
            'classes' => Classe::with('niveau')->get(),
            'trimestres' => Trimestre::with('anneeScolaire')->get(),
            'anneesScolaires' => AnneeScolaire::all(),
            'filters' => $request->only([
                'search', 'classe_id', 'trimestre_id', 'annee_scolaire_id', 'annuel', 'perPage'
            ]),
            'stats' => $stats
        ]);
    }

    public function show(Bulletin $bulletin): Response
    {
        $bulletin->load([
            'details.matiere',
            'inscription.eleve.parentEleve',
            'inscription.classe.niveau.cycle',
            'trimestre.anneeScolaire'
        ]);

        return Inertia::render('Bulletins/Show', [
            'bulletin' => $bulletin
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Bulletins/Create', [
            'classes' => Classe::with(['niveau', 'inscriptions.eleve'])->get(),
            'trimestres' => Trimestre::with('anneeScolaire')->get(),
            'anneesScolaires' => AnneeScolaire::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'inscription_id' => 'required|exists:inscriptions,id',
            'trimestre_id' => 'required_without:annuel|exists:trimestres,id',
            'annuel' => 'boolean',
        ]);

        $inscription = Inscription::with(['classe.niveau', 'eleve', 'anneeScolaire'])
            ->findOrFail($validated['inscription_id']);

        try {
            if (isset($validated['annuel']) && $validated['annuel']) {
                $bulletin = BulletinHelper::generateAnnuel($inscription);
            } else {
                $trimestre = Trimestre::with('anneeScolaire')->findOrFail($validated['trimestre_id']);
                $bulletin = BulletinHelper::generateTrimestriel($inscription, $trimestre);
            }

            return redirect()->route('bulletins.show', $bulletin->id)
                ->with('success', 'Bulletin généré avec succès');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la génération du bulletin: ' . $e->getMessage());
        }
    }

    public function edit(Bulletin $bulletin): Response
    {
        $bulletin->load([
            'details.matiere',
            'inscription.eleve.parentEleve',
            'inscription.classe.niveau'
        ]);

        return Inertia::render('Bulletins/Edit', [
            'bulletin' => $bulletin
        ]);
    }

    public function update(Request $request, Bulletin $bulletin)
    {
        $validated = $request->validate([
            'professeur_nom' => 'nullable|string|max:255',
            'professeur_fonction' => 'nullable|string|max:255',
            'professeur_signature' => 'nullable|string',
            'directeur_nom' => 'nullable|string|max:255',
            'directeur_fonction' => 'nullable|string|max:255',
            'directeur_signature' => 'nullable|string',
            'parent_nom' => 'nullable|string|max:255',
            'parent_lien' => 'nullable|string|max:255',
            'parent_signature' => 'nullable|string',
        ]);

        $bulletin->update($validated);

        return redirect()->route('bulletins.show', $bulletin->id)
            ->with('success', 'Bulletin mis à jour avec succès');
    }

    public function destroy(Bulletin $bulletin)
    {
        $bulletin->details()->delete();
        $bulletin->delete();

        return redirect()->route('bulletins.index')
            ->with('success', 'Bulletin supprimé avec succès');
    }

    public function generateTrimestre(Request $request, $inscriptionId)
    {
        $request->validate([
            'trimestre_id' => 'required|exists:trimestres,id'
        ]);

        try {
            $inscription = Inscription::with(['classe.professeur', 'eleve', 'notes.matiere'])->findOrFail($inscriptionId);
            $trimestre = Trimestre::with('anneeScolaire')->findOrFail($request->trimestre_id);
            $bulletin = BulletinHelper::generateTrimestriel($inscription, $trimestre);

            return redirect()->route('bulletins.show', $bulletin->id)
                ->with('success', 'Bulletin trimestriel généré avec succès');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la génération: ' . $e->getMessage());
        }
    }

    public function generateAnnuel($inscriptionId)
    {
        try {
            $inscription = Inscription::with(['classe.professeur', 'eleve', 'notes.matiere'])->findOrFail($inscriptionId);
            $bulletin = BulletinHelper::generateAnnuel($inscription);

            return redirect()->route('bulletins.show', $bulletin->id)
                ->with('success', 'Bulletin annuel généré avec succès');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la génération: ' . $e->getMessage());
        }
    }

    public function download(Bulletin $bulletin)
    {
        return BulletinHelper::generatePDF($bulletin);
    }

    public function bulkGenerate(Request $request)
    {
        $validated = $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'trimestre_id' => 'required_without:annuel|exists:trimestres,id',
            'annuel' => 'boolean',
        ]);

        try {
            $inscriptions = Inscription::where('classe_id', $validated['classe_id'])
                ->where('statut', 'actif')
                ->get();

            $generated = [];
            foreach ($inscriptions as $inscription) {
                if (isset($validated['annuel']) && $validated['annuel']) {
                    $bulletin = BulletinHelper::generateAnnuel($inscription);
                } else {
                    $trimestre = Trimestre::with('anneeScolaire')->findOrFail($validated['trimestre_id']);
                    $bulletin = BulletinHelper::generateTrimestriel($inscription, $trimestre);
                }
                $generated[] = $bulletin;
            }

            return redirect()->route('bulletins.index')
                ->with('success', count($generated) . ' bulletins générés avec succès');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la génération groupée: ' . $e->getMessage());
        }
    }
}