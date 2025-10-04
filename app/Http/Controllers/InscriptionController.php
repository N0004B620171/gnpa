<?php

namespace App\Http\Controllers;

use App\Models\Inscription;
use Illuminate\Http\Request;

class InscriptionController extends Controller
{
    public function index()
    {
        return Inscription::with('eleve', 'classe.niveau', 'anneeScolaire')->paginate(20);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'classe_id' => 'required|exists:classes,id',
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
        ]);

        return Inscription::create($validated);
    }

    public function destroy(Inscription $inscription)
    {
        $inscription->delete();
        return response()->json(['message' => 'Inscription supprimée']);
    }
}
