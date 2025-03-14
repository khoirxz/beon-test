<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(Payment::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'id_resident_history' => 'required|exists:resident_histories,id',
            'id_services' => 'required|exists:services,id',
            'payment_date' => 'required|date',
            'total_payment' => 'required|integer',
            'status' => 'required|enum:paid,unpaid',
            'billing_period' => 'required|date',
        ]);

        $payment = Payment::create($request->all());
        return response()->json($payment);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $payment = Payment::findOrFail($id);
        return response()->json($payment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $payment = Payment::findOrFail($id);

        $request->validate([
            'id_resident_history' => 'required|exists:resident_histories,id',
            'id_services' => 'required|exists:services,id',
            'payment_date' => 'required|date',
            'total_payment' => 'required|integer',
            'status' => 'required|enum:paid,unpaid',
            'billing_period' => 'required|date',
        ]);

        $payment->update($request->all());
        return response()->json($payment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $payment = Payment::findOrFail($id);
        $payment->delete();
        return response()->json(null, 204);
    }
}
