<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VwGenInfo;
use DB;

class VwGenInfoController extends Controller
{
    public function index(Request $req)
    {
        $designation = $req->query('designation');

        // Ensure designation is numeric and a valid table exists
        if (!is_numeric($designation)) {
            return response()->json([
                'error' => 'Invalid designation parameter.'
            ], 400);
        }

        // Define table name
        $tableName = 'vw_gen_info';

        // Initialize the query
        $query = DB::table($tableName)->orderBy('id', 'desc');

        // Filter by roles unless designation is 13
        if ($designation != 13) {
            $query->where('role_id', $designation)->orderBy('id', 'desc');
        }

        // Fetch the data
        $data = $query->get();
        $rowCount = $data->count();

        return response()->json([
            'data' => $data,
            'count' => $rowCount,
            'total' => $rowCount
        ]);
    }
}
