<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Payment extends Model
{
    //
    use HasFactory, HasUuids;

    // Nama kolom primary key yang digunakan oleh model ini
    protected $primaryKey = 'id';

    // Tipe data yang digunakan oleh kolom primary key
    // Dalam hal ini, kita menggunakan string sebagai tipe data
    protected $keyType = 'string';
    
    // Menonaktifkan auto-increment untuk primary key
    public $incrementing = false;

    protected $fillable = [
        'id_resident_history',
        'id_services',
        'payment_date',
        'total_payment',
        'status',
        'billing_period',
    ];

    public function resident_history()
    {
        return $this->belongsTo(ResidentHistory::class, 'id_resident_history');
    }

    public function services()
    {
        return $this->belongsTo(Services::class, 'id_services');
    }

}
