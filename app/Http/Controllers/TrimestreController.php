<?php

namespace App\Http\Controllers;

use App\Models\AnneeScolaire;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrimestreController extends Controller
{
    public function index()
    {
        $trimestres = Trimestre::with('anneeScolaire')->latest()->get();

        return Inertia::render('Trimestres/Index', [
            'trimestres' => $trimestres,
        ]);
    }

    public function create()
    {
        return Inertia::render('Trimestres/Create', [
            'annees' => AnneeScolaire::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
            'nom' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
        ]);

        Trimestre::create($validated);

        return redirect()->route('trimestres.index')->with('success', 'Trimestre ajouté.');
    }

    public function edit(Trimestre $trimestre)
    {
        return Inertia::render('Trimestres/Edit', [
            'trimestre' => $trimestre,
            'annees' => AnneeScolaire::all(),
        ]);
    }

    public function update(Request $request, Trimestre $trimestre)
    {
        $validated = $request->validate([
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
            'nom' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
        ]);

        $trimestre->update($validated);

        return redirect()->route('trimestres.index')->with('success', 'Trimestre mis à jour.');
    }

    public function destroy(Trimestre $trimestre)
    {
        $trimestre->delete();

        return redirect()->route('trimestres.index')->with('success', 'Trimestre supprimé.');
    }
}
