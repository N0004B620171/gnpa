<?php

namespace App\Http\Controllers;

use App\Models\Bulletin;
use App\Models\Inscription;
use App\Helpers\BulletinHelper;

class BulletinController extends Controller
{
    public function index()
    {
        return Bulletin::with('inscription.eleve', 'trimestre')->paginate(20);
    }

    public function show(Bulletin $bulletin)
    {
        return $bulletin->load('details', 'inscription.eleve', 'inscription.classe.niveau');
    }

    public function destroy(Bulletin $bulletin)
    {
        $bulletin->delete();
        return response()->json(['message' => 'Bulletin supprimé']);
    }

    public function generateTrimestre($inscriptionId, $trimestreId)
    {
        $inscription = Inscription::with(['classe.professeur', 'eleve', 'notes.matiere'])->findOrFail($inscriptionId);
        return BulletinHelper::generateTrimestriel($inscription, $trimestreId);
    }

    public function generateAnnuel($inscriptionId)
    {
        $inscription = Inscription::with(['classe.professeur', 'eleve', 'notes.matiere'])->findOrFail($inscriptionId);
        return BulletinHelper::generateAnnuel($inscription);
    }

    public function download(Bulletin $bulletin)
    {
        return BulletinHelper::generatePDF($bulletin);
    }
}
