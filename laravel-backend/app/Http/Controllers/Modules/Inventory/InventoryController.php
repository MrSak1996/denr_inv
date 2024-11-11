<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Models\GeneralInformation;
use App\Models\SpecificationInformation;
use App\Models\SoftwareInstall;
use App\Models\PeripheralInformation;
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
                updated_at'
            ))
            ->where('id', $id)
            ->get();

        return response()->json($results);
    }

    public function retrieveSpecsData(Request $request)
    {
        $id = $request->query('id');

        $results = DB::table('tbl_specification')
            ->select(DB::raw(
                'id, 
                 control_id,
                 processor as specs_processor, 
                 ram_type as specs_ram, 
                 ram_capacity as specs_ram_capacity, 
                 dedicated_information as specs_gpu_dedic_info, 
                 no_of_hdd as specs_hdd, 
                 hdd_capacity as specs_hdd_capacity, 
                 no_of_ssd as specs_ssd, 
                 ssd_capacity as specs_ssd_capacity, 
                 specs_net, 
                 wireless_type as specs_net_iswireless, 
                 created_at, 
                 updated_at'
            ))
            ->where('control_id', $id)
            ->get();

        return response()->json($results);
    }

    // C R U D
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
        $equipment = GeneralInformation::updateOrCreate(
            ['control_no' => $validated['control_no']],
            [
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
            ]
        );

        // Return a response with the created ID and a success message
        return response()->json([
            'message' => 'Data saved successfully.',
            'id' => $equipment->id, // Returning the ID of the newly created record
        ], 200);
    }

    public function post_insert_specs_info(Request $request)
    {
        $request->merge([
            'specs_gpu' => (int) $request->input('specs_gpu'),
            'specs_net' => (int) $request->input('specs_net'),
            'specs_ram' => (int) $request->input('specs_ram'),
        ]);

        // Validate input data
        $validatedData = $request->validate([
            'control_id' => 'nullable|integer',
            'specs_processor' => 'nullable|string|max:255',
            'specs_hdd' => 'nullable|integer',
            'specs_hdd_capacity' => 'nullable|string|max:255',
            'specs_ram' => 'nullable|integer',
            'specs_ram_capacity' => 'nullable|string|max:255',
            'specs_ssd' => 'nullable|integer',
            'specs_ssd_capacity' => 'nullable|string|max:255',
            'specs_gpu_dedic_info' => 'nullable|string|max:255',
            'specs_net' => 'nullable|integer',
            'specs_net_iswireless' => 'nullable|integer',
        ]);

        // Check if a record with the given control_id already exists
        $specsInfo = SpecificationInformation::updateOrCreate(
            ['control_id' => $validatedData['control_id']], // Check by control_id
            [
                'processor' => $validatedData['specs_processor'],
                'ram_type' => $validatedData['specs_ram'],
                'ram_capacity' => $validatedData['specs_ram_capacity'],
                'dedicated_information' => $validatedData['specs_gpu_dedic_info'],
                'no_of_hdd' => $validatedData['specs_hdd'],
                'hdd_capacity' => $validatedData['specs_hdd_capacity'],
                'no_of_ssd' => $validatedData['specs_ssd'],
                'ssd_capacity' => $validatedData['specs_ssd_capacity'],
                'specs_net' => $validatedData['specs_net'],
                'wireless_type' => $validatedData['specs_net_iswireless'],
            ]
        );

        // Return a response
        return response()->json([
            'message' => $specsInfo->wasRecentlyCreated ? 'Data saved successfully.' : 'Data updated successfully.',
            'id' => $specsInfo->control_id, // Returning the ID of the created or updated record
        ], 200);
    }

    public function post_insert_software(Request $request)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'control_id' => 'required|integer',
            'adobe_pdf' => 'required|string',
            'adobe_photoshop' => 'required|string',
            'arcgis' => 'required|string',
            'autocad' => 'required|string',
            'ms_office' => 'required|string',
            'operating_system' => 'required|string',
        ]);

        // Loop through each software and remarks pair and insert into the database
        foreach ($validated as $software => $remarks) {
            if ($software !== 'control_id') { // Skip the control_id key
                SoftwareInstall::create([
                    'control_id' => $validated['control_id'],  // Control ID
                    'software' => $software,                    // Software name (e.g., 'adobe_pdf')
                    'remarks' => $remarks                       // Remarks value (e.g., 'subscription')
                ]);
            }
        }

        return response()->json(['message' => 'Data inserted successfully'], 200);
    }

    public function post_insert_peripheral(Request $request)
    {
        $validatedData = $request->validate([
            'control_id' => 'required|string',
            'monitor1QrCode' => 'nullable|string',
            'monitor1BrandModel' => 'nullable|string',
            'monitor1SerialNumber' => 'nullable|string',
            'monitor1PropertyNumber' => 'nullable|string',
            'monitor1AccountPersonInPN' => 'nullable|string',
            'monitor1ActualUser' => 'nullable|string',
            'monitor2QrCode' => 'nullable|string',
            'monitor2BrandModel' => 'nullable|string',
            'monitor2SerialNumber' => 'nullable|string',
            'monitor2PropertyNumber' => 'nullable|string',
            'monitor2AccountPersonInPN' => 'nullable|string',
            'monitor2ActualUser' => 'nullable|string',
            'ups_qr_code' => 'nullable|string',
            'ups_accountPersonInPN' => 'nullable|string',
            'ups_qr_acctual_user' => 'nullable|string',
            'ups_property_no' => 'nullable|string',
            'ups_serial_no' => 'nullable|string',
        ]);

        // Map the validated data to match the fillable attributes of the PeripheralInformation model
        $peripheralData = [
            'control_id' => $validatedData['control_id'],
            'mon_qr_code1' => $validatedData['monitor1QrCode'],
            'mon_brand_model1' => $validatedData['monitor1BrandModel'],
            'mon_sn1' => $validatedData['monitor1SerialNumber'],
            'mon_pro_no1' => $validatedData['monitor1PropertyNumber'],
            'mon_acct_user1' => $validatedData['monitor1AccountPersonInPN'],
            'mon_actual_user1' => $validatedData['monitor1ActualUser'],
            'mon_qr_code2' => $validatedData['monitor2QrCode'],
            'mon_brand_model2' => $validatedData['monitor2BrandModel'],
            'mon_sn2' => $validatedData['monitor2SerialNumber'],
            'mon_pro_no2' => $validatedData['monitor2PropertyNumber'],
            'mon_acct_user2' => $validatedData['monitor2AccountPersonInPN'],
            'mon_actual_user2' => $validatedData['monitor2ActualUser'],
            'ups_qr_code' => $validatedData['ups_qr_code'],
            'ups_acct_user' => $validatedData['ups_accountPersonInPN'],
            'ups_actual_user' => $validatedData['ups_qr_acctual_user'],
            'ups_property_no' => $validatedData['ups_property_no'],
            'ups_sn' => $validatedData['ups_serial_no'],
        ];

        // Insert the data into the database
        $peripheral = PeripheralInformation::create($peripheralData);

        // Return a response
        return response()->json([
            'message' => 'Peripheral information saved successfully',
            'data' => $peripheral,
        ], 201);
    }
}
