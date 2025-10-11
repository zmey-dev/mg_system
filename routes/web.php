<?php

use App\Http\Controllers\AmbienteController;
use App\Http\Controllers\AtividadeController;
use App\Http\Controllers\AtividadeRegistroController;
use App\Http\Controllers\CatalogoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmpreendimentoController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ParametersController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TorreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/catalog', [CatalogoController::class, 'index'])->name('catalog');
    Route::get('/catalog/items', [CatalogoController::class, 'items'])->name('catalog.items');

    Route::get('/activities', [AtividadeController::class, 'index'])->name('activities');
    Route::post('/activities', [AtividadeController::class, 'store'])->name('activities.store');
    Route::get('/activities/{id}', [AtividadeController::class, 'show'])->name('activities.show');
    Route::put('/activities/{id}', [AtividadeController::class, 'update'])->name('activities.update');
    Route::delete('/activities/{id}', [AtividadeController::class, 'destroy'])->name('activities.destroy');

    Route::get('/registros', [AtividadeRegistroController::class, 'index'])->name('registros.index');
    Route::post('/registros', [AtividadeRegistroController::class, 'store'])->name('registros.store');
    Route::get('/registros/{id}', [AtividadeRegistroController::class, 'show'])->name('registros.show');
    Route::put('/registros/{id}', [AtividadeRegistroController::class, 'update'])->name('registros.update');
    Route::post('/registros/{id}/complete', [AtividadeRegistroController::class, 'complete'])->name('registros.complete');

    Route::get('/torres', [TorreController::class, 'index'])->name('torres.index');
    Route::post('/torres', [TorreController::class, 'store'])->name('torres.store');
    Route::get('/torres/{id}', [TorreController::class, 'show'])->name('torres.show');
    Route::put('/torres/{id}', [TorreController::class, 'update'])->name('torres.update');
    Route::delete('/torres/{id}', [TorreController::class, 'destroy'])->name('torres.destroy');

    Route::get('/ambientes', [AmbienteController::class, 'index'])->name('ambientes.index');
    Route::post('/ambientes', [AmbienteController::class, 'store'])->name('ambientes.store');
    Route::get('/ambientes/{id}', [AmbienteController::class, 'show'])->name('ambientes.show');
    Route::put('/ambientes/{id}', [AmbienteController::class, 'update'])->name('ambientes.update');
    Route::delete('/ambientes/{id}', [AmbienteController::class, 'destroy'])->name('ambientes.destroy');

    Route::get('/items', [ItemController::class, 'index'])->name('items.index');
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');
    Route::get('/items/{id}', [ItemController::class, 'show'])->name('items.show');
    Route::put('/items/{id}', [ItemController::class, 'update'])->name('items.update');
    Route::delete('/items/{id}', [ItemController::class, 'destroy'])->name('items.destroy');

    Route::middleware(['role:master'])->group(function () {
        Route::get('/parameters', [ParametersController::class, 'index'])->name('parameters');
        Route::post('/parameters/grupos', [ParametersController::class, 'storeGrupo'])->name('parameters.grupos.store');
        Route::delete('/parameters/grupos/{id}', [ParametersController::class, 'destroyGrupo'])->name('parameters.grupos.destroy');
        Route::post('/parameters/origem', [ParametersController::class, 'storeOrigem'])->name('parameters.origem.store');
        Route::delete('/parameters/origem/{id}', [ParametersController::class, 'destroyOrigem'])->name('parameters.origem.destroy');
        Route::post('/parameters/tipo', [ParametersController::class, 'storeTipo'])->name('parameters.tipo.store');
        Route::delete('/parameters/tipo/{id}', [ParametersController::class, 'destroyTipo'])->name('parameters.tipo.destroy');
        Route::post('/parameters/doctotipo', [ParametersController::class, 'storeDoctoTipo'])->name('parameters.doctotipo.store');
        Route::delete('/parameters/doctotipo/{id}', [ParametersController::class, 'destroyDoctoTipo'])->name('parameters.doctotipo.destroy');
        Route::post('/parameters/periodo', [ParametersController::class, 'storePeriodo'])->name('parameters.periodo.store');
        Route::delete('/parameters/periodo/{id}', [ParametersController::class, 'destroyPeriodo'])->name('parameters.periodo.destroy');
        Route::post('/parameters/profissional', [ParametersController::class, 'storeProfissional'])->name('parameters.profissional.store');
        Route::delete('/parameters/profissional/{id}', [ParametersController::class, 'destroyProfissional'])->name('parameters.profissional.destroy');
    });

    Route::middleware(['role:master,sindico'])->group(function () {
        Route::get('/empreendimentos', [EmpreendimentoController::class, 'index'])->name('empreendimentos.index');
        Route::post('/empreendimentos', [EmpreendimentoController::class, 'store'])->name('empreendimentos.store');
        Route::get('/empreendimentos/{id}', [EmpreendimentoController::class, 'show'])->name('empreendimentos.show');
        Route::put('/empreendimentos/{id}', [EmpreendimentoController::class, 'update'])->name('empreendimentos.update');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
