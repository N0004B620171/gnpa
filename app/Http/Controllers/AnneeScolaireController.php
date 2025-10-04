<?php

namespace App\Http\Controllers;

use App\Models\AnneeScolaire;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnneeScolaireController extends Controller
{
    public function index()
    {
        $annees = AnneeScolaire::latest()->get();

        return Inertia::render('Annees/Index', [
            'annees' => $annees,
        ]);
    }

    public function create()
    {
        return Inertia::render('Annees/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|unique:annee_scolaires,nom',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'actif' => 'boolean'
        ]);

        // rendre inactive toutes les autres si actif est choisi
        if ($validated['actif'] ?? false) {
            AnneeScolaire::where('actif', true)->update(['actif' => false]);
        }

        AnneeScolaire::create($validated);

        return redirect()->route('annees.index')->with('success', 'Année scolaire créée.');
    }

    public function edit(AnneeScolaire $annee)
    {
        return Inertia::render('Annees/Edit', [
            'annee' => $annee
        ]);
    }

    public function update(Request $request, AnneeScolaire $annee)
    {
        $validated = $request->validate([
            'nom' => 'required|string|unique:annee_scolaires,nom,' . $annee->id,
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'actif' => 'boolean'
        ]);

        if ($validated['actif'] ?? false) {
            AnneeScolaire::where('id', '!=', $annee->id)->update(['actif' => false]);
        }

        $annee->update($validated);

        return redirect()->route('annees.index')->with('success', 'Année scolaire mise à jour.');
    }

    public function destroy(AnneeScolaire $annee)
    {
        $annee->delete();

        return redirect()->route('annees.index')->with('success', 'Année scolaire supprimée.');
    }
}
