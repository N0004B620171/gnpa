<?php

namespace App\Http\Controllers;

use App\Models\ParentEleve;
use Illuminate\Http\Request;

class ParentEleveController extends Controller
{
    public function index()
    {
        return ParentEleve::with('eleves')->paginate(20);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|unique:parent_eleves,email',
        ]);

        return ParentEleve::create($validated);
    }

    public function show(ParentEleve $parentEleve)
    {
        return $parentEleve->load('eleves');
    }

    public function update(Request $request, ParentEleve $parentEleve)
    {
        $validated = $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|unique:parent_eleves,email,' . $parentEleve->id,
        ]);

        $parentEleve->update($validated);
        return $parentEleve;
    }

    public function destroy(ParentEleve $parentEleve)
    {
        $parentEleve->delete();
        return response()->json(['message' => 'Parent supprimé']);
    }
}
