<?php
namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    public function storeMultiple(Request $request)
    {
        $validated = $request->validate([
            'inscription_id' => 'required|exists:inscriptions,id',
            'composition_id' => 'required|exists:compositions,id',
            'notes' => 'required|array',
            'notes.*.matiere_id' => 'required|exists:matieres,id',
            'notes.*.note' => 'required|numeric|min:0',
            'notes.*.sur' => 'required|numeric|min:1',
            'notes.*.appreciation' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($validated) {
            $saved = [];
            foreach ($validated['notes'] as $n) {
                $saved[] = Note::updateOrCreate(
                    [
                        'inscription_id' => $validated['inscription_id'],
                        'composition_id' => $validated['composition_id'],
                        'matiere_id' => $n['matiere_id'],
                    ],
                    [
                        'note' => $n['note'],
                        'sur' => $n['sur'],
                        'appreciation' => $n['appreciation'] ?? null,
                    ]
                );
            }
            return $saved;
        });
    }
}
