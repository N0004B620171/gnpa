<?php

namespace App\Http\Controllers;

use App\Models\Professeur;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfesseurController extends Controller
{
    public function index()
    {
        $professeurs = Professeur::with(['user'])->latest()->paginate(10);

        return Inertia::render('Professeurs/Index', [
            'professeurs' => $professeurs
        ]);
    }

    public function create()
    {
        return Inertia::render('Professeurs/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'prenom' => 'required|string',
            'nom' => 'required|string',
            'telephone' => 'nullable|string',
            'email' => 'required|email|unique:professeurs,email',
            'specialite' => 'nullable|string',
        ]);

        $professeur = Professeur::create($data);
        // Créer un User associé
        $professeur->user()->create([
            'name' => $data['prenom'] . ' ' . $data['nom'],
            'email' => $data['email'],
            'password' => bcrypt('password123'),
        ]);

        return redirect()->route('professeurs.index')
            ->with('success', 'Professeur créé avec succès.');
    }

    public function show(Professeur $professeur)
    {
        $professeur->load('user');

        return Inertia::render('Professeurs/Show', [
            'professeur' => $professeur
        ]);
    }

    public function edit(Professeur $professeur)
    {
        $professeur->load('user');

        return Inertia::render('Professeurs/Edit', [
            'professeur' => $professeur
        ]);
    }

    public function update(Request $request, Professeur $professeur)
    {
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:255',
            'email' => 'required|email|unique:professeurs,email,' . $professeur->id,
            'specialite' => 'nullable|string|max:255',
            'user_id' => 'required|integer|exists:users,id'
        ]);

        $professeur->update($request->all());

        return redirect()->route('professeurs.index')
            ->with('success', 'Professeur modifié avec succès.');
    }

    public function destroy(Professeur $professeur)
    {
        $professeur->delete();

        return redirect()->route('professeurs.index')
            ->with('success', 'Professeur supprimé avec succès.');
    }
}
