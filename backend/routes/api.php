<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ExpensesController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ResidentHistoryController;
use App\Http\Controllers\ServicesController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('expenses', ExpensesController::class);
Route::apiResource('houses', HouseController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('residents', ResidentController::class);
Route::apiResource('residents-history', ResidentHistoryController::class);
Route::apiResource('services', ServicesController::class);