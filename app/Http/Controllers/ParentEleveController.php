<?php

namespace App\Http\Controllers;

use App\Models\ParentEleve;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ParentEleveController extends Controller
{
    public function index(Request $request)
    {
        $query = ParentEleve::with(['eleves', 'user']);

        // Recherche intelligente
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('prenom', 'LIKE', "%{$search}%")
                    ->orWhere('nom', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('telephone', 'LIKE', "%{$search}%");
            });
        }

        // Pagination (10 par défaut, 20 si spécifié)
        $perPage = $request->get('perPage', 10);
        $parents = $query->paginate($perPage);

        return Inertia::render('ParentEleves/Index', [
            'parents' => $parents,
            'filters' => [
                'search' => $request->search,
                'perPage' => $perPage
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('ParentEleves/Create');
    }

    public function store(Request $request)
    {
        $validationRules = [
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:parent_eleves,email',
            'adresse' => 'nullable|string',
            'creer_compte' => 'boolean',
        ];

        if ($request->boolean('creer_compte')) {
            $validationRules['password'] = 'required|min:8';
        }

        $request->validate($validationRules);


        try {
            $parentData = $request->only(['prenom', 'nom', 'email', 'telephone', 'adresse', 'creer_compte']);
            $parent = ParentEleve::create($parentData);


            if ($request->boolean('creer_compte')) {
                $user = User::create([
                    'name' => $request->prenom . ' ' . $request->nom,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'userable_id' => $parent->id,
                    'userable_type' => ParentEleve::class
                ]);
            }

            return redirect()->route('parents.index')
                ->with('success', 'Parent créé avec succès');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la création du parent');
        }
    }

    public function show(ParentEleve $parent)
    {
        return Inertia::render('ParentEleves/Show', [
            'parent' => $parent->load(['eleves.inscriptions.classe.niveau', 'user'])
        ]);
    }

    public function edit(ParentEleve $parent)
    {
        return Inertia::render('ParentEleves/Edit', [
            'parent' => $parent
        ]);
    }

    public function update(Request $request, ParentEleve $parent)
    {
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:parent_eleves,email,' . $parent->id,
            'adresse' => 'nullable|string'
        ]);

        $parent->update($request->all());

        if ($parent->user && $request->has('email')) {
            $parent->user->update(['email' => $request->email]);
        }

        return redirect()->route('parents.index')
            ->with('success', 'Parent mis à jour avec succès');
    }

    public function destroy(ParentEleve $parent)
    {
        if ($parent->eleves()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer ce parent car il a des enfants associés');
        }

        if ($parent->user) {
            $parent->user->delete();
        }

        $parent->delete();

        return redirect()->route('parents.index')
            ->with('success', 'Parent supprimé avec succès');
    }   
}
