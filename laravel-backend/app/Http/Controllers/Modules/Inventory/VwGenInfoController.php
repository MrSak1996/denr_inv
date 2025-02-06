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
        // Start Query
        $query = DB::table('vw_gen_info');

        if (!empty($designation)) {
            $query->where('roles', $designation);
        }

        $data = $query->get();
        $rowCount = $data->count();

        return response()->json([
            'data' => $data,
            'count' => $rowCount,
            'total' => $rowCount
        ]);
    }
}
