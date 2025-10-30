<?php

namespace App\Http\Controllers;

use App\Models\InventaireEnseignant;
use App\Models\Professeur;
use App\Models\Materiel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class InventaireEnseignantController extends Controller
{
    public function index(Request $request)
    {
        $query = InventaireEnseignant::with(['professeur', 'materiel']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('materiel', fn($q) => $q->where('nom', 'like', "%{$search}%"))
                ->orWhereHas('professeur', fn($q) => $q->where('prenom', 'like', "%{$search}%")
                    ->orWhere('nom', 'like', "%{$search}%"));
        }

        $perPage = $request->get('perPage', 10);
        $inventaires = $query->orderByDesc('created_at')->paginate($perPage);

        return Inertia::render('InventaireEnseignant/Index', [
            'inventaires' => $inventaires,
            'filters' => [
                'search' => $request->search,
                'perPage' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('InventaireEnseignant/Create', [
            'professeurs' => Professeur::orderBy('prenom')->get(['id', 'prenom', 'nom']),
            'materiels' => Materiel::orderBy('nom')->get(['id', 'nom']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'professeur_id' => 'required|exists:professeurs,id',
            'materiel_id' => 'required|exists:materiels,id',
            'quantite' => 'required|integer|min:1|max:1000',
            'etat' => 'required|in:bon,endommagé,perdu',
            'date_attribution' => 'nullable|date',
            'date_retour' => 'nullable|date|after_or_equal:date_attribution',
            'observation' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            // Vérifier si l'association existe déjà
            $existe = InventaireEnseignant::where('professeur_id', $validated['professeur_id'])
                ->where('materiel_id', $validated['materiel_id'])
                ->exists();

            if ($existe) {
                return back()->with('error', 'Ce matériel est déjà attribué à cet enseignant.');
            }

            $validated['uid'] = Str::uuid();
            $validated['date_attribution'] = $validated['date_attribution'] ?? now();

            InventaireEnseignant::create($validated);

            DB::commit();

            return redirect()->route('inventaires-enseignants.index')
                ->with('success', 'Inventaire enseignant ajouté avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la création de l\'inventaire: ' . $e->getMessage());
        }
    }

    public function edit(InventaireEnseignant $inventaireEnseignant)
    {
        return Inertia::render('Inventaires/Enseignants/Edit', [
            'inventaire' => $inventaireEnseignant->load(['professeur', 'materiel']),
            'professeurs' => Professeur::orderBy('prenom')->get(['id', 'prenom', 'nom']),
            'materiels' => Materiel::orderBy('nom')->get(['id', 'nom']),
        ]);
    }

    public function update(Request $request, InventaireEnseignant $inventaireEnseignant)
    {
        $validated = $request->validate([
            'professeur_id' => 'required|exists:professeurs,id',
            'materiel_id' => 'required|exists:materiels,id',
            'quantite' => 'required|integer|min:1|max:1000',
            'etat' => 'required|in:bon,endommagé,perdu',
            'date_attribution' => 'nullable|date',
            'date_retour' => 'nullable|date|after_or_equal:date_attribution',
            'observation' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            // Vérifier si l'association existe déjà (pour un autre enregistrement)
            $existe = InventaireEnseignant::where('professeur_id', $validated['professeur_id'])
                ->where('materiel_id', $validated['materiel_id'])
                ->where('id', '!=', $inventaireEnseignant->id)
                ->exists();

            if ($existe) {
                return back()->with('error', 'Ce matériel est déjà attribué à cet enseignant.');
            }

            $inventaireEnseignant->update($validated);

            DB::commit();

            return redirect()->route('inventaires-enseignants.index')
                ->with('success', 'Inventaire enseignant mis à jour avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la mise à jour de l\'inventaire: ' . $e->getMessage());
        }
    }

    public function destroy( $id)
    {
        DB::beginTransaction();
        try {
            $inventaireEnseignant = InventaireEnseignant::findOrFail($id);
            $inventaireEnseignant->delete();

            DB::commit();

            return redirect()->route('inventaires-enseignants.index')
                ->with('success', 'Élément d\'inventaire supprimé avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la suppression: ' . $e->getMessage());
        }
    }
}
