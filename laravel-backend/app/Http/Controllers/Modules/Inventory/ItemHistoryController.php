<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ItemHistory;
use App\Models\GeneralInformation;
use App\Policies\ItemHistoryPolicy;
use App\Http\Resources\ItemHistoryResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ItemHistoryController extends Controller
{
    /**
     * Apply authentication and optionally authorization
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum'); // Use 'auth:api' if using Passport
    }

    /**
     * Fetch item history by item ID
     */
    public function getItemHistory(int $itemId)
    {
        // Optionally, you can check if the authenticated user has access to this item

        if (!Auth::user()->can('viewHistory', ItemHistory::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $history = ItemHistory::select(
            'tbl_item_history.*',
            'd.division_title as prev_office_name',
            'dd.division_title as new_office_name'
        )
            ->leftJoin('tbl_division as d', 'd.id', '=', 'tbl_item_history.prev_office')
            ->leftJoin('tbl_division as dd', 'dd.id', '=', 'tbl_item_history.new_office')
            ->where('tbl_item_history.item_id', $itemId)
            ->orderBy('tbl_item_history.date_transferred', 'desc')
            ->get();

        // Return as API Resource for consistent, safe output
        return ItemHistoryResource::collection($history);

    }

    /**
     * Store new item history entry securely
     */
    public function post_insert_ict_transfer(Request $request)
    {
        // ✅ Authorization check
        if (!Auth::user()->can('transfer', ItemHistory::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // ✅ Validate and sanitize input
        $validated = $request->validate([
            'item_id' => 'required|integer|exists:tbl_general_info,id',
            'date_transferred' => 'required|date',
            'prev_owner' => 'nullable|string|max:255',
            'prev_office' => 'nullable|integer|exists:tbl_division,id',
            'new_owner' => 'required|string|max:255',
            'new_office' => 'required|integer|exists:tbl_division,id',
            'remarks' => 'nullable|string|max:500',
        ]);

        // ✅ Add authenticated user
        $validated['recorded_by'] = Auth::id();

        DB::beginTransaction();

        try {
            // 🧩 Step 1: Insert into item history
            $history = ItemHistory::create($validated);

            // 🧩 Step 2: Update general information (equipment)
            DB::table('tbl_general_info')
                ->where('id', $validated['item_id'])
                ->update([
                    'actual_user' => $validated['new_owner'],
                    'actual_user_division_id' => $validated['new_office'],
                ]);

            DB::commit();

            // ✅ Return success with both responses
            return response()->json([
                'message' => 'Item history successfully recorded and equipment info updated.',
                'data' => new ItemHistoryResource($history),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Transaction failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    // public function post_insert_ict_transfer(Request $request)
    // {
    //     // Authorization check (optional, uncomment if using roles/permissions)
    //     if (!Auth::user()->can('transfer', ItemHistory::class)) {
    //         return response()->json(['message' => 'Unauthorized'], 403);
    //     }


    //     // Validate and sanitize input
    //     $validated = $request->validate([
    //         'item_id' => 'required|integer|exists:tbl_general_info,id',
    //         'date_transferred' => 'required|date',
    //         'prev_owner' => 'nullable|string|max:255',
    //         'prev_office' => 'nullable|integer|exists:tbl_division,id',
    //         'new_owner' => 'required|string|max:255',
    //         'new_office' => 'required|integer|exists:tbl_division,id',
    //         'remarks' => 'nullable|string|max:500',
    //     ]);

    //     // Assign the authenticated user as the recorder
    //     $validated['recorded_by'] = Auth::id();

    //     // Create the record using fillable fields only
    //     $history = ItemHistory::create($validated);

    //     return response()->json([
    //         'message' => 'Item history successfully recorded.',
    //         'data' => new ItemHistoryResource($history),
    //     ], 201);
    // }

    // public function update_ict_equipment(Request $request)
    // {
    //     // ✅ Authorization
    //     if (!Auth::user()->can('transfer', ItemHistory::class)) {
    //         return response()->json(['message' => 'Unauthorized'], 403);
    //     }

    //     // ✅ Validate input
    //     $validated = $request->validate([
    //         'item_id' => 'required|integer|exists:tbl_general_info,id',
    //         'new_owner' => 'required|string|max:255',
    //         'new_office' => 'required|integer|exists:tbl_division,id',
    //     ]);

    //     // ✅ Perform the update
    //     DB::table('tbl_general_info')
    //         ->where('id', $validated['item_id'])
    //         ->update([
    //             'actual_user' => $validated['new_owner'],
    //             'actual_user_division_id' => $validated['new_office'],
    //         ]);

    //     return response()->json([
    //         'message' => 'Equipment record successfully updated.',
    //         'updated_data' => [
    //             'actual_user' => $validated['new_owner'],
    //             'actual_user_division_id' => $validated['new_office']
    //         ]
    //     ], 200);
    // }


}
