<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Country;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});



Route::get('/countries', function () {

    // Query the database to retrieve all countries with their names and codes
    $countries = Country::select('name', 'code')->get();

    // Render the React component via Inertia and pass the countries as props
    return Inertia::render('CountrySelector', [
        'countries' => $countries
    ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
