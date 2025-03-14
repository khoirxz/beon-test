<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resident extends Model
{
    //
    use HasFactory, SoftDeletes;

    // Nama kolom primary key yang digunakan oleh model ini
    protected $primaryKey = 'id';

    // Tipe data yang digunakan oleh kolom primary key
    // Dalam hal ini, kita menggunakan string sebagai tipe data
    protected $keyType = 'string';
    
    // Menonaktifkan auto-increment untuk primary key
    public $incrementing = false;

    protected $fillable = [
        'name',
        'photo_id',
        'resident_status',
        'phone',
        'married_status'
    ];
}
