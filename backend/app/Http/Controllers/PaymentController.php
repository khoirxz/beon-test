<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Validation\Rules\Enum;
use App\enums\StatusPayment;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(Payment::with('resident_history.resident','resident_history.house', 'services')->latest()->get(), 200);
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
            'status' => [new Enum(StatusPayment::class)],
            'billing_period' => 'required|string',
        ]);

        $payment = Payment::create([
            'id_resident_history' => $request->id_resident_history,
            'id_services' => $request->id_services,
            'payment_date' => $request->payment_date,
            'total_payment' => $request->total_payment,
            'status' => $request->status,
            // input dari frontend adalah YYYY-MM-DD
            // jadi kita mengkonfersikan ke YYYY-MM
            'billing_period' => date('Y-m', strtotime($request->billing_period)),
        ]);

        return response()->json($payment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $payment = Payment::findOrFail($id)->with('resident_history.resident','resident_history.house', 'services')->first();
        return response()->json($payment, 200);
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
            'status' => [new Enum(StatusPayment::class)],
            'billing_period' => 'required|string',
        ]);

        $payment->update([
            'id_resident_history' => $request->id_resident_history,
            'id_services' => $request->id_services,
            'payment_date' => $request->payment_date,
            'total_payment' => $request->total_payment,
            'status' => $request->status,
            // input dari frontend adalah YYYY-MM-DD
            // jadi kita mengkonfersikan ke YYYY-MM
            'billing_period' => date('Y-m', strtotime($request->billing_period)),
        ]);
        
        return response()->json($payment, 200);
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
