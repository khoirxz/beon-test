<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expenses;

class ExpensesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(Expenses::with('admin', 'services')->whereNull('deleted_at')->latest()->get(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'id_admin' => 'required|uuid',
            'id_services' => 'required|uuid',
            'description' => 'required|string|max:200',
            'expense_date' => 'required|date',
            'expense_total' => 'required|integer',
        ]);

        $expense = Expenses::create([
            'id_admin' => $request->id_admin,
            'id_services' => $request->id_services,
            'description' => $request->description,
            'expense_date' => $request->expense_date,
            'expense_total' => $request->expense_total
        ]);
        return response()->json($expense, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $expense = Expenses::findOrFail($id)->with('services')->whereNull('deleted_at')->first();
        return response()->json($expense, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $expense = Expenses::findOrFail($id);

        $request->validate([
            'description' => 'required|string|max:200',
            'expense_date' => 'required|date',
            'expense_total' => 'required|integer',
            'id_admin' => 'required|uuid',
            'id_services' => 'required|uuid',
        ]);

        $expense->update([
            'description' => $request->description,
            'expense_date' => $request->expense_date,
            'expense_total' => $request->expense_total,
            'id_admin' => $request->id_admin,
            'id_services' => $request->id_services
        ]);

        return response()->json($expense, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $expense = Expenses::findOrFail($id);
        $expense->delete();
        return response()->json(null, 204);
    }
}
