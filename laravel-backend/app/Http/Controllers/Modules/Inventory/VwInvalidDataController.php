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

    public function getInvalidDataPerDivision(Request $req)
    {
        // Get query parameters from frontend
        $designation = $req->query('designation'); // equivalent to registered_loc
        $office = $req->query('office'); // equivalent to division_id

        // Build base query
        $query = DB::table('vw_invalid_data')
            ->where('registered_loc', $designation);

        // Apply division filter only if office is valid
        if (!is_null($office) && $office !== '0' && $office !== 'undefined') {
            $query->where('division_id', $office);
        }

        // Execute query
        $invalidData = $query->get();

        // Optional: count results
        $rowCount = $invalidData->count();

        // Return JSON response
        return response()->json([
            'count' => $rowCount,
        ]);
    }

}
