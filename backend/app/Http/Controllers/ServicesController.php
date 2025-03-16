<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Services;
use Illuminate\Validation\Rules\Enum;
use App\enums\PeriodServices;
use App\enums\TypeServices;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(Services::latest()->get(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string|max:200',
            'price' => 'required|integer',
            'period' => [new Enum(PeriodServices::class)],
            'type' => [new Enum(TypeServices::class)],
        ]);

        $service = Services::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'period' => $request->period,
            'type' => $request->type
        ]);

        return response()->json($service, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $service = Services::findOrFail($id);
        return response()->json($service, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $service = Services::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string|max:200',
            'price' => 'required|integer',
            'period' => [new Enum(PeriodServices::class)],
            'type' => [new Enum(TypeServices::class)],
        ]);

        $service->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'period' => $request->period,
            'type' => $request->type
        ]);
        
        return response()->json($service, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $service = Services::findOrFail($id);
        $service->delete();
        return response()->json(null, 204);
    }
}
