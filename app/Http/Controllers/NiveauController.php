<?php
namespace App\Http\Controllers;

use App\Models\Niveau;
use Illuminate\Http\Request;

class NiveauController extends Controller
{
    public function index()
    {
        return Niveau::with('cycle', 'classes', 'matieres')->paginate(20);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'cycle_id' => 'required|exists:cycles,id',
            'moyenne_min_pour_passage' => 'nullable|numeric|min:0|max:20'
        ]);

        return Niveau::create($validated);
    }

    public function show(Niveau $niveau)
    {
        return $niveau->load('cycle', 'classes', 'matieres');
    }

    public function update(Request $request, Niveau $niveau)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'cycle_id' => 'required|exists:cycles,id',
            'moyenne_min_pour_passage' => 'nullable|numeric|min:0|max:20'
        ]);

        $niveau->update($validated);
        return $niveau;
    }

    public function destroy(Niveau $niveau)
    {
        $niveau->delete();
        return response()->json(['message' => 'Niveau supprimé']);
    }
}
