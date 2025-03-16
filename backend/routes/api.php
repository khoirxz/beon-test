<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UtilityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExpensesController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ResidentHistoryController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\UsersController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/residents/search', [UtilityController::class, 'search']);
    Route::get('/summary', [UtilityController::class, 'summary']);
    Route::get('/report', [UtilityController::class, 'report']);
    Route::get('/residents/{id}/transactions', [ResidentController::class, 'transactions']);
    
    Route::apiResource('expenses', ExpensesController::class);
    Route::apiResource('houses', HouseController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('residents', ResidentController::class);
    Route::apiResource('residents-history', ResidentHistoryController::class);
    Route::apiResource('services', ServicesController::class);
    Route::apiResource('users', UsersController::class);
});
