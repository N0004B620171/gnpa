<?php

namespace App\Http\Controllers;

use App\Models\Matiere;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MatiereController extends Controller
{
    public function index()
    {
        $matieres = Matiere::latest()->get();

        return Inertia::render('Matieres/Index', [
            'matieres' => $matieres,
        ]);
    }

    public function create()
    {
        return Inertia::render('Matieres/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'coefficient' => 'required|integer|min:1',
        ]);

        Matiere::create($data);

        return redirect()->route('matieres.index')->with('success', 'Matière créée.');
    }

    public function edit(Matiere $matiere)
    {
        return Inertia::render('Matieres/Edit', [
            'matiere' => $matiere
        ]);
    }

    public function update(Request $request, Matiere $matiere)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'coefficient' => 'required|integer|min:1',
        ]);

        $matiere->update($data);

        return redirect()->route('matieres.index')->with('success', 'Matière mise à jour.');
    }

    public function destroy(Matiere $matiere)
    {
        $matiere->delete();

        return redirect()->route('matieres.index')->with('success', 'Matière supprimée.');
    }
}
