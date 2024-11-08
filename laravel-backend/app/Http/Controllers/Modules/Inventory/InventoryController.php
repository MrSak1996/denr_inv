<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Models\GeneralInformation;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;

class InventoryController extends Controller
{
    public function getControlNo($cur_year = '2024')
    {
        $results = DB::table('tbl_general_info as gi')
            ->select(DB::raw('COUNT(*)+1 as control_no'))
            ->whereYear('created_at', $cur_year)
            ->get();
        return response()->json($results);
    }

    public function getDivision()
    {
        $results = DB::table('tbl_division')
            ->select(DB::raw('id,division_title,acronym'))
            ->get();
        return response()->json($results);
    }

    public function getNatureWork()
    {
        $results = DB::table('tbl_nature_of_work')
            ->select(DB::raw('id,nature_work_title'))
            ->get();
        return response()->json($results);
    }

    public function getEquipment()
    {
        $results = DB::table('tbl_equipment_type')
            ->select(DB::raw('id,equipment_title'))
            ->get();
        return response()->json($results);
    }

    public function getRangeCategory()
    {
        $results = DB::table('tbl_range_category')
        ->select(DB::raw('id,range_title'))
        ->get();
        return response()->json($results);
    }
    public function getEmploymentType()
    {
        $results = DB::table('tbl_employment_type')
        ->select(DB::raw('id,employment_title'))
        ->get();
        return response()->json($results);
    }

    public function post_insert_gen_info(Request $req)
    {
        $validated = $req->validate([
            'control_no' => 'required|string',
            'qr_code' => 'nullable|string',
            'acct_person' => 'nullable|string',
            'employmentType' => 'nullable|string',
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
        ]);

        // Insert the data into the GeneralInformation model
        $equipment = GeneralInformation::create([
            'control_no' => $validated['control_no'],
            'qr_code' => $validated['qr_code'],
            'acct_person' => $validated['acct_person'],
            'actual_user' => $validated['actual_user'],
            'employment_type' => $validated['employmentType'],
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'property_no' => $validated['property_no'],
            'serial_no' => $validated['serial_no'],
            'acquisition_cost' => $validated['aquisition_cost'],
            'processor' => $validated['processor'],
            'division_id' => $validated['selectedDivision'],
            'acct_person_division_id' => $validated['selectedAcctDivision'],
            'actual_user_division_id' => $validated['selectedActualDivision'],
            'actual_employment_type' => $validated['employmentType'],
            'work_nature_id' => $validated['selectedWorkNature'],
            'section_id' => $validated['selectedSection'],
            'range_category' => $validated['selectedRangeCategory'],
            'equipment_type' => $validated['selectedEquipmentType'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Return a response with the created ID and a success message
        return response()->json([
            'message' => 'Data saved successfully.',
            'id' => $equipment->id, // Returning the ID of the newly created record
        ], 200);
    }

    public function retriveDataviaAPI(Request $request)
    {
        $id = $request->query('id');

        $results = DB::table('tbl_general_info')
            ->select(DB::raw(
                'id, 
                control_no, 
                division_id as selectedDivision, 
                section_id as selectedSection, 
                acct_person, 
                acct_person_division_id as selectedAcctDivision , 
                actual_user, 
                actual_user_division_id as selectedActualDivision, 
                actual_employment_type as employmentType , 
                work_nature_id as selectedWorkNature, 
                qr_code, 
                equipment_type as selectedEquipmentType, 
                brand, 
                model, 
                property_no,
                serial_no, 
                range_category as selectedRangeCategory, 
                acquisition_cost, 
                year_acquired, 
                created_at,
                updated_at'))  
            ->where('id', $id)
            ->get();

        return response()->json($results);
    }
}
