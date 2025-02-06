<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VwInvalidData;

use DB;

class VwInvalidDataController extends Controller
{
    public function getInvalidData()
    {
        $invalidData = DB::table('vw_invalid_data')->get();
        return response()->json($invalidData);
    }
}
