<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Models\GeneralInformation;
use App\Models\SpecificationInformation;
use App\Models\SoftwareInstall;
use App\Models\PeripheralInformation;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill; // Import the Fill class for styling


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
                sex, 
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
                shelf_life, 
                remarks, 
                status, 
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
                 specs_gpu,
                 specs_net,
                 wireless_type as specs_net_iswireless, 
                 created_at, 
                 updated_at'
            ))
            ->where('control_id', $id)
            ->get();

        return response()->json($results);
    }

    public function retrieveSoftwareData(Request $request)
    {
        $id = $request->query('id');

        $results = DB::table('tbl_software_install')
            ->select(DB::raw(
                'id, 
                 control_id,
                 software, 
                 remarks, 
                 created_at, 
                 updated_at'
            ))
            ->where('control_id', $id)
            ->get();

        return response()->json($results);
    }

    public function retrievePeripheralsData(Request $request)
    {
        $id = $request->query('id');

        $results = DB::table('tbl_peripherals')
            ->select(DB::raw(
                'id, 
                control_id, 
                mon_brand_model1 as monitor1BrandModel, 
                mon_brand_model2 as monitor2BrandModel, 
                mon_sn1 as monitor1SerialNumber, 
                mon_sn2 monitor2SerialNumber, 
                mon_qr_code1 as monitor1QrCode, 
                mon_qr_code2 as monitor2QrCode, 
                mon_pro_no1 as monitor1PropertyNumber, 
                mon_pro_no2 as monitor2PropertyNumber, 
                mon_acct_user1 as monitor1AccountPersonInPN, 
                mon_acct_user2 as monitor2AccountPersonInPN, 
                mon_actual_user1 as monitor1ActualUser, 
                mon_actual_user2 as monitor2ActualUser, 
                ups_qr_code, 
                ups_acct_user as ups_accountPersonInPN, 
                ups_actual_user as ups_qr_acctual_user, 
                ups_property_no, 
                ups_sn as ups_serial_no,
                monitor1Status, 
                monitor2Status, 
                ups_status', 
            ))
            ->where('control_id', $id)
            ->get();

        return response()->json($results);
    }

    public function getInventoryData()
    {
        $equipmentData = DB::table('tbl_general_info as gi')
            ->leftJoin('tbl_specification as s', 's.control_id', '=', 'gi.id')
            ->leftJoin('tbl_peripherals as p', 'p.control_id', '=', 'gi.id')
            ->leftJoin('tbl_division as acct_division', 'acct_division.id', '=', 'gi.acct_person_division_id')
            ->leftJoin('tbl_division as actual_division', 'actual_division.id', '=', 'gi.actual_user_division_id')
            ->leftJoin('tbl_equipment_type as eq_t', 'eq_t.id', '=', 'gi.equipment_type')
            ->select(
                'gi.id',
                'gi.status',
                DB::raw("
                 CASE 
                            WHEN gi.status = 1 THEN 'Serviceable'
                            WHEN gi.status = 2 THEN 'Unserviceable'
                            ELSE ''
                END as status"),
                'gi.qr_code',
                'p.mon_qr_code1',
                'p.mon_qr_code2',
                'p.ups_qr_code',
                'gi.control_no',
                'actual_division.division_title as actual_division_title',
                'eq_t.equipment_title',
                'gi.brand',
                DB::raw("CONCAT(
                        COALESCE(s.processor, ''), CHAR(10),
                        CASE 
                            WHEN s.ram_type = 1 THEN 'Static RAM'
                            WHEN s.ram_type = 2 THEN '(SDRAM)'
                            WHEN s.ram_type = 4 THEN 'Single Data Rate Synchronous Dynamic RAM'
                            WHEN s.ram_type = 5 THEN 'DDR2'
                            WHEN s.ram_type = 6 THEN 'DDR3'
                            WHEN s.ram_type = 7 THEN 'DDR4'
                            WHEN s.ram_type = 8 THEN 'GDDR'
                            WHEN s.ram_type = 9 THEN 'SDRAM'
                            WHEN s.ram_type = 10 THEN 'GDDR2'
                            WHEN s.ram_type = 11 THEN 'GDDR3'
                            WHEN s.ram_type = 12 THEN 'GDDR4'
                            WHEN s.ram_type = 13 THEN 'GDDR5'
                            WHEN s.ram_type = 14 THEN 'Flash Memory'
                            ELSE 'Unknown RAM'
                        END, CHAR(10),
                        COALESCE(s.ram_capacity, ''), CHAR(10),
                        COALESCE(s.dedicated_information, ''), CHAR(10),
                        CONCAT('HDD NO: ', COALESCE(s.no_of_hdd, '0')), CHAR(10),
                        CONCAT('SSD NO: ', COALESCE(s.no_of_ssd, '0')), CHAR(10),
                        COALESCE(s.ssd_capacity, ''), CHAR(10),
                        CASE 
                            WHEN s.specs_gpu = 1 THEN 'Built In'
                            WHEN s.specs_gpu = 2 THEN 'Dedicated'
                            ELSE 'Unknown'
                        END, CHAR(10),
                        CASE 
                            WHEN s.wireless_type = 1 THEN 'LAN'
                            WHEN s.wireless_type = 2 THEN 'Wireless'
                            WHEN s.wireless_type = 3 THEN 'Both'
                            ELSE 'Unknown'
                        END
                    ) as full_specs"),
                DB::raw("CASE 
                        WHEN gi.range_category = 1 THEN 'Entry Level'
                        WHEN gi.range_category = 2 THEN 'Mid Level'
                        WHEN gi.range_category = 3 THEN 'High End Level'
                        ELSE 'Unknown'
                    END as range_category"),
                'gi.acct_person',
                'acct_division.division_title as acct_division_title',
                'gi.actual_user',
                'actual_division.division_title as actual_division_title'
            )
            ->get();

        return response()->json($equipmentData);
    }

    // C R U D
    public function post_insert_gen_info(Request $req)
    {
        $validated = $req->validate([
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
                'sex' => $validated['sex'],
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
                'year_acquired' => $validated['year_acquired'],
                'remarks' => $validated['remarks'],
                'status' => $validated['status'],
                'shelf_life' => $validated['shelf_life'],
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
            'specs_net' => (int) $request->input('specs_net'),
            'specs_gpu' => (int) $request->input('specs_gpu'),
            'specs_ram' => (int) $request->input('specs_ram'),
            'specs_net_iswireless' => (int) $request->input('specs_net_iswireless'),
        ]);
        if ($request->input('specs_net') === 1 || $request->input('specs_net') == 3 ) {
            $request->merge(['specs_net_iswireless' => null]);
        }
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
            'specs_gpu' => 'nullable|integer',
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
                'specs_gpu' => $validatedData['specs_gpu'],
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
        // Validate the incoming request
        $validated = $request->validate([
            'control_id' => 'required|integer',
            'selectedSoftware' => 'required|array', // Ensure selectedSoftware is an array
            'selectedSoftware.*' => 'required|string', // Ensure each value in selectedSoftware is a string
        ]);

        // Loop through each software and insert into the database
        foreach ($validated['selectedSoftware'] as $software => $remarks) {
            // Insert into the SoftwareInstall model (assuming it has the necessary columns)
            SoftwareInstall::create(
                [
                    'control_id' => $validated['control_id'],  // Control ID
                    'software' => $software,                    // Software name (e.g., 'adobe_pdf')
                    'remarks' => $remarks                       // Remarks value (1, 2, or 3)
                ]
            );
        }

        // Return a success response
        return response()->json(['message' => 'Data inserted successfully'], 200);
    }

    public function post_insert_peripheral(Request $request)
    {
        $validatedData = $request->validate([
            'control_id' => 'required|string',
            'monitor1QrCode' => 'nullable|string',
            'monitor1BrandModel' => 'nullable|string',
            'monitor1Model' => 'nullable|string',
            'monitor2Model' => 'nullable|string',
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
            'ups_brand' => 'nullable|string',
            'ups_model' => 'nullable|string',
            'ups_accountPersonInPN' => 'nullable|string',
            'ups_qr_acctual_user' => 'nullable|string',
            'ups_property_no' => 'nullable|string',
            'ups_serial_no' => 'nullable|string',
            'monitor1Status' => 'nullable|integer',
            'monitor2Status' => 'nullable|integer',
            'ups_status' => 'nullable|integer',
        ]);


        // Insert the data into the database
        $peripheral = PeripheralInformation::updateOrCreate(
            ['control_id' => $validatedData['control_id']],
            [
                'mon_qr_code1' => $validatedData['monitor1QrCode'],
                'mon_brand_model1' => $validatedData['monitor1BrandModel'],
                'monitor1Model' => $validatedData['monitor1Model'],
                'monitor2Model' => $validatedData['monitor2Model'],
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
                'ups_brand' => $validatedData['ups_brand'],
                'ups_model' => $validatedData['ups_model'],
                'ups_acct_user' => $validatedData['ups_accountPersonInPN'],
                'ups_actual_user' => $validatedData['ups_qr_acctual_user'],
                'ups_property_no' => $validatedData['ups_property_no'],
                'ups_sn' => $validatedData['ups_serial_no'],
                'monitor1Status' => $validatedData['monitor1Status'],
                'monitor2Status' => $validatedData['monitor2Status'],
                'ups_status' => $validatedData['ups_status'],
            ]
        );

        // Return a response
        return response()->json([
            'message' => 'Peripheral information saved successfully',
            'data' => $peripheral,
        ], 201);
    }

    public function post_add_os(Request $request)
    {
        // Validate incoming request data
        $validatedData = $request->validate([
            'control_id' => 'required|integer', // Control ID to find the record
            'os_installed' => 'required|string|max:255', // New OS value
        ]);

        try {
            // Find the existing record by control_id
            $os = GeneralInformation::where('id', $validatedData['control_id'])->first();

            if (!$os) {
                return response()->json([
                    'message' => 'Record not found for the given Control ID.',
                ], 404);
            }

            // Update the record
            $os->update([
                'os_installed' => $validatedData['os_installed'],
            ]);

            return response()->json([
                'message' => 'Operating System updated successfully!',
                'data' => $os,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update Operating System.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function post_add_msoffice(Request $request)
    {
        // Validate incoming request data
        $validatedData = $request->validate([
            'control_id' => 'required|integer', // Control ID to find the record
            'ms_office_installed' => 'required|string|max:255', // New OS value
        ]);

        try {
            // Find the existing record by control_id
            $os = GeneralInformation::where('id', $validatedData['control_id'])->first();

            if (!$os) {
                return response()->json([
                    'message' => 'Record not found for the given Control ID.',
                ], 404);
            }

            // Update the record
            $os->update([
                'ms_office_installed' => $validatedData['ms_office_installed'],
            ]);

            return response()->json([
                'message' => 'Operating System updated successfully!',
                'data' => $os,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update Operating System.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
