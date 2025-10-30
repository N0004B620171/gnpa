<?php

namespace App\Providers;

use App\Models\Composition;
use App\Models\Note;
use App\Models\Paiement;
use App\Models\ServiceCiblage;
use App\Observers\CompositionObserver;
use App\Observers\NoteObserver;
use App\Observers\PaiementObserver;
use App\Observers\ServiceCiblageObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Composition::observe(CompositionObserver::class);
        Note::observe(NoteObserver::class);
        ServiceCiblage::observe(ServiceCiblageObserver::class);
        Paiement::observe(PaiementObserver::class);
        Schema::defaultStringLength(191);
        Inertia::share([
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                    'info' => session('info'),
                    'warning' => session('warning'),
                ];
            },
        ]);
    }
}
