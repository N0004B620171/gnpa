<?php

namespace App\Http\Controllers;

use App\Models\BulletinDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BulletinDetailController extends Controller
{
    public function index(Request $request): Response
    {
        $query = BulletinDetail::with([
            'bulletin.inscription.eleve',
            'matiere',
            'bulletin.trimestre.anneeScolaire'
        ]);

        // Filtres
        if ($request->has('bulletin_id') && $request->bulletin_id) {
            $query->where('bulletin_id', $request->bulletin_id);
        }

        if ($request->has('matiere_id') && $request->matiere_id) {
            $query->where('matiere_id', $request->matiere_id);
        }

        // Tri
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $details = $query->paginate($request->get('per_page', 50))
            ->withQueryString();

        return Inertia::render('BulletinDetails/Index', [
            'details' => $details,
            'filters' => $request->only(['bulletin_id', 'matiere_id', 'perPage'])
        ]);
    }

    public function update(Request $request, BulletinDetail $bulletinDetail)
    {
        $validated = $request->validate([
            'note' => 'required|numeric|min:0',
            'sur' => 'required|numeric|min:1',
            'note_normalisee' => 'required|numeric|min:0|max:20',
            'appreciation' => 'nullable|string|max:255',
            'coefficient' => 'sometimes|integer|min:1',
        ]);

        $bulletinDetail->update($validated);

        // Recalculer la moyenne du bulletin
        $this->recalculateBulletinAverage($bulletinDetail->bulletin_id);

        return back()->with('success', 'Détail du bulletin mis à jour avec succès');
    }

    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'details' => 'required|array',
            'details.*.id' => 'required|exists:bulletin_details,id',
            'details.*.note' => 'required|numeric|min:0',
            'details.*.sur' => 'required|numeric|min:1',
            'details.*.note_normalisee' => 'required|numeric|min:0|max:20',
            'details.*.appreciation' => 'nullable|string|max:255',
        ]);

        $updatedDetails = [];
        $bulletinIds = [];

        foreach ($validated['details'] as $detailData) {
            $detail = BulletinDetail::find($detailData['id']);
            $detail->update($detailData);
            $updatedDetails[] = $detail;
            $bulletinIds[$detail->bulletin_id] = true;
        }

        // Recalculer les moyennes des bulletins modifiés
        foreach (array_keys($bulletinIds) as $bulletinId) {
            $this->recalculateBulletinAverage($bulletinId);
        }

        return back()->with('success', count($updatedDetails) . ' détails mis à jour avec succès');
    }

    public function destroy(BulletinDetail $bulletinDetail)
    {
        $bulletinId = $bulletinDetail->bulletin_id;
        $bulletinDetail->delete();

        // Recalculer la moyenne du bulletin
        $this->recalculateBulletinAverage($bulletinId);

        return back()->with('success', 'Détail du bulletin supprimé avec succès');
    }

    private function recalculateBulletinAverage($bulletinId): void
    {
        $bulletin = \App\Models\Bulletin::with('details')->find($bulletinId);
        
        if ($bulletin && $bulletin->details->count() > 0) {
            $totalNotes = 0;
            $totalCoefficients = 0;

            foreach ($bulletin->details as $detail) {
                $totalNotes += $detail->note_normalisee * $detail->coefficient;
                $totalCoefficients += $detail->coefficient;
            }

            $moyenne = $totalCoefficients > 0 ? $totalNotes / $totalCoefficients : 0;
            
            $bulletin->update([
                'moyenne_eleve' => round($moyenne, 2)
            ]);
        }
    }
}