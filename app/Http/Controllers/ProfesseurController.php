<?php

namespace App\Http\Controllers;

use App\Models\Professeur;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProfesseurController extends Controller
{
    public function index(Request $request)
    {
        $query = Professeur::with(['user', 'classes.niveau', 'matieres']);

        // Recherche
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('prenom', 'LIKE', "%{$search}%")
                    ->orWhere('nom', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('specialite', 'LIKE', "%{$search}%");
            });
        }

        $perPage = $request->get('perPage', 10);
        $professeurs = $query->paginate($perPage);

        return Inertia::render('Professeurs/Index', [
            'professeurs' => $professeurs,
            'filters' => [
                'search' => $request->search,
                'perPage' => $perPage
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Professeurs/Create');
    }

    public function store(Request $request)
    {
        $validationRules = [
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:professeurs,email',
            'specialite' => 'nullable|string|max:255',
            'creer_compte' => 'boolean',
        ];

        // Ajouter la validation du password seulement si creer_compte est true
        if ($request->boolean('creer_compte')) {
            $validationRules['password'] = 'required|min:8';
        }

        $request->validate($validationRules);

        DB::beginTransaction();
        try {
            $professeur = Professeur::create($request->only([
                'prenom',
                'nom',
                'email',
                'telephone',
                'specialite'
            ]));

            if ($request->boolean('creer_compte')) {
                User::create([
                    'name' => $request->prenom . ' ' . $request->nom,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'userable_id' => $professeur->id,
                    'userable_type' => Professeur::class
                ]);
            }

            DB::commit();

            return redirect()->route('professeurs.index')
                ->with('success', 'Professeur créé avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur lors de la création: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function show(Professeur $professeur)
    {
        return Inertia::render('Professeurs/Show', [
            'professeur' => $professeur->load([
                'user',
                'classes.niveau.cycle',
                'matieres.niveau'
            ])
        ]);
    }

    public function edit(Professeur $professeur)
    {
        return Inertia::render('Professeurs/Edit', [
            'professeur' => $professeur
        ]);
    }

    public function update(Request $request, Professeur $professeur)
    {
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:professeurs,email,' . $professeur->id,
            'specialite' => 'nullable|string|max:255'
        ]);

        $professeur->update($request->all());

        if ($professeur->user && $request->has('email')) {
            $professeur->user->update(['email' => $request->email]);
        }

        return redirect()->route('professeurs.index')
            ->with('success', 'Professeur mis à jour avec succès');
    }

    public function destroy(Professeur $professeur)
    {
        if ($professeur->classes()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer ce professeur car il est responsable de classes');
        }

        if ($professeur->user) {
            $professeur->user->delete();
        }

        $professeur->delete();

        return redirect()->route('professeurs.index')
            ->with('success', 'Professeur supprimé avec succès');
    }
}
