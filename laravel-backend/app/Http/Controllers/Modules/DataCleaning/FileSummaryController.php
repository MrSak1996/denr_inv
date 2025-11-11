<?php

namespace App\Http\Controllers\Modules\DataCleaning;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class FileSummaryController extends Controller
{
    /**
     * Display summary of imported files.
     */
    public function index()
    {
        // Run your SQL query using Laravel's query builder
        $data = DB::table('dp_onbint_summary')
            ->select('filename','status','message','details', 'created_at','uploaded_by', 'total_rows')
            ->orderByDesc('created_at')
            ->get();

        // Return as JSON
        return response()->json([
            'message' => 'File summary retrieved successfully!',
            'data' => $data
        ]);
    }
}
