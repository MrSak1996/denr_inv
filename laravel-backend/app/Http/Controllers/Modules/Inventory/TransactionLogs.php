<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Models\InventoryTransaction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;



use DB;

class TransactionLogs extends Controller
{
    public function post_record_transac(Request $request)
    {
        $user_id = $req->input('id');
    
        $validated = $request->validate([
            'registered_loc' => 'required|integer',
            'control_no' => 'required|string',
            'qr_code' => 'nullable|string',
            'acct_person' => 'nullable|string',
            'employmentType' => 'nullable|integer',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'property_no' => 'nullable|string',
            'serial_no' => 'nullable|string',
            'aquisition_cost' => 'nullable|numeric',
            'processor' => 'nullable|string',
            'selectedDivision' => 'nullable|integer',
            'selectedAcctDivision' => 'nullable|integer',
            'selectedActualDivision' => 'nullable|integer',
            'selectedWorkNature' => 'nullable|integer',
            'selectedSection' => 'nullable|integer',
            'selectedRangeCategory' => 'nullable|integer',
            'selectedEquipmentType' => 'nullable|integer',
            'actual_user' => 'nullable|string',
            'sex' => 'nullable|string',
            'year_acquired' => 'nullable|string',
            'remarks' => 'nullable|string',
            'status' => 'nullable|integer',
            'shelf_life' => 'nullable|string',
        ]);
        // Validate the incoming request data
        $validatedData = $request->validate([
            'inventory_id' => 'required|integer',
            'item_name' => 'required|string',
            'quantity' => 'required|integer',
            'previous_quantity' => 'required|integer',
            'current_quantity' => 'required|integer',
            'source_location' => 'nullable|string',
            'destination_location' => 'nullable|string',
            'transaction_date' => 'required|date',
            'remarks' => 'nullable|string',
            'user_id' => 'required|integer',
        ]);

        try {
            // Insert the data into the database
            $transactionLog = InventoryTransaction::create([
                'transaction_type' => "Add",
                'inventory_id' => $validatedData['inventory_id'],
                'item_name' => $validatedData['item_name'],
                'quantity' => $validatedData['quantity'],
                'previous_quantity' => $validatedData['previous_quantity'],
                'current_quantity' => $validatedData['current_quantity'],
                'source_location' => $validatedData['source_location'],
                'destination_location' => $validatedData['destination_location'],
                'transaction_date' => $validatedData['transaction_date'],
                'remarks' => $validatedData['remarks'],
                'user_id' => $validatedData['user_id'],
            ]);

            // Return a success response
            return response()->json([
                'message' => 'Transaction log created successfully!',
                'data' => $transactionLog,
            ], 201);
        } catch (\Exception $e) {
            // Handle exceptions
            return response()->json([
                'message' => 'Failed to create transaction log.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
