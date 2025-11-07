<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Inscription;
use App\Models\Composition;
use App\Models\Classe;
use App\Models\Matiere;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $query = Note::with([
            'inscription.eleve',
            'composition.trimestre.anneeScolaire',
            'composition.classe.niveau',
            'matiere'
        ]);

        // Filtres avancés
        if ($request->has('classe_id') && $request->classe_id != '') {
            $query->whereHas('inscription', function ($q) use ($request) {
                $q->where('classe_id', $request->classe_id);
            });
        }

        if ($request->has('matiere_id') && $request->matiere_id != '') {
            $query->where('matiere_id', $request->matiere_id);
        }

        if ($request->has('trimestre_id') && $request->trimestre_id != '') {
            $query->whereHas('composition', function ($q) use ($request) {
                $q->where('trimestre_id', $request->trimestre_id);
            });
        }

        // Recherche par élève
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('inscription.eleve', function ($q) use ($search) {
                $q->where('prenom', 'LIKE', "%{$search}%")
                    ->orWhere('nom', 'LIKE', "%{$search}%");
            });
        }

        $perPage = $request->get('perPage', 10);
        $notes = $query->latest()->paginate($perPage);

        return Inertia::render('Notes/Index', [
            'notes' => $notes,
            'classes' => Classe::with('niveau')->get(),
            'matieres' => Matiere::all(),
            'trimestres' => Trimestre::with('anneeScolaire')->get(),
            'filters' => [
                'search' => $request->search,
                'classe_id' => $request->classe_id,
                'matiere_id' => $request->matiere_id,
                'trimestre_id' => $request->trimestre_id,
                'perPage' => $perPage
            ]
        ]);
    }

    public function create()
    {
        $compositions = Composition::with([
            'trimestre.anneeScolaire',
            'classe.niveau',
            'matieres',
            'classe.inscriptions.eleve'
        ])->whereHas('classe.inscriptions')->get();

        return Inertia::render('Notes/Create', [
            'compositions' => $compositions,
            'classes' => Classe::with(['niveau', 'inscriptions.eleve'])->get()
        ]);
    }

    public function createMultiple()
    {
        $compositions = Composition::with([
            'trimestre.anneeScolaire',
            'classe.niveau',
            'matieres',
            'classe.inscriptions.eleve'
        ])->whereHas('classe.inscriptions')->get();

        return Inertia::render('Notes/CreateMultiple', [
            'compositions' => $compositions,
            'classes' => Classe::with(['niveau', 'inscriptions.eleve'])->get()
        ]);
    }

    public function getCompositionData($compositionId, Request $request)
    {
        $matiereId = $request->get('matiere_id');

        $composition = Composition::with([
            'classe.inscriptions.eleve.parentEleve',
            'matieres',
            'trimestre.anneeScolaire',
            'notes' => function ($query) use ($matiereId) {
                if ($matiereId) {
                    $query->where('matiere_id', $matiereId);
                }
            }
        ])->findOrFail($compositionId);

        // Récupérer les notes existantes
        $existingNotesQuery = Note::where('composition_id', $composition->id);
        if ($matiereId) {
            $existingNotesQuery->where('matiere_id', $matiereId);
        }

        $existingNotes = $existingNotesQuery->get()
            ->groupBy(['inscription_id', 'matiere_id'])
            ->toArray();

        return response()->json([
            'composition' => $composition,
            'existingNotes' => $existingNotes,
            'totalEleves' => $composition->classe->inscriptions->count()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'inscription_id' => 'required|exists:inscriptions,id',
            'composition_id' => 'required|exists:compositions,id',
            'matiere_id' => 'required|exists:matieres,id',
            'note' => 'required|numeric|min:0',
            'sur' => 'required|numeric|min:1',
            'appreciation' => 'nullable|string|max:500'
        ]);

        // Vérifier si la note existe déjà
        $existingNote = Note::where([
            'inscription_id' => $request->inscription_id,
            'composition_id' => $request->composition_id,
            'matiere_id' => $request->matiere_id
        ])->first();

        if ($existingNote) {
            return redirect()->back()
                ->with('error', 'Une note existe déjà pour cet élève, cette composition et cette matière.');
        }

        Note::create($request->all());

        return redirect()->route('notes.index')
            ->with('success', 'Note créée avec succès');
    }

    public function storeMultiple(Request $request)
    {
        $request->validate([
            'composition_id' => 'required|exists:compositions,id',
            'matiere_id' => 'required|exists:matieres,id',
            'sur' => 'required|numeric|min:1', // Validation globale
            'notes' => 'required|array',
            'notes.*.inscription_id' => 'required|exists:inscriptions,id',
            'notes.*.note' => 'required|numeric|min:0',
            'notes.*.appreciation' => 'nullable|string|max:500'
        ]);

        $composition = Composition::find($request->composition_id);

        if (!$composition->matieres->contains($request->matiere_id)) {
            return redirect()->back()
                ->with('error', 'Cette matière n\'est pas incluse dans la composition');
        }

        DB::beginTransaction();
        try {
            $count = 0;
            $updated = 0;
            $created = 0;

            foreach ($request->notes as $noteData) {
                $inscription = Inscription::find($noteData['inscription_id']);
                if ($inscription->classe_id !== $composition->classe_id) {
                    continue;
                }

                // Utiliser le sur global
                if ($noteData['note'] > $request->sur) {
                    continue;
                }

                $existingNote = Note::where([
                    'inscription_id' => $noteData['inscription_id'],
                    'composition_id' => $request->composition_id,
                    'matiere_id' => $request->matiere_id
                ])->first();

                if ($existingNote) {
                    $existingNote->update([
                        'note' => $noteData['note'],
                        'sur' => $request->sur, // Utiliser le sur global
                        'appreciation' => $noteData['appreciation'] ?? null
                    ]);
                    $updated++;
                } else {
                    Note::create([
                        'inscription_id' => $noteData['inscription_id'],
                        'composition_id' => $request->composition_id,
                        'matiere_id' => $request->matiere_id,
                        'note' => $noteData['note'],
                        'sur' => $request->sur, // Utiliser le sur global
                        'appreciation' => $noteData['appreciation'] ?? null
                    ]);
                    $created++;
                }
                $count++;
            }

            DB::commit();

            return redirect()->route('notes.index')
                ->with('success', "{$count} notes traitées avec succès ({$created} créées, {$updated} mises à jour)");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur lors de l\'enregistrement: ' . $e->getMessage());
        }
    }

    public function show(Note $note)
    {
        $note->load([
            'inscription.eleve.parentEleve',
            'composition.trimestre.anneeScolaire',
            'composition.classe.niveau',
            'matiere'
        ]);

        return Inertia::render('Notes/Show', [
            'note' => $note
        ]);
    }

    public function edit(Note $note)
    {
        $note->load([
            'inscription.eleve',
            'composition.trimestre.anneeScolaire',
            'composition.classe.niveau',
            'matiere'
        ]);

        return Inertia::render('Notes/Edit', [
            'note' => $note,
            'compositions' => Composition::with(['trimestre.anneeScolaire', 'classe.niveau'])->get(),
            'matieres' => Matiere::all(),
            'inscriptions' => Inscription::with(['eleve', 'classe.niveau'])->get()
        ]);
    }

    public function update(Request $request, Note $note)
    {
        $request->validate([
            'inscription_id' => 'required|exists:inscriptions,id',
            'composition_id' => 'required|exists:compositions,id',
            'matiere_id' => 'required|exists:matieres,id',
            'note' => 'required|numeric|min:0',
            'sur' => 'required|numeric|min:1',
            'appreciation' => 'nullable|string|max:500'
        ]);

        $note->update($request->all());

        return redirect()->route('notes.show', $note)
            ->with('success', 'Note mise à jour avec succès');
    }

    public function destroy(Note $note)
    {
        $note->delete();

        return redirect()->route('notes.index')
            ->with('success', 'Note supprimée avec succès');
    }
}
