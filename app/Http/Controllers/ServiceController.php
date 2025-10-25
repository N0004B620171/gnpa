<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'perPage']);

        $q = Service::query();

        if ($search = $filters['search'] ?? null) {
            $q->where(function ($query) use ($search) {
                $query->where('nom', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = $filters['perPage'] ?? 15;

        return Inertia::render('Services/Index', [
            'services' => $q->latest()->paginate($perPage)->withQueryString(),
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Services/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:190',
            'code' => 'nullable|string|max:50|unique:services,code',
            'montant' => 'required|numeric|min:0',
            'montant_a_payer' => 'nullable|numeric|min:0',
            'obligatoire' => 'boolean',
            'description' => 'nullable|string',
            'actif' => 'boolean',
        ]);

        DB::transaction(function () use ($data) {
            if (empty($data['code'])) {
                $data['code'] = Str::upper(Str::slug($data['nom'], '_'));
            }

            // S'assurer que le code est unique
            $baseCode = $data['code'];
            $counter = 1;
            while (Service::where('code', $data['code'])->exists()) {
                $data['code'] = $baseCode . '_' . $counter;
                $counter++;
            }

            Service::create($data);
        });

        return redirect()->route('services.index')
            ->with('success', 'Service créé avec succès.');
    }

    public function edit(Service $service)
    {
        return Inertia::render('Services/Edit', [
            'service' => $service
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:190',
            'code' => 'nullable|string|max:50|unique:services,code,' . $service->id,
            'montant' => 'required|numeric|min:0',
            'montant_a_payer' => 'nullable|numeric|min:0',
            'obligatoire' => 'boolean',
            'description' => 'nullable|string',
            'actif' => 'boolean',
        ]);

        DB::transaction(function () use ($service, $data) {
            if (empty($data['code'])) {
                $data['code'] = $service->code ?? Str::upper(Str::slug($data['nom'], '_'));
            }
            $service->update($data);
        });

        return back()->with('success', 'Service mis à jour avec succès.');
    }

    public function destroy(Service $service)
    {
        // Vérifier si le service est utilisé avant suppression
        if ($service->serviceCiblages()->exists()) {
            return back()->with('error', 'Impossible de supprimer ce service car il est utilisé dans des ciblages.');
        }

        if ($service->factureDetails()->exists()) {
            return back()->with('error', 'Impossible de supprimer ce service car il est utilisé dans des factures.');
        }

        $service->delete();

        return back()->with('success', 'Service supprimé avec succès.');
    }
}
