<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resident;

class ResidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(Resident::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required|string|max:100',
            'photo_id' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'resident_status' => 'required|enum:contract,permanent',
            'phone' => 'required|string|max:50',
            'married_status' => 'required|boolean',
        ]);

        $resident = Resident::create($request->all());
        return response()->json($resident);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $resident = Resident::findOrFail($id);
        return response()->json($resident);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $resident = Resident::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'photo_id' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'resident_status' => 'required|enum:contract,permanent',
            'phone' => 'required|string|max:50',
            'married_status' => 'required|boolean',
        ]);

        $resident->update($request->all());
        return response()->json($resident);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $resident = Resident::findOrFail($id);
        $resident->delete();
        return response()->json(null, 204);
    }
}
