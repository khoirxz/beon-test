<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\House;

class HouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(House::whereNull('deleted_at')->latest()->get(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        // filter the request
        $request->validate([
            'name' => 'required|unique:houses,name',
            'description' => 'required',
            'status' => 'required',
        ]);


        $house = House::create($request->all());
        return response()->json($house, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $house = House::findOrFail($id);
        return response()->json($house, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $house = House::findOrFail($id);

        $request->validate([
            'name' => 'required|unique:houses,name,' . $id,
            'description' => 'required',
            'status' => 'required',
        ]);

        $house->update($request->all());
        return response()->json($house, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $house = House::findOrFail($id);
        $house->delete();
        return response()->json(null, 204);
    }
}
