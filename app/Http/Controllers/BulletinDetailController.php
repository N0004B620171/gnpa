<?php

namespace App\Http\Controllers;

use App\Models\BulletinDetail;
use Illuminate\Http\Request;

class BulletinDetailController extends Controller
{
    public function index()
    {
        return BulletinDetail::with('bulletin.inscription.eleve')->paginate(50);
    }

    public function show(BulletinDetail $bulletinDetail)
    {
        return $bulletinDetail->load('bulletin.inscription.eleve', 'bulletin.inscription.classe');
    }

    public function update(Request $request, BulletinDetail $bulletinDetail)
    {
        $validated = $request->validate([
            'note' => 'required|numeric|min:0',
            'sur' => 'required|numeric|min:1',
            'note_normalisee' => 'required|numeric|min:0|max:20',
            'appreciation' => 'nullable|string',
        ]);

        $bulletinDetail->update($validated);
        return $bulletinDetail;
    }

    public function destroy(BulletinDetail $bulletinDetail)
    {
        $bulletinDetail->delete();
        return response()->json(['message' => 'Détail supprimé']);
    }
}
