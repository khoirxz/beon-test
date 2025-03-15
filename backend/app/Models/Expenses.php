<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expenses extends Model
{
    //
    use HasFactory, SoftDeletes, HasUuids;

    // Nama kolom primary key yang digunakan oleh model ini
    protected $primaryKey = 'id';

    // Tipe data yang digunakan oleh kolom primary key
    // Dalam hal ini, kita menggunakan string sebagai tipe data
    protected $keyType = 'string';
    
    // Menonaktifkan auto-increment untuk primary key
    public $incrementing = false;

    // Kolom-kolom yang boleh diisi
    protected $fillable = [
        'id',
        'description',
        'expense_date',
        'expense_total',
        'id_admin',
        'id_services',
    ];
}
