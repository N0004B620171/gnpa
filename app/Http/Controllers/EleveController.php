<?php
namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\ParentEleve;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EleveController extends Controller
{
    public function index()
    {
        return Eleve::with('parentEleve', 'inscriptions')->paginate(20);
    }

    public function storeWithParent(Request $request)
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:parent_eleves,id',
            'parent.prenom' => 'required_without:parent_id|string|max:255',
            'parent.nom' => 'required_without:parent_id|string|max:255',
            'parent.telephone' => 'nullable|string|max:20',
            'parent.email' => 'nullable|email|unique:parent_eleves,email',
            'eleve.prenom' => 'required|string|max:255',
            'eleve.nom' => 'required|string|max:255',
            'eleve.date_naissance' => 'nullable|date',
            'eleve.sexe' => 'nullable|in:M,F',
        ]);

        return DB::transaction(function () use ($validated) {
            $parent = !empty($validated['parent_id'])
                ? ParentEleve::findOrFail($validated['parent_id'])
                : ParentEleve::create($validated['parent']);

            $eleve = Eleve::create(array_merge($validated['eleve'], [
                'parent_eleve_id' => $parent->id
            ]));

            return $eleve->load('parentEleve');
        });
    }

    public function show(Eleve $eleve)
    {
        return $eleve->load('parentEleve', 'inscriptions.classe');
    }

    public function update(Request $request, Eleve $eleve)
    {
        $validated = $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'date_naissance' => 'nullable|date',
            'sexe' => 'nullable|in:M,F',
        ]);

        $eleve->update($validated);
        return $eleve;
    }

    public function destroy(Eleve $eleve)
    {
        $eleve->delete();
        return response()->json(['message' => 'Élève supprimé']);
    }
}
