<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\ParentEleve;
use App\Models\Inscription;
use App\Models\Classe;
use App\Models\AnneeScolaire;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Events\InscriptionCreated;
use Illuminate\Support\Facades\Log;

class EleveController extends Controller
{
    public function index(Request $request)
    {
        $query = Eleve::with(['parentEleve', 'inscriptions.classe.niveau.cycle']);

        // 🔍 Recherche globale
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('prenom', 'LIKE', "%{$search}%")
                    ->orWhere('nom', 'LIKE', "%{$search}%")
                    ->orWhereHas('parentEleve', function ($sub) use ($search) {
                        $sub->where('prenom', 'LIKE', "%{$search}%")
                            ->orWhere('nom', 'LIKE', "%{$search}%");
                    });
            });
        }

        // Filtrage
        if ($request->filled('classe_id')) {
            $query->whereHas(
                'inscriptions',
                fn($q) =>
                $q->where('classe_id', $request->classe_id)
                    ->where('statut', 'actif')
            );
        }

        if ($request->filled('statut')) {
            if ($request->statut === 'avec_parent') $query->whereNotNull('parent_eleve_id');
            elseif ($request->statut === 'sans_parent') $query->whereNull('parent_eleve_id');
        }

        $eleves = $query->paginate($request->get('perPage', 10));
        $eleves->getCollection()->transform(function ($eleve) {
            $eleve->created_at_formatted = $eleve->created_at->format('d/m/Y');
            if ($eleve->date_naissance) {
                $eleve->date_naissance_formatted = Carbon::parse($eleve->date_naissance)->format('d/m/Y');
                $eleve->age = Carbon::parse($eleve->date_naissance)->age;
            }
            return $eleve;
        });

        return Inertia::render('Eleves/Index', [
            'eleves' => $eleves,
            'classes' => Classe::with('niveau')->get(),
            'filters' => [
                'search' => $request->search,
                'classe_id' => $request->classe_id,
                'statut' => $request->statut,
                'perPage' => $request->get('perPage', 10)
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Eleves/Create', [
            'parents' => ParentEleve::select('id', 'prenom', 'nom')->get(),
            'classes' => Classe::with('niveau.cycle.langues')->get(),
            'anneesScolaires' => AnneeScolaire::where('actif', true)->get()
        ]);
    }

    public function store(Request $request)
    {
        // 🔒 Validation dynamique
        $rules = [
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'date_naissance' => 'nullable|date',
            'sexe' => 'nullable|in:M,F',
            'photo' => 'nullable|string',
            'parent_eleve_id' => 'nullable|exists:parent_eleves,id',
            'nouveau_parent' => 'boolean',
            'inscrire_maintenant' => 'boolean',
        ];

        // Nouveau parent ?
        if ($request->boolean('nouveau_parent')) {
            $rules['parent_prenom'] = 'required|string|max:255';
            $rules['parent_nom'] = 'required|string|max:255';
            $rules['parent_email'] = 'nullable|email|unique:parent_eleves,email';
            $rules['parent_telephone'] = 'nullable|string|max:20';
            $rules['parent_adresse'] = 'nullable|string';
        }

        // Inscription immédiate ?
        if ($request->boolean('inscrire_maintenant')) {
            $rules['classe_id'] = 'required|exists:classes,id';
            $rules['annee_scolaire_id'] = 'required|exists:annee_scolaires,id';
        }

        $request->validate($rules);

        DB::beginTransaction();
        try {
            // Créer ou récupérer le parent
            $parentId = $request->parent_eleve_id;
            if ($request->boolean('nouveau_parent') && !$parentId) {
                $parent = ParentEleve::create([
                    'prenom' => $request->parent_prenom,
                    'nom' => $request->parent_nom,
                    'telephone' => $request->parent_telephone,
                    'email' => $request->parent_email,
                    'adresse' => $request->parent_adresse,
                    'creer_compte' => false
                ]);
                $parentId = $parent->id;
            }

            // Créer l’élève
            $eleve = Eleve::create([
                'prenom' => $request->prenom,
                'nom' => $request->nom,
                'date_naissance' => $request->date_naissance,
                'sexe' => $request->sexe,
                'photo' => $request->photo,
                'parent_eleve_id' => $parentId
            ]);

            // Inscrire immédiatement ?
            if ($request->boolean('inscrire_maintenant')) {
                Inscription::where('eleve_id', $eleve->id)
                    ->where('annee_scolaire_id', $request->annee_scolaire_id)
                    ->update(['statut' => 'inactif']);

                $inscription = Inscription::create([
                    'uid' => Str::uuid(),
                    'eleve_id' => $eleve->id,
                    'classe_id' => $request->classe_id,
                    'annee_scolaire_id' => $request->annee_scolaire_id,
                    'statut' => 'actif',
                    'date_inscription' => now()
                ]);
            }

            DB::commit();

            $msg = '✅ Élève créé avec succès';
            if ($request->boolean('inscrire_maintenant')) $msg .= ' et inscrit avec génération des bulletins';
            if ($request->boolean('nouveau_parent')) $msg .= ' - Nouveau parent créé';

            return redirect()->route('eleves.index')->with('success', $msg);
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la création : ' . $e->getMessage())->withInput();
        }
    }

    public function show(Eleve $eleve)
    {
        if ($eleve->date_naissance) {
            $eleve->date_naissance_formatted = Carbon::parse($eleve->date_naissance)->format('d/m/Y');
            $eleve->age = Carbon::parse($eleve->date_naissance)->age;
        }
        $eleve->created_at_formatted = $eleve->created_at->format('d/m/Y à H:i');

        $eleve->load([
            'parentEleve',
            'inscriptions.classe.niveau.cycle.langues',
            'notes.composition.trimestre',
            'bulletins.trimestre'
        ]);

        return Inertia::render('Eleves/Show', ['eleve' => $eleve]);
    }

    public function edit(Eleve $eleve)
    {
        return Inertia::render('Eleves/Edit', [
            'eleve' => $eleve->load('parentEleve'),
            'parents' => ParentEleve::select('id', 'prenom', 'nom')->get()
        ]);
    }

    public function update(Request $request, Eleve $eleve)
    {
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'date_naissance' => 'nullable|date',
            'sexe' => 'nullable|in:M,F',
            'photo' => 'nullable|string',
            'parent_eleve_id' => 'nullable|exists:parent_eleves,id'
        ]);

        $eleve->update($request->all());

        return redirect()->route('eleves.index')->with('success', 'Élève mis à jour avec succès');
    }

    public function destroy(Eleve $eleve)
    {
        DB::beginTransaction();
        try {
            // Vérifier s'il y a des inscriptions actives
            $inscriptionsActives = $eleve->inscriptions()->where('statut', 'actif')->count();

            if ($inscriptionsActives > 0) {
                return redirect()->back()
                    ->with('error', "Impossible de supprimer cet élève car il a {$inscriptionsActives} inscription(s) active(s). Veuillez d'abord désactiver les inscriptions.");
            }

            // Vérifier les relations qui pourraient bloquer la suppression
            $hasNotes = $eleve->notes()->exists();
            $hasBulletins = $eleve->bulletins()->exists();

            if ($hasNotes || $hasBulletins) {
                // Si vous voulez supprimer cascade, décommentez ces lignes :
                // $eleve->notes()->delete();
                // $eleve->bulletins()->delete();

                return redirect()->back()
                    ->with('error', "Impossible de supprimer cet élève car il a des notes ou bulletins associés. Suppression en cascade non autorisée.");
            }

            $eleveName = "{$eleve->prenom} {$eleve->nom}";

            // Supprimer les inscriptions (même inactives)
            $eleve->inscriptions()->delete();

            // Supprimer l'élève
            $eleve->delete();

            DB::commit();

            return redirect()->route('eleves.index')
                ->with('success', "L'élève \"{$eleveName}\" a été supprimé avec succès");
        } catch (\Exception $e) {
            DB::rollBack();

            // Log l'erreur pour debug
            Log::error('Erreur suppression élève: ' . $e->getMessage(), [
                'eleve_id' => $eleve->id,
                'fichier' => $e->getFile(),
                'ligne' => $e->getLine()
            ]);

            return redirect()->back()
                ->with('error', 'Erreur lors de la suppression: ' . $e->getMessage());
        }
    }

    public function inscrire(Request $request, Eleve $eleve)
    {
        $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id'
        ]);

        DB::beginTransaction();
        try {
            $eleve->inscriptions()
                ->where('annee_scolaire_id', $request->annee_scolaire_id)
                ->update(['statut' => 'inactif']);

            $inscription = Inscription::create([
                'uid' => Str::uuid(),
                'eleve_id' => $eleve->id,
                'classe_id' => $request->classe_id,
                'annee_scolaire_id' => $request->annee_scolaire_id,
                'statut' => 'actif',
                'date_inscription' => now()
            ]);


            DB::commit();

            return back()->with('success', 'Élève inscrit et bulletins générés avec succès.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de l\'inscription : ' . $e->getMessage());
        }
    }
}
