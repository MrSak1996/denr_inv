<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Http\Controllers\Controller; // ✅ You missed this
use Illuminate\Http\Request;
use App\Models\ItemHistory;

class ItemHistoryController extends Controller
{
    /**
     * Fetch item history by item ID
     */
    public function getItemHistory($itemId)
    {
        $history = ItemHistory::where('item_id', $itemId)
            ->orderBy('date_transferred', 'desc')
            ->get();


        return response()->json($history);
    }

    /**
     * Store new item history entry
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:tbl_general_info,id',
            'date_transferred' => 'required|date',
            'prev_owner' => 'nullable|string|max:255',
            'prev_office' => 'nullable|string|max:255',
            'new_owner' => 'nullable|string|max:255',
            'new_office' => 'nullable|string|max:255',
            'remarks' => 'nullable|string',
            'recorded_by' => 'nullable|string|max:255',
        ]);

        $history = ItemHistory::create($validated);

        return response()->json([
            'message' => 'Item history successfully recorded.',
            'data' => $history,
        ]);
    }
}
