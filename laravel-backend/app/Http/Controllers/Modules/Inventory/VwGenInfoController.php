<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VwGenInfoController extends Controller
{
    public function index(Request $req)
    {
        $designation = $req->query('designation');
        $office = $req->query('office'); // Use query() for consistency

        // Validate designation to ensure it's numeric
        if (!is_numeric($designation)) {
            return response()->json([
                'error' => 'Invalid designation parameter.'
            ], 400);
        }

        $query = DB::table('vw_gen_info')
            ->orderBy('id', 'desc');

        // Apply office filter
        $query->when($office !== null && $office !== '0' && $office !== 'undefined', function ($q) use ($office) {
            $q->where('division_id', $office);
        });

        // Filter by role unless designation is 13
        if ($designation != 13) {
            $query->where('role_id', $designation);
        }

        // Search filter
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

        // Execute query
        $data = $query->get();
        $rowCount = $data->count();

        return response()->json([
            'data' => $data,
            'count' => $rowCount,
            'total' => $rowCount
        ]);
    }
}
