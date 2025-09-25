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
        $office = $req->input('office');      // This will be null if not passed

        // Ensure designation is numeric
        if (!is_numeric($designation)) {
            return response()->json([
                'error' => 'Invalid designation parameter.'
            ], 400);
        }

        $tableName = 'vw_gen_info';

        $query = DB::table($tableName)->orderBy('id', 'desc');

        if (!empty($office)) {
            $query->where('division_id', $office);
        }
        // Filter by roles unless designation is 13
        if ($designation != 13) {
            $query->where('role_id', $designation);
        }

        // Search across multiple columns using OR
        if ($req->filled('search')) {
            $search = $req->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%")
                    ->orWhere('serial_no', 'like', "%{$search}%")
                    ->orWhere('qr_code', 'like', "%{$search}%")
                    ->orWhere('control_no', 'like', "%{$search}%")
                    ->orWhere('property_no', 'like', "%{$search}%");
            });
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
