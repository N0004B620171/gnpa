<?php

namespace App\Http\Controllers;

use App\Models\Materiel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class MaterielController extends Controller
{
    public function index(Request $request)
    {
        $query = Materiel::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('nom', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        $perPage = $request->get('perPage', 10);
        $materiels = $query->orderBy('nom')->paginate($perPage);

        return Inertia::render('Materiels/Index', [
            'materiels' => $materiels,
            'filters' => [
                'search' => $request->search,
                'perPage' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Materiels/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:materiels,nom',
            'reference' => 'nullable|string|max:255|unique:materiels,reference',
            'description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $validated['uid'] = Str::uuid();
            Materiel::create($validated);
            
            DB::commit();

            return redirect()->route('materiels.index')
                ->with('success', 'Matériel ajouté avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la création du matériel: ' . $e->getMessage());
        }
    }

    public function edit(Materiel $materiel)
    {
        return Inertia::render('Materiels/Edit', [
            'materiel' => $materiel
        ]);
    }

    public function update(Request $request, Materiel $materiel)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:materiels,nom,' . $materiel->id,
            'reference' => 'nullable|string|max:255|unique:materiels,reference,' . $materiel->id,
            'description' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $materiel->update($validated);
            
            DB::commit();

            return redirect()->route('materiels.index')
                ->with('success', 'Matériel mis à jour avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la mise à jour du matériel: ' . $e->getMessage());
        }
    }

    public function destroy(Materiel $materiel)
    {
        DB::beginTransaction();
        try {
            // Vérifier si le matériel est utilisé dans les inventaires
            if ($materiel->inventaireClasses()->exists() || $materiel->inventaireEnseignants()->exists()) {
                return back()->with('error', 'Impossible de supprimer ce matériel car il est utilisé dans des inventaires.');
            }

            $materiel->delete();
            
            DB::commit();

            return redirect()->route('materiels.index')
                ->with('success', 'Matériel supprimé avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la suppression du matériel: ' . $e->getMessage());
        }
    }
}