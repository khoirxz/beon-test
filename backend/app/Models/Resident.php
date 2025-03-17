<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;


class Resident extends Model
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

    protected $fillable = [
        'name',
        'photo_id',
        'resident_status',
        'phone',
        'married_status'
    ];

    // sembunyikan kolom deleted_at dan updated_at
    protected $hidden = [
        'deleted_at',
    ];

    public function houses()
    {
        return $this->belongsToMany(House::class, 'resident_histories', 'id_resident', 'id_house')
            ->whereNull('resident_histories.date_out') // only residents who are still in the house
            ->withTimestamps();
    }
}
