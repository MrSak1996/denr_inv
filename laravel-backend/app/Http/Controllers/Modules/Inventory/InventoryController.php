<?php

namespace App\Http\Controllers\Modules\Inventory;

use App\Models\GeneralInformation;
use App\Models\SpecificationInformation;
use App\Models\SoftwareInstall;
use App\Models\PeripheralInformation;
use App\Models\InventoryTransaction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill; // Import the Fill class for styling


use DB;

class InventoryController extends Controller
{
    public function getControlNo(Request $req)
    {
        try {
            DB::beginTransaction();

            // Validate if userId exists
            $userId = $req->query('id');
            if (!$userId) {
                return response()->json(['error' => 'User ID is required.'], 400);
            }

            // Fetch user data and validate existence
            $user = DB::table('users')
                ->select('roles')
                ->where('id', $userId)
                ->first();

            if (!$user) {
                return response()->json(['error' => 'User not found.'], 404);
            }

            $registered_loc = $user->roles; // Get the role of the user

            // Fetch the current counter for the year 2025
            $results = DB::table('tbl_general_info as gi')
                ->select(DB::raw('COUNT(*)+1 as control_no'))
                ->lockForUpdate()
                ->first();

            $counter = $results->control_no ?? 1; // Default to 1 if no records exist

            // Generate the control number
            $newCounter = str_pad($counter, 5, '0', STR_PAD_LEFT);
            $controlNo = 'R4A-RICT-' . $newCounter;

            // Insert the new record into the database
            DB::table('tbl_general_info')->insert([
                'control_no' => $controlNo,
                'registered_loc' => $registered_loc,
                'updated_by' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            // Return the generated control number
            return response()->json(['control_no' => $controlNo]);
        } catch (\Exception $e) {
            DB::rollBack();

            // Log the error for debugging
            \Log::error('Error generating control number: ' . $e->getMessage());

            // Return a generic error message
            return response()->json(['error' => $e], 500);
        }
    }

    public function generateQRCode(Request $req, $cur_year = '2024')
    {
        // Step 1: Retrieve province and municipality codes based on the user ID

        $userId = $req->query('id');
        $item_id = $req->query('item_id');
        $form_tracker = $req->query('tab_form');

        $userInfo = DB::table('users as u')
            ->leftJoin('user_roles as ur', 'ur.id', '=', 'u.roles')
            ->select(DB::raw('ur.code_title,ur.code'))
            ->where('u.id', $userId)
            ->first();

        if (!$userInfo) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $ccode = '4A' . $userInfo->code_title . 'ICT';

        // Step 2: Retrieve and increment the counter from tbl_config
        $config = DB::table('tbl_config')->where('code', $ccode)->first();

        if (!$config) {
            return response()->json(['error' => 'Configuration not found'], 404);
        }

        $counter = $config->counter + 1;
        // Step 3: Format the counter with leading zeros
        if ($counter > 9999) {
            $newCounter = $counter;
        } elseif ($counter > 999) {
            $newCounter = '0' . $counter;
        } elseif ($counter < 10) {
            $newCounter = '0000' . $counter;
        } elseif ($counter < 99) {
            $newCounter = '000' . $counter;
        } elseif ($counter > 99 && $counter <= 999) {
            $newCounter = '00' . $counter;
        }

        // Step 4: Update the counter in tbl_config
        DB::table('tbl_config')
            ->where('id', $config->id)
            ->update(['counter' => $newCounter]);

        // Step 5: Generate the control number
        $controlNo = $ccode . '' . $newCounter;

        //Step 6: Save QR Code
        switch ($form_tracker) {
            case 'genForm':
                DB::table('tbl_general_info')
                    ->where('id', $item_id)
                    ->update(['qr_code' => $controlNo]);
                break;
            case 'p1Form':
                DB::table('tbl_peripherals')
                    ->where('control_id', $item_id)
                    ->update(['mon_qr_code1' => $controlNo]);
                break;
            case 'p2Form':

                DB::table('tbl_peripherals')
                    ->where('control_id', $item_id)
                    ->update(['mon_qr_code2' => $controlNo]);
                break;
            case 'upsForm':
                DB::table('tbl_peripherals')
                    ->where('control_id', $item_id)
                    ->update(['ups_qr_code' => $controlNo]);
                break;

            default:
                # code...
                break;
        }




        return response()->json(['control_no' => $controlNo]);
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
            ->orWhere('qr_code', $id) // Add OR condition for qr_code
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
                monitor1Model,
                monitor2Model,
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
                ups_brand,
                ups_model,
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

    public function getInventoryData(Request $request)
    {
        $api_token = $request->query('api_token');
        $designation = $request->query('designation');


        $equipmentData = DB::table('tbl_general_info as gi')
            ->leftJoin('tbl_specification as s', 's.control_id', '=', 'gi.id')
            ->leftJoin('tbl_peripherals as p', 'p.control_id', '=', 'gi.id')
            ->leftJoin('tbl_division as acct_division', 'acct_division.id', '=', 'gi.acct_person_division_id')
            ->leftJoin('tbl_division as actual_division', 'actual_division.id', '=', 'gi.actual_user_division_id')
            ->leftJoin('tbl_equipment_type as eq_t', 'eq_t.id', '=', 'gi.equipment_type')
            ->leftJoin('user_roles as ur', 'ur.id', '=', 'gi.registered_loc')
            ->leftJoin('users as u', 'u.roles', '=', 'gi.registered_loc')
            ->select(
                'gi.id',
                'ur.roles as registered_loc',
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
            ->orderBy('id', 'asc')
            // ->where('qr_code', 'LIKE', '%-%')
            ->groupBy(
                'gi.id',
                'ur.roles',
                'gi.status',
                'gi.qr_code',
                'p.mon_qr_code1',
                'p.mon_qr_code2',
                'p.ups_qr_code',
                'gi.control_no',
                'actual_division.division_title',
                'eq_t.equipment_title',
                'gi.brand',
                'gi.range_category',
                'gi.acct_person',
                'acct_division.division_title',
                'gi.actual_user',
                's.processor',
                's.ram_type',
                's.ram_capacity',
                's.dedicated_information',
                's.no_of_hdd',
                's.no_of_ssd',
                's.ssd_capacity',
                's.specs_gpu',
                's.wireless_type',
                'gi.range_category'

            );
        if ($designation !== "Regional Office") {
            $equipmentData->where('u.api_token', $api_token)
                ->where('g.qr_code', 'LIKE', '%4AICT%')
                ->whereNotNull('g.division_id')
                ->whereNotNull('g.equipment_type')
                ->whereNotNull('g.year_acquired')
                ->whereRaw("g.division_id != '' AND g.equipment_type != '' AND g.year_acquired != ''");
        }



        // Execute the query
        $equipmentData = $equipmentData->get();


        $rowCount = $equipmentData->count();


        return response()->json(
            [
                'data' => $equipmentData,
                'count' => $rowCount,
                'total' => $rowCount
            ]
        );
    }

    public function fetchTransaction(Request $request)
    {
        try {
            // Fetch transaction logs with the specified columns
            $transaction_logs = DB::table('inventory_transaction_logs as i')
                ->select(
                    'i.id',
                    'transaction_type',
                    'i.gen_info_id',
                    'i.inventory_id',
                    'i.accountable_user',
                    'e.equipment_title',
                    'd.division_title as source_location',
                    'dd.division_title as destination_location',
                    'i.transaction_date',
                    'i.remarks',
                    DB::raw('CONCAT(u.first_name, " ", u.last_name) AS updated_by'),
                    'g.qr_code',
                    'i.created_at',
                    'i.updated_at'
                )
                ->leftJoin('tbl_general_info as g', 'g.id', '=', 'i.gen_info_id')
                ->leftJoin('tbl_division as d', 'd.id', '=', 'i.source_location')
                ->leftJoin('tbl_division as dd', 'dd.id', '=', 'i.destination_location')
                ->leftJoin('users as u', 'u.id', '=', 'i.user_id')
                ->leftJoin('tbl_equipment_type as e', 'e.id', '=', 'g.equipment_type')
                ->orderByDesc('i.id')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $transaction_logs
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function getCountStatus(Request $request)
    {
        $designation = $request->query('designation');
        $query = DB::table('vw_count_status');
        if (!empty($designation)) {
            $query->where('registered_loc', $designation);
        }
        $data = $query->get();

        return response()->json($data);
    }

    public function getOutdatedEquipment(Request $request)
    {
        $api_token = $request->query('api_token');
        $designation = $request->query('designation');
        $query = DB::table('vw_count_outdated');
        if (!empty($designation)) {
            $query->where('registered_loc', $designation);
        }
        $data = $query->get();

        return response()->json($data);
    }

    public function checkItemStatus(Request $request)
    {
        $itemId = $request->query('itemId');

        // Perform the join query
        $exists = DB::table('tbl_general_info as gi')
            ->join('tbl_item_status as is', 'gi.item_status', '=', 'is.id')
            ->select('is.status_title')
            ->where('gi.id', $itemId)
            ->get();

        return response()->json($exists);
    }
    // REACT NATIVE API

    public function fetchNativeAPI(Request $req)
    {
        $qr_code_val = $req->query('id');
        $data = DB::table('tbl_general_info as g')
            ->leftJoin('tbl_specification as s', 's.control_id', '=', 'g.id')
            ->leftJoin('tbl_software_install as si', 'si.control_id', '=', 'g.id')
            ->leftJoin('tbl_division as d', 'd.id', '=', 'g.division_id')
            ->leftJoin('tbl_employment_type as et', 'et.id', '=', 'g.actual_employment_type')
            ->leftJoin('tbl_nature_of_work as nw', 'nw.id', '=', 'g.work_nature_id')
            ->leftJoin('tbl_equipment_type as e', 'e.id', '=', 'g.equipment_type')
            ->leftJoin('tbl_range_category as rc', 'rc.id', '=', 'g.range_category')
            ->leftJoin('tbl_peripherals as p', 'p.control_id', '=', 'g.id')
            ->select(
                'g.id as control_id',
                'g.control_no',
                'g.qr_code',
                'g.division_id',
                'd.division_title',
                'g.acct_person',
                'g.actual_user',
                'g.actual_employment_type',
                'et.employment_title',
                'g.work_nature_id',
                'nw.nature_work_title',
                'g.equipment_type',
                'e.equipment_title',
                'g.property_no',
                'g.serial_no',
                'g.brand',
                'g.model',
                'g.year_acquired',
                's.specs_net',
                's.specs_gpu',
                's.ram_type',
                'g.acquisition_cost',
                'g.range_category',
                'rc.range_title',
                's.processor',
                's.dedicated_information',
                's.ram_capacity',
                's.no_of_hdd',
                's.hdd_capacity',
                's.wireless_type',
                'g.os_installed',
                'p.mon_brand_model1',
                'p.mon_brand_model2',
                'p.monitor1Model',
                'mon_brand_model1',
                'mon_brand_model2',
                'monitor1Model',
                'monitor2Model',
                'mon_sn1',
                'mon_sn2',
                'mon_qr_code1',
                'mon_qr_code2',
                'mon_pro_no1',
                'mon_pro_no2',
                'mon_acct_user1',
                'mon_acct_user2',
                'mon_actual_user1',
                'mon_actual_user2',
                'ups_qr_code',
                'ups_brand',
                'ups_model',
                'ups_acct_user',
                'ups_actual_user',
                'ups_property_no',
                'ups_sn',
                'monitor1Status',
                'monitor2Status'
            )
            ->where('g.qr_code', $qr_code_val)
            ->groupBy(
                'g.id',
                'g.qr_code',
                'g.control_no',
                'g.division_id',
                'd.division_title',
                'g.acct_person',
                'g.actual_user',
                'g.actual_employment_type',
                'et.employment_title',
                'g.work_nature_id',
                'nw.nature_work_title',
                'g.equipment_type',
                'e.equipment_title',
                'g.property_no',
                'g.serial_no',
                'g.brand',
                'g.model',
                'g.year_acquired',
                's.specs_net',
                'g.acquisition_cost',
                'g.range_category',
                'rc.range_title',
                's.processor',
                's.specs_gpu',
                's.dedicated_information',
                's.ram_type',
                's.ram_capacity',
                's.no_of_hdd',
                's.hdd_capacity',
                's.wireless_type',
                'g.os_installed',
                'p.mon_brand_model1',
                'p.mon_brand_model2',
                'p.monitor1Model',
                'mon_brand_model1',
                'mon_brand_model2',
                'monitor1Model',
                'monitor2Model',
                'mon_sn1',
                'mon_sn2',
                'mon_qr_code1',
                'mon_qr_code2',
                'mon_pro_no1',
                'mon_pro_no2',
                'mon_acct_user1',
                'mon_acct_user2',
                'mon_actual_user1',
                'mon_actual_user2',
                'ups_qr_code',
                'ups_brand',
                'ups_model',
                'ups_acct_user',
                'ups_actual_user',
                'ups_property_no',
                'ups_sn',
                'monitor1Status',
                'monitor2Status',
            )
            ->get();

        return response()->json($data);
    }
    public function fetchNatureWork()
    {
        // Fetch data from the database
        $data = DB::table('tbl_nature_of_work')->get(['id', 'nature_work_title']); // Assuming 'nature_of_work' is the table name

        // Transform the data
        $transformedData = $data->map(function ($item) {
            return [
                'label' => $item->nature_work_title,
                'id' => $item->id
            ];
        });

        // Return the transformed data as JSON
        return response()->json($transformedData);
    }
    public function fetchRangeEntry()
    {
        // Fetch data from the database
        $data = DB::table('tbl_range_category')->get(['id', 'range_title']); // Assuming 'nature_of_work' is the table name

        // Transform the data
        $transformedData = $data->map(function ($item) {
            return [
                'label' => $item->range_title,
                'id' => $item->id
            ];
        });

        // Return the transformed data as JSON
        return response()->json($transformedData);
    }
    public function fetchEmploymentType()
    {
        // Fetch data from the database
        $data = DB::table('tbl_employment_type')->get(['id', 'employment_title']); // Assuming 'nature_of_work' is the table name

        // Transform the data
        $transformedData = $data->map(function ($item) {
            return [
                'label' => $item->employment_title,
                'id' => $item->id
            ];
        });

        // Return the transformed data as JSON
        return response()->json($transformedData);
    }
    public function fetchEquipment()
    {
        $results = DB::table('tbl_equipment_type')->get(['id', 'equipment_title']);
        $transformedData = $results->map(function ($item) {
            return [
                'label' => $item->equipment_title,
                'id' => $item->id
            ];
        });

        // Return the transformed data as JSON
        return response()->json($transformedData);
    }
    public function fetchDivisionData()
    {
        $results = DB::table('tbl_division')->get(['id', 'division_title']);
        $transformedData = $results->map(function ($item) {
            return [
                'label' => $item->division_title,
                'id' => $item->id
            ];
        });

        // Return the transformed data as JSON
        return response()->json($transformedData);
    }

    public function updateUser(Request $request)
    {
        try {
            // Validate incoming data
            $validatedData = $request->validate([
                'qr_code' => 'required|string',
                'division' => 'nullable|string',
                'user' => 'nullable|string',
                'control_no' => 'nullable|string',
                'division_id' => 'nullable|numeric',
                'acct_person' => 'nullable|string',
                'actual_user' => 'nullable|string',
                'actual_employment_type' => 'nullable|numeric',
                'employment_title' => 'nullable|string',
                'work_nature_id' => 'nullable|numeric',
                'equipment_type' => 'nullable|numeric',
                'equipment_title' => 'nullable|string',
                'property_no' => 'nullable|string',
                'serial_no' => 'nullable|string',
                'brand' => 'nullable|string',
                'model' => 'nullable|string',
                'year_acquired' => 'nullable|integer',
                'acquisition_cost' => 'nullable|numeric',
                'range_category' => 'nullable|numeric',
                'range_title' => 'nullable|string',
                'os_installed' => 'nullable|string',
                'processor' => 'nullable|string',
                'specs_net' => 'nullable|numeric',
                'specs_gpu' => 'nullable|numeric',
                'dedicated_information' => 'nullable|string',
                'ram_type' => 'nullable|numeric',
                'ram_capacity' => 'nullable|string',
                'no_of_hdd' => 'nullable|integer',
                'hdd_capacity' => 'nullable|string',
                'wireless_type' => 'nullable|numeric',
            ]);

            // Start a transaction
            DB::beginTransaction();

            // Find the existing record by qr_code
            $data = GeneralInformation::where('qr_code', $validatedData['qr_code'])->first();
            if (!$data) {
                return response()->json([
                    'message' => 'Record not found for the given QR Code.',
                ], 404);
            }

            // Update the record with the validated data
            $data->update($validatedData);

            // Update specifications data
            DB::table('tbl_specification')
                ->where('control_id', $data->id)
                ->update([
                    'processor' => $validatedData['processor'],
                    'specs_net' => $validatedData['specs_net'],
                    'specs_gpu' => $validatedData['specs_gpu'],
                    'dedicated_information' => $validatedData['dedicated_information'],
                    'ram_type' => $validatedData['ram_type'],
                    'ram_capacity' => $validatedData['ram_capacity'],
                    'no_of_hdd' => $validatedData['no_of_hdd'],
                    'hdd_capacity' => $validatedData['hdd_capacity'],
                    // 'wireless_type' => $validatedData['wireless_type'],
                ]);

            // Commit the transaction
            DB::commit();

            return response()->json([
                'message' => 'Record updated successfully!',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            // Rollback the transaction if an exception occurs
            DB::rollback();

            return response()->json([
                'message' => 'Failed to update the record.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updatePeripherals(Request $request)
    {
        try {
            // Validate incoming data
            $validatedData = $request->validate([
                'control_id' => 'nullable|numeric',
                'mon_brand_model1' => 'nullable|string',
                'mon_brand_model2' => 'nullable|string',
                'monitor1Model' => 'nullable|string',
                'monitor2Model' => 'nullable|string',
                'mon_sn1' => 'nullable|string',
                'mon_sn2' => 'nullable|string',
                'mon_qr_code1' => 'nullable|string',
                'mon_qr_code2' => 'nullable|string',
                'mon_pro_no1' => 'nullable|string',
                'mon_pro_no2' => 'nullable|string',
                'mon_acct_user1' => 'nullable|string',
                'mon_acct_user2' => 'nullable|string',
                'mon_actual_user1' => 'nullable|string',
                'mon_actual_user2' => 'nullable|string',
                'ups_qr_code' => 'nullable|string',
                'ups_brand' => 'nullable|string',
                'ups_model' => 'nullable|string',
                'ups_acct_user' => 'nullable|string',
                'ups_actual_user' => 'nullable|string',
                'ups_property_no' => 'nullable|string',
                'ups_sn' => 'nullable|string',
                'monitor1Status' => 'nullable|numeric',
                'monitor2Status' => 'nullable|numeric',
            ]);
            DB::beginTransaction();

            // Perform the update query
            $updateResult = DB::table('tbl_peripherals')
                ->where('control_id', $request->input('control_id'))
                ->update([
                    'mon_brand_model1' => $request->input('mon_brand_model1'),
                    'mon_brand_model2' => $request->input('mon_brand_model2'),
                    'monitor1Model' => $request->input('monitor1Model'),
                    'monitor2Model' => $request->input('monitor2Model'),
                    'mon_sn1' => $request->input('mon_sn1'),
                    'mon_sn2' => $request->input('mon_sn2'),
                    'mon_qr_code1' => $request->input('mon_qr_code1'),
                    'mon_qr_code2' => $request->input('mon_qr_code2'),
                    'mon_pro_no1' => $request->input('mon_pro_no1'),
                    'mon_pro_no2' => $request->input('mon_pro_no2'),
                    'mon_acct_user1' => $request->input('mon_acct_user1'),
                    'mon_acct_user2' => $request->input('mon_acct_user2'),
                    'mon_actual_user1' => $request->input('mon_actual_user1'),
                    'mon_actual_user2' => $request->input('mon_actual_user2'),
                    'ups_qr_code' => $request->input('ups_qr_code'),
                    'ups_brand' => $request->input('ups_brand'),
                    'ups_model' => $request->input('ups_model'),
                    'ups_acct_user' => $request->input('ups_acct_user'),
                    'ups_actual_user' => $request->input('ups_actual_user'),
                    'ups_property_no' => $request->input('ups_property_no'),
                    'ups_sn' => $request->input('ups_sn'),
                    'monitor1Status' => $request->input('monitor1Status'),
                    'monitor2Status' => $request->input('monitor2Status'),
                ]);

            // Commit the transaction
            DB::commit();

            // Check if the update was successful
            if ($updateResult) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Peripheral updated successfully.',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No updates were made. Please ensure the control ID exists.',
                ], 400);
            }
        } catch (\Exception $e) {
            // Rollback the transaction if an exception occurs
            DB::rollback();

            return response()->json([
                'message' => 'Failed to update the record.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    // C R U D
    public function post_insert_gen_info(Request $req)
    {


        $user_id = $req->input('id');
        $userInfo = DB::table('users')
            ->select('roles')
            ->where('id', $user_id)
            ->get();

        $registered_loc = $userInfo[0]->roles;

        $validated = $req->validate([
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



        $equipment = GeneralInformation::updateOrCreate(
            ['control_no' => $validated['control_no']],
            [
                'registered_loc' => $registered_loc,
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
                'item_status' => 1, //DRAFT
                'updated_by' => $user_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $transactionLog = InventoryTransaction::create([
            'transaction_type' => "Add",
            'inventory_id' => $equipment->id,
            'transaction_date' => now(),
            'remarks' => 1,
            'source_location' => $equipment->division_id,
            'user_id' => $user_id
        ]);

        if (!empty($validated['selectedEquipmentType'])) {
            DB::table('tbl_equipment_type')
                ->where('id', $validated['selectedEquipmentType']) // Assuming 'id' is the primary key
                ->increment('quantity'); // Increment the quantity by 1
        }

        return response()->json([
            'message' => 'Data saved successfully.',
            'id' => $equipment->id,
            'logs' => $transactionLog->id
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
        if ($request->input('specs_net') === 1 || $request->input('specs_net') == 3) {
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

    public function post_final_review(Request $request)
    {
        $id = $request->input('id');

        DB::table('tbl_general_info')
            ->where('id', $id)
            ->update(['item_status' => 2]);
    }

    public function getSummaryData(Request $req)
    {

        $data = DB::table('vw_ict_equipment')->get();
        return response()->json(
            [
                'data' => $data,
            ]
        );
    }

    public function getQRCodeTemp(Request $req)
    {
        $user_role = $req->query('user_role');

        $sql = DB::table('tbl_config as tc')
            ->select('tc.id', 'tc.code')
            ->leftJoin('user_roles as ur', 'ur.id', '=', 'tc.id')
            ->where('tc.id', $user_role)
            ->get();

        return response()->json($sql);
    }
    public function get_equipment(Request $req)
    {
        try {
            $item_id = $req->query('item_id');

            $results = DB::table('tbl_equipment_type')
                ->select(DB::raw('id,equipment_title'))
                ->where('id', $item_id)
                ->get();
            return response()->json($results);
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    public function transfer(Request $req)
    {
        try {
            // Validate incoming request
            $validatedData = $req->validate([
                'source_div' => 'required|exists:tbl_division,id',
                'target_div' => 'required|exists:tbl_division,id',
                'acct_person' => 'nullable|string|max:255',
                'actual_user' => 'nullable|string|max:255',
                'status' => 'required|numeric',
                'remarks' => 'nullable|string',
                'item_id' => 'nullable|numeric',
                'gen_info_id' => 'nullable|numeric',
            ]);

            $transactionLog = InventoryTransaction::create([
                'transaction_type' => "Transfer",
                'gen_info_id' => $validatedData['gen_info_id'],
                'accountable_user' => $validatedData['acct_person'],
                'inventory_id' => $validatedData['item_id'],
                'transaction_date' => now(),
                'remarks' => $validatedData['remarks'] ?? '',
                'status' => $validatedData['status'],
                'source_location' => $validatedData['source_div'],
                'destination_location' => $validatedData['target_div'],
                'user_id' => $req->input('id')
            ]);

            GeneralInformation::where('id', $validatedData['gen_info_id'])->update([
                'division_id' => $validatedData['target_div'],
                'acct_person' => $validatedData['acct_person'],
                'actual_user' => $validatedData['actual_user'],
            ]);

            PeripheralInformation::where('control_id', $validatedData['gen_info_id'])->update([
                'mon_actual_user1' => $validatedData['acct_person'],

            ]);



            return response()->json([
                'success' => true,
                'message' => 'Transfer recorded successfully!',
                'data' => $transactionLog
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing the transfer.',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
