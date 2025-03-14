<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ResidentHistory;

class ResidentHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(ResidentHistory::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'id_resident' => 'required|exists:residents,id',
            'id_house' => 'required|exists:houses,id',
            'date_filled' => 'required|date',
            'date_out' => 'required|date',
        ]);

        $residentHistory = ResidentHistory::create($request->all());
        return response()->json($residentHistory);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $residentHistory = ResidentHistory::findOrFail($id);
        return response()->json($residentHistory);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $residentHistory = ResidentHistory::findOrFail($id);

        $request->validate([
            'id_resident' => 'required|exists:residents,id',
            'id_house' => 'required|exists:houses,id',
            'date_filled' => 'required|date',
            'date_out' => 'required|date',
        ]);

        $residentHistory->update($request->all());
        return response()->json($residentHistory);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $residentHistory = ResidentHistory::findOrFail($id);
        $residentHistory->delete();
        return response()->json(null, 204);
    }
}
