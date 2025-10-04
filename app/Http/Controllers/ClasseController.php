<?php
namespace App\Http\Controllers;

use App\Models\Classe;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    public function index()
    {
        return Classe::with('niveau', 'professeur')->paginate(20);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'niveau_id' => 'required|exists:niveaux,id',
            'professeur_id' => 'nullable|exists:professeurs,id'
        ]);

        return Classe::create($validated);
    }

    public function show(Classe $classe)
    {
        return $classe->load('niveau', 'professeur', 'inscriptions.eleve');
    }

    public function update(Request $request, Classe $classe)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'niveau_id' => 'required|exists:niveaux,id',
            'professeur_id' => 'nullable|exists:professeurs,id'
        ]);

        $classe->update($validated);
        return $classe;
    }

    public function destroy(Classe $classe)
    {
        $classe->delete();
        return response()->json(['message' => 'Classe supprimée']);
    }
}
