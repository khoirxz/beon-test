<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
// use illuminate\Support\Str;

class House extends Model
{
    // karena kita menggunakan uuid, maka kita perlu mengimpor HasUuids
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
        'description',
        'status',
    ];

    // protected static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($model) {
    //         $model->id = Str::uuid();
    //     });
    // }

    public function residents()
    {
        return $this->belongsToMany(Resident::class, 'resident_histories', 'id_house', 'id_resident')
            ->whereNull('resident_histories.date_out')
            ->withTimestamps();
    }
}
