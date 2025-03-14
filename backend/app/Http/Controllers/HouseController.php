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
        return response()->json(House::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        // filter the request
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'status' => 'required',
        ]);


        $house = House::create($request->all());
        return response()->json($house);
    }


    /**
     * Display the specified resource.
     */
    public function show(House $house)
    {
        //
        return response()->json($house);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, House $house)
    {
        //
        $house->update($request->all());
        return response()->json($house);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(House $house)
    {
        //
        $house->delete();
        return response()->json(null, 204);
    }
}
