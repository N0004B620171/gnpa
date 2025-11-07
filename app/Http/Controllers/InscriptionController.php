<?php

namespace App\Http\Controllers;

use App\Models\Inscription;
use App\Models\Eleve;
use App\Models\Classe;
use App\Models\AnneeScolaire;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Events\InscriptionCreated;
use App\Helpers\ServiceCiblageHelper;
use App\Models\Niveau;
use App\Models\Service;
use App\Models\ServiceCiblage;

class InscriptionController extends Controller
{
    /**
     * 🧾 Liste paginée des inscriptions avec filtres et recherche
     */
    public function index(Request $request)
    {
        $query = Inscription::with(['eleve', 'classe.niveau.cycle', 'anneeScolaire'])
            ->orderByDesc('created_at');

        // 🔍 Recherche globale (élève, classe, année)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('eleve', function ($q) use ($search) {
                $q->where('prenom', 'like', "%{$search}%")
                    ->orWhere('nom', 'like', "%{$search}%");
            })
                ->orWhereHas('classe', fn($q) => $q->where('nom', 'like', "%{$search}%"))
                ->orWhereHas('anneeScolaire', fn($q) => $q->where('nom', 'like', "%{$search}%"));
        }

        // 🏫 Filtre par classe
        if ($request->filled('classe_id')) {
            $query->where('classe_id', $request->classe_id);
        }

        // 📊 Filtre par niveau
        if ($request->filled('niveau_id')) {
            $query->whereHas('classe', function ($q) use ($request) {
                $q->where('niveau_id', $request->niveau_id);
            });
        }

        // 📊 Pagination
        $perPage = $request->get('perPage', 10);
        $inscriptions = $query->paginate($perPage);

        return Inertia::render('Inscriptions/Index', [
            'inscriptions' => $inscriptions,
            'classes' => Classe::with('niveau')->orderBy('nom')->get(['id', 'nom', 'niveau_id']),
            'niveaux' => Niveau::with('cycle')->orderBy('nom')->get(['id', 'nom', 'cycle_id']),
            'filters' => [
                'search' => $request->search,
                'classe_id' => $request->classe_id,
                'niveau_id' => $request->niveau_id,
                'perPage' => $perPage,
            ],
        ]);
    }

    /**
     * 🧩 Formulaire de création
     */
    public function create()
    {
        return Inertia::render('Inscriptions/Create', [
            'eleves' => Eleve::orderBy('prenom')->get(['id', 'prenom', 'nom']),
            'classes' => Classe::with('niveau.cycle')->get(['id', 'nom', 'niveau_id']),
            'anneesScolaires' => AnneeScolaire::orderByDesc('date_debut')->get(['id', 'nom']),
        ]);
    }

    /**
     * 💾 Enregistre une nouvelle inscription et déclenche les événements nécessaires
     */
    public function store(Request $request)
    {
        $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'classe_id' => 'required|exists:classes,id',
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
            'date_inscription' => 'nullable|date',
            'statut' => 'nullable|in:actif,inactif',
        ]);

        DB::beginTransaction();
        try {
            // 🔒 Éviter les doublons : un élève = une seule inscription par année
            $existe = Inscription::where('eleve_id', $request->eleve_id)
                ->where('annee_scolaire_id', $request->annee_scolaire_id)
                ->exists();

            if ($existe) {
                return back()->with('error', 'Cet élève est déjà inscrit pour cette année scolaire.');
            }

            // 🔄 Désactivation des inscriptions précédentes (si doublon d'année)
            Inscription::where('eleve_id', $request->eleve_id)
                ->where('annee_scolaire_id', $request->annee_scolaire_id)
                ->update(['statut' => 'inactif']);

            // ✅ Création de l'inscription
            $inscription = Inscription::create([
                'uid' => Str::uuid(),
                'eleve_id' => $request->eleve_id,
                'classe_id' => $request->classe_id,
                'annee_scolaire_id' => $request->annee_scolaire_id,
                'date_inscription' => $request->date_inscription ?? now(),
                'statut' => $request->statut ?? 'actif',
            ]);
            DB::commit();

            return redirect()->route('inscriptions.index')
                ->with('success', 'Inscription ajoutée avec succès et bulletins générés automatiquement.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la création : ' . $e->getMessage());
        }
    }

    /**
     * 📄 Détail d'une inscription
     */
    public function show(Inscription $inscription)
    {
        // Charger les services ciblages existants pour cette inscription
        $serviceCiblages = ServiceCiblage::with(['service'])
            ->where('ciblable_type', 'App\\Models\\Inscription')
            ->where('ciblable_id', $inscription->id)
            ->get();

        // Charger tous les services disponibles
        $services = Service::where('actif', true)->get();

        return Inertia::render('Inscriptions/Show', [
            'inscription' => $inscription->load([
                'eleve.parentEleve',
                'classe.niveau.cycle',
                'anneeScolaire',
                'factures',
                'affectationTransport.itineraireTransport.bus',
                'affectationTransport.itineraireTransport.service',
                'affectationTransport.arret',
                'bulletins'
            ]),
            'serviceCiblages' => $serviceCiblages,
            'services' => $services,
        ]);
    }

    /**
     * 🔗 Associer un service à l'inscription
     */
    public function associerService(Request $request, Inscription $inscription)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);

        $resultat = ServiceCiblageHelper::associerService(
            $request->service_id,
            Inscription::class,
            $inscription->id
        );

        $status = $resultat['success'] ? 'success' : 'error';
        return back()->with($status, $resultat['message']);
    }

    /**
     * ❌ Dissocier un service de l’inscription
     */
    public function dissocierService(ServiceCiblage $serviceCiblage)
    {
        $resultat = ServiceCiblageHelper::dissocierService($serviceCiblage);

        $status = $resultat['success'] ? 'success' : 'error';
        return back()->with($status, $resultat['message']);
    }

    /**
     * ✏️ Formulaire d'édition
     */
    public function edit(Inscription $inscription)
    {
        return Inertia::render('Inscriptions/Edit', [
            'inscription' => $inscription->load(['eleve', 'classe', 'anneeScolaire']),
            'eleves' => Eleve::orderBy('prenom')->get(['id', 'prenom', 'nom']),
            'classes' => Classe::with('niveau.cycle')->get(['id', 'nom', 'niveau_id']),
            'anneesScolaires' => AnneeScolaire::orderByDesc('date_debut')->get(['id', 'nom']),
        ]);
    }

    /**
     * 🔁 Mise à jour d'une inscription existante
     */
    public function update(Request $request, Inscription $inscription)
    {
        $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'classe_id' => 'required|exists:classes,id',
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
            'date_inscription' => 'nullable|date',
            'statut' => 'nullable|in:actif,inactif',
        ]);

        DB::beginTransaction();
        try {
            $inscription->update($request->all());

            // Si le statut change en actif, désactiver les autres inscriptions de la même année
            if ($request->statut === 'actif') {
                Inscription::where('eleve_id', $inscription->eleve_id)
                    ->where('annee_scolaire_id', $inscription->annee_scolaire_id)
                    ->where('id', '!=', $inscription->id)
                    ->update(['statut' => 'inactif']);
            }

            DB::commit();

            return redirect()->route('inscriptions.index')
                ->with('success', 'Inscription mise à jour avec succès.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la mise à jour : ' . $e->getMessage());
        }
    }

    /**
     * 🗑️ Suppression d'une inscription
     */
    public function destroy(Inscription $inscription)
    {
        DB::beginTransaction();
        try {
            $inscription->delete();

            DB::commit();

            return redirect()->route('inscriptions.index')
                ->with('success', 'Inscription supprimée avec succès.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de la suppression : ' . $e->getMessage());
        }
    }
}
