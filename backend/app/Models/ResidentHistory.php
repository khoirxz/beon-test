<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ResidentHistory extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    // Nama kolom primary key yang digunakan oleh model ini
    protected $primaryKey = 'id';

    // Tipe data yang digunakan oleh kolom primary key
    // Dalam hal ini, kita menggunakan string sebagai tipe data
    protected $keyType = 'string';
    
    // Menonaktifkan auto-increment untuk primary key
    public $incrementing = false;

    protected $fillable = [
        'id_resident',
        'id_house',
        'date_filled',
        'date_out',
    ];

    public function resident() 
    {
        return $this->belongsTo(resident::class, 'id_resident');
    }

    public function house()
    {
        return $this->belongsTo(house::class, 'id_house');
    }
}
