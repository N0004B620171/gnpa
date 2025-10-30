<?php

namespace App\Http\Controllers;

use App\Models\InventaireClasse;
use App\Models\Classe;
use App\Models\Materiel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class InventaireClasseController extends Controller
{
    public function index(Request $request)
    {
        $query = InventaireClasse::with(['classe.niveau', 'materiel']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('materiel', fn($q) => $q->where('nom', 'like', "%{$search}%"))
                  ->orWhereHas('classe', fn($q) => $q->where('nom', 'like', "%{$search}%"));
        }

        $perPage = $request->get('perPage', 10);
        $inventaires = $query->orderByDesc('created_at')->paginate($perPage);

        return Inertia::render('InventaireClasse/Index', [
            'inventaires' => $inventaires,
            'filters' => [
                'search' => $request->search,
                'perPage' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('InventaireClasse/Create', [
            'classes' => Classe::with('niveau')->orderBy('nom')->get(['id', 'nom', 'niveau_id']),
            'materiels' => Materiel::orderBy('nom')->get(['id', 'nom']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'materiel_id' => 'required|exists:materiels,id',
            'quantite' => 'required|integer|min:1|max:1000',
            'etat' => 'required|in:bon,endommagé,perdu',
            'observation' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            // Vérifier si l'association existe déjà
            $existe = InventaireClasse::where('classe_id', $validated['classe_id'])
                ->where('materiel_id', $validated['materiel_id'])
                ->exists();

            if ($existe) {
                return back()->with('error', 'Ce matériel est déjà attribué à cette classe.');
            }

            $validated['uid'] = Str::uuid();
            $validated['date_ajout'] = now();

            InventaireClasse::create($validated);
            
            DB::commit();

            return redirect()->route('inventaires-classes.index')
                ->with('success', 'Inventaire de classe créé avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la création de l\'inventaire: ' . $e->getMessage());
        }
    }

    public function edit(InventaireClasse $inventaireClasse)
    {
        return Inertia::render('Inventaires/Classes/Edit', [
            'inventaire' => $inventaireClasse->load(['classe.niveau', 'materiel']),
            'classes' => Classe::with('niveau')->orderBy('nom')->get(['id', 'nom', 'niveau_id']),
            'materiels' => Materiel::orderBy('nom')->get(['id', 'nom']),
        ]);
    }

    public function update(Request $request, InventaireClasse $inventaireClasse)
    {
        $validated = $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'materiel_id' => 'required|exists:materiels,id',
            'quantite' => 'required|integer|min:1|max:1000',
            'etat' => 'required|in:bon,endommagé,perdu',
            'observation' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            // Vérifier si l'association existe déjà (pour un autre enregistrement)
            $existe = InventaireClasse::where('classe_id', $validated['classe_id'])
                ->where('materiel_id', $validated['materiel_id'])
                ->where('id', '!=', $inventaireClasse->id)
                ->exists();

            if ($existe) {
                return back()->with('error', 'Ce matériel est déjà attribué à cette classe.');
            }

            $inventaireClasse->update($validated);
            
            DB::commit();

            return redirect()->route('inventaires-classes.index')
                ->with('success', 'Inventaire mis à jour avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la mise à jour de l\'inventaire: ' . $e->getMessage());
        }
    }

    public function destroy(InventaireClasse $inventaireClasse)
    {
        DB::beginTransaction();
        try {
            $inventaireClasse->delete();
            
            DB::commit();

            return redirect()->route('inventaires-classes.index')
                ->with('success', 'Élément d\'inventaire supprimé avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la suppression: ' . $e->getMessage());
        }
    }
}