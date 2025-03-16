<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resident;
use Illuminate\Support\Facades\DB;

class UtilityController extends Controller
{
    //
    public function search()
    {
        $query = $_GET['name'];
        $residents = Resident::where('name', 'like', '%' . $query . '%')->get();
        return response()->json($residents, 200);
    }

    public function summary()
    {
        // ambil data transaksi bulanan
        // group by bulan, ambil total transaksi dan simpan ke kolom income
        $report = DB::table('payments')
            ->selectRaw("DATE_FORMAT(payment_date, '%Y-%m') as month, SUM(total_payment) as income")
            ->groupBy('month');

        // ambil data pengeluaran bulanan
        // group by bulan, ambil total pengeluaran dan simpan ke kolom expense
        $expense = DB::table('expenses')
            ->selectRaw("DATE_FORMAT(expense_date, '%Y-%m') as month, SUM(expense_total) as expense")
            ->groupBy('month');

        // join dua query diatas berdasarkan bulan
        // jika bulan di query pengeluaran tidak ada, maka berikan nilai 0
        $summary = DB::query()
            ->fromSub($report, 'report')
            ->leftJoinSub($expense, 'expense', function ($join) {
                $join->on('report.month', '=', 'expense.month');
            })
            // ambil kolom bulan, income, expense dan hitung balance = income - expense
            ->selectRaw("report.month, report.income, COALESCE(expense.expense, 0) as expense, (report.income - COALESCE(expense.expense, 0)) as balance")
            // urutkan berdasarkan bulan
            ->orderBy('report.month', 'asc')
            ->get();

        return response()->json(['summary' => $summary], 200);
    }

    public function report(Request $request)
    {
        $month = $request->query('month'); // Format: YYYY-MM

        if (!$month) {
            return response()->json(['error' => 'Month parameter is required'], 400);
        }

        // Ambil data pemasukan
        $income = DB::table('payments')
            ->whereRaw("DATE_FORMAT(payment_date, '%Y-%m') = ?", [$month])
            ->select('id', 'payment_date', 'total_payment', 'status', 'billing_period')
            ->get();

        // Ambil total pemasukan
        $total_income = DB::table('payments')
            ->whereRaw("DATE_FORMAT(payment_date, '%Y-%m') = ?", [$month])
            ->sum('total_payment');

        // Ambil data pengeluaran
        $expenses = DB::table('expenses')
            ->whereRaw("DATE_FORMAT(expense_date, '%Y-%m') = ?", [$month])
            ->select('id', 'expense_date', 'expense_total', 'description')
            ->get();

        // Ambil total pengeluaran
        $total_expense = DB::table('expenses')
            ->whereRaw("DATE_FORMAT(expense_date, '%Y-%m') = ?", [$month])
            ->sum('expense_total');

        // Hitung saldo bulan tersebut
        $balance = $total_income - $total_expense;

        return response()->json([
            'month' => $month,
            'total_income' => $total_income,
            'total_expense' => $total_expense,
            'balance' => $balance,
            'income_details' => $income,
            'expense_details' => $expenses,
        ], 200);
    }
}
