<?php

namespace App\Http\Controllers;

use App\Models\ParentEleve;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParentEleveController extends Controller
{
    public function index()
    {
        $parentEleves = ParentEleve::latest()->paginate(10);

        return Inertia::render('ParentEleves/Index', [
            'parentEleves' => $parentEleves
        ]);
    }

    public function create()
    {
        return Inertia::render('ParentEleves/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:parent_eleves',
            'adresse' => 'nullable|string|max:500',
        ]);

        ParentEleve::create($request->all());

        return redirect()->route('parent-eleves.index')
            ->with('success', 'Parent d\'élève créé avec succès.');
    }

    public function show(ParentEleve $parentEleve)
    {
        return Inertia::render('ParentEleves/Show', [
            'parentEleve' => $parentEleve
        ]);
    }

    public function edit(ParentEleve $parentEleve)
    {
        return Inertia::render('ParentEleves/Edit', [
            'parentEleve' => $parentEleve
        ]);
    }

    public function update(Request $request, ParentEleve $parentEleve)
    {
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:parent_eleves,email,' . $parentEleve->id,
            'adresse' => 'nullable|string|max:500',
        ]);

        $parentEleve->update($request->all());

        return redirect()->route('parent-eleves.index')
            ->with('success', 'Parent d\'élève modifié avec succès.');
    }

    public function destroy(ParentEleve $parentEleve)
    {
        $parentEleve->delete();

        return redirect()->route('parent-eleves.index')
            ->with('success', 'Parent d\'élève supprimé avec succès.');
    }
}
