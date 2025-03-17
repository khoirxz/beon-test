<?php

namespace App\Http\Controllers;

use App\Models\Expenses;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Models\Resident;
use App\Models\ResidentHistory;
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
        return response()->json(Resident::with('houses')->whereNull('deleted_at')->latest()->get(), 200);
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
            'married_status' => 'string', // karena terdapat file, form data hanya bisa menerima string
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
            'phone' => str_replace(' ', '', $request->phone),
            'married_status' => $request->married_status === 'true' ? true : false
        ]);

        return response()->json($resident, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $resident = Resident::findOrFail($id);
        return response()->json($resident, 200);
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
            'married_status' => 'string',
        ]);

        if ($request->hasFile('photo_id')) {
            if ($resident->photo_id) {
                Storage::disk('public')->delete($resident->photo_id);
            }

            $photo_id = $request->file('photo_id')->store('images', 'public');
            
            if (!$photo_id) {
                return response()->json(['error' => 'Failed to upload photo'], 500);
            }
        } else {
            $photo_id = $resident->photo_id;
        }

        if ($request->photo_id === null) {
            $photo_id = null;
        }

        $resident->update([
            'name' => $request->name,
            'photo_id' => $photo_id,
            'resident_status' => $request->resident_status,
            'phone' => str_replace(' ', '', $request->phone),
            'married_status' => $request->married_status
        ]);

        return response()->json($resident, 200);
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
 
    public function transactions(string $id)
    {
        // cari resident berdasarkan id
        $residentHistory = ResidentHistory::where('id_resident', $id)->pluck('id');

        // ambil semua pembayaran berdasarkan histori kependudukan
        $payments = Payment::whereIn('id_resident_history', $residentHistory)->with('services')->get();
    
        return response()->json([
            'transactions' => $payments
        ]);
    }
}
