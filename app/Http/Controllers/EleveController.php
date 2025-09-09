<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EleveController extends Controller
{
    /**
     * Liste des élèves
     */
    public function index()
    {
        $eleves = Eleve::latest()->get();

        return Inertia::render('Eleves/Index', [
            'eleves' => $eleves
        ]);
    }

    public function show(Eleve $eleve)
    {
        return Inertia::render('Eleves/Show', [
            'eleve' => $eleve
        ]);
    }

    /**
     * Formulaire de création
     */
    public function create()
    {
        return Inertia::render('Eleves/Create');
    }

    /**
     * Sauvegarde d’un nouvel élève
     */
    public function store(Request $request)
    {
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'date_naissance' => 'nullable|date',
            'sexe' => 'nullable|in:M,F',
            'photo' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['prenom', 'nom', 'date_naissance', 'sexe']);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('eleves', 'public');
        }

        Eleve::create($data);

        return redirect()->route('eleves.index')->with('success', 'Élève créé avec succès.');
    }

    /**
     * Formulaire d’édition
     */
    public function edit(Eleve $eleve)
    {
        return Inertia::render('Eleves/Edit', [
            'eleve' => $eleve
        ]);
    }

    /**
     * Mise à jour d’un élève
     */
    public function update(Request $request, Eleve $eleve)
    {
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'date_naissance' => 'nullable|date',
            'sexe' => 'nullable|in:M,F',
            'photo' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['prenom', 'nom', 'date_naissance', 'sexe']);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('eleves', 'public');
        }

        $eleve->update($data);

        return redirect()->route('eleves.index')->with('success', 'Élève mis à jour avec succès.');
    }

    /**
     * Suppression
     */
    public function destroy(Eleve $eleve)
    {
        $eleve->delete();

        return redirect()->route('eleves.index')->with('success', 'Élève supprimé avec succès.');
    }
}
