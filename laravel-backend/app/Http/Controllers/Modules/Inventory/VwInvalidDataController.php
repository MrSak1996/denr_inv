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
        $office = $req->query('designation');
     
        $query = DB::table('vw_invalid_data');

        if ($office != 13) {
        $invalidData = $query->where('registered_loc',$office)->get();

        }else{
            $invalidData = $query->get();

        }

        $invalidData = $query->get();
        $rowCount = $invalidData->count(); 

        return response()->json([
            'count' => $rowCount
        ]);
    }
}
