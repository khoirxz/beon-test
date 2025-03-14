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
        return response()->json(Expenses::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'description' => 'required|string|max:200',
            'expense_date' => 'required|date',
            'expense_total' => 'required|integer',
            'id_admin' => 'required|uuid',
            'id_services' => 'required|uuid',
        ]);

        $expense = Expenses::create($request->all());
        return response()->json($expense);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $expense = Expenses::findOrFail($id);
        return response()->json($expense);
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

        $expense->update($request->all());
        return response()->json($expense);
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
