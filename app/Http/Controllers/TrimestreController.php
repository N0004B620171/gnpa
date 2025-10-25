<?php

namespace App\Http\Controllers;

use App\Models\Trimestre;
use App\Models\AnneeScolaire;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrimestreController extends Controller
{
    public function index(Request $request)
    {
        $query = Trimestre::with(['anneeScolaire', 'compositions']);

        if ($request->has('q')) {
            $q = $request->get('q');
            $query->where('nom', 'like', "%$q%")
                  ->orWhereHas('anneeScolaire', function($query) use ($q) {
                      $query->where('nom', 'like', "%$q%");
                  });
        }

        $trimestres = $query->withCount('compositions')->latest()->paginate(15);

        return Inertia::render('Trimestres/Index', [
            'trimestres' => $trimestres,
            'anneeScolaires' => AnneeScolaire::orderBy('nom', 'desc')->get(),
            'filters' => $request->only('q')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
            'numero' => 'required|integer|between:1,3',
            'nom' => 'required|string|max:50',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'bareme' => 'required|numeric|min:1|max:100'
        ]);

        // Vérifier l'unicité du numéro de trimestre pour l'année scolaire
        $exists = Trimestre::where('annee_scolaire_id', $validated['annee_scolaire_id'])
            ->where('numero', $validated['numero'])
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Un trimestre avec ce numéro existe déjà pour cette année scolaire.');
        }

        Trimestre::create($validated);
        return redirect()->back()->with('success', 'Trimestre ajouté avec succès.');
    }

    public function update(Request $request, Trimestre $trimestre)
    {
        $validated = $request->validate([
            'numero' => 'required|integer|between:1,3',
            'nom' => 'required|string|max:50',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'bareme' => 'required|numeric|min:1|max:100'
        ]);

        // Vérifier l'unicité du numéro de trimestre pour l'année scolaire (sauf pour ce trimestre)
        $exists = Trimestre::where('annee_scolaire_id', $trimestre->annee_scolaire_id)
            ->where('numero', $validated['numero'])
            ->where('id', '!=', $trimestre->id)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Un trimestre avec ce numéro existe déjà pour cette année scolaire.');
        }

        $trimestre->update($validated);
        return redirect()->back()->with('success', 'Trimestre mis à jour avec succès.');
    }

    public function destroy(Trimestre $trimestre)
    {
        // Vérifier s'il y a des compositions associées
        if ($trimestre->compositions()->exists()) {
            return redirect()->back()->with('error', 'Impossible de supprimer ce trimestre car il contient des compositions.');
        }

        $trimestre->delete();
        return redirect()->back()->with('success', 'Trimestre supprimé avec succès.');
    }
}