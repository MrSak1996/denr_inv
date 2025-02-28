<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VwInvalidData;

use DB;

class VwInvalidDataController extends Controller
{
    public function getInvalidData(Request $req)
    {
        $designation = $req->query('designation');

        $query = DB::table('vw_invalid_data');

        if ($designation != 13) {
        $invalidData = $query->get();

        }else{
            $query->where('registered_loc', $designation);

        }

        $invalidData = $query->get();
        $rowCount = $invalidData->count(); 

        return response()->json([
            'count' => $rowCount
        ]);
    }
}
