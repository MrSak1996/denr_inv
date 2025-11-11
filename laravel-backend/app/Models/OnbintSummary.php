<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OnbintSummary extends Model
{
    protected $table = 'dp_onbint_summary';

    protected $fillable = [
        'filename',
        'total_rows',
        'uploaded_by',
        'date_imported',
        'status',
        'message',
        'details'

    ];
    protected $casts = [
        'details' => 'array',
    ];
    public $timestamps = false;
}
