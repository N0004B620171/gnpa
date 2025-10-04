<?php

namespace App\Http\Controllers;

use App\Models\Cycle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CycleController extends Controller
{
    public function index(Request $request)
    {
        $query = Cycle::query();

        if ($request->has('q')) {
            $q = $request->get('q');
            $query->where('nom', 'like', "%$q%");
        }

        return Inertia::render('Cycles/Index', [
            'cycles' => $query->latest()->paginate(15),
            'filters' => $request->only('q')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:cycles,nom'
        ]);
        Cycle::create($validated);
        return redirect()->back()->with('success', 'Cycle ajouté avec succès');
    }

    public function update(Request $request, Cycle $cycle)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:cycles,nom,' . $cycle->id
        ]);
        $cycle->update($validated);
        return redirect()->back()->with('success', 'Cycle mis à jour');
    }

    public function destroy(Cycle $cycle)
    {
        $cycle->delete();
        return redirect()->back()->with('success', 'Cycle supprimé');
    }
}
