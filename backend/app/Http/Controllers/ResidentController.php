<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resident;
// use Illuminate\Validation\Rules\Enum;
// use App\enums\ResidentStatus;
use Illuminate\Support\Facades\Storage;


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
            'photo_id' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            // 'resident_status' => [new Enum(ResidentStatus::class)],
            'resident_status' => 'required|string|in:contract,permanent',
            'phone' => 'required|string|max:50',
            'married_status' => 'boolean',
        ]);

        // saving the image to storage
        if ($request->hasFile('photo_id')) {
            $photo_id = $request->file('photo_id')->store('images', 'public');
            if (!$photo_id) {
                return response()->json(['error' => 'Failed to upload photo'], 500);
            }
        }

        $resident = Resident::create([
            'name' => $request->name,
            'photo_id' => $photo_id,
            'resident_status' => $request->resident_status,
            'phone' => $request->phone,
            'married_status' => $request->married_status
        ]);

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
        // remember when using method PUT or PATCH, you should add "_method" in your form
        // example POST : http://localhost:8000/api/residents/1
        // add field _method=PUT

        $resident = Resident::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'photo_id' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            // 'resident_status' => [new Enum(ResidentStatus::class)],
            'resident_status' => 'required|string|in:contract,permanent',
            'phone' => 'required|string|max:50',
            'married_status' => 'boolean',
        ]);

        if ($request->hasFile('photo_id')) {
            if ($resident->photo_id) {
                Storage::disk('public')->delete($resident->photo_id);
            }
            $photo_id = $request->file('photo_id')->store('images', 'public');
            if (!$photo_id) {
                return response()->json(['error' => 'Failed to upload photo'], 500);
            }
            
        }

        $resident->update([
            'name' => $request->name,
            'photo_id' => $photo_id,
            'resident_status' => $request->resident_status,
            'phone' => $request->phone,
            'married_status' => $request->married_status
        ]);

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
