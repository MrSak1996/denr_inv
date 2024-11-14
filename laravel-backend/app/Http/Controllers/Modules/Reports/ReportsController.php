<?php

namespace App\Http\Controllers\Modules\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill; // Import the Fill class for styling
use Maatwebsite\Excel\Facades\Excel;
use DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ReportsController extends Controller
{
    public function generateReport(Request $request)
    {
        if ($request->has('export')) {
            // Define template path
            $templatePath = public_path('templates/denr.xlsx');

            if (!file_exists($templatePath)) {
                return response()->json(['error' => 'Template file not found.'], 404);
            }

            // Load the spreadsheet template
            $spreadsheet = IOFactory::load($templatePath);
            $sheet = $spreadsheet->getActiveSheet();

            // Fetch data from the database
            $data = $this->getInventoryData();

            // Define common style for wrapping text and borders
            $styleArray = [
                'alignment' => [
                    'wrapText' => true,
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
            ];

            // Populate spreadsheet with database data
            $row = 3; // Start from row 2
            foreach ($data as $record) {
                // Populate other fields (you already have this code)
                $sheet->setCellValue('A' . $row, $record->actual_division_title);
                $sheet->setCellValue('D' . $row, $record->equipment_title);
                $sheet->setCellValue('E' . $row, $record->equipment_title);
                $sheet->setCellValue('F' . $row, $record->year_acquired);
                $sheet->setCellValue('G' . $row, $record->shelf_life);
                $sheet->setCellValue('H' . $row, $record->brand);
                $sheet->setCellValue('I' . $row, $record->full_specs);
                $sheet->setCellValue('J' . $row, $record->range_category);
                $sheet->setCellValue('W' . $row, $record->serial_no);
                $sheet->setCellValue('X' . $row, $record->property_no);
                $sheet->setCellValue('Y' . $row, $record->acct_person);
                $sheet->setCellValue('Z' . $row, $record->acct_person);
                $sheet->setCellValue('AB' . $row, $record->acct_division_title);
                $sheet->setCellValue('AC' . $row, $record->employment_title);
                $sheet->setCellValue('AD' . $row, $record->actual_user);
                $sheet->setCellValue('AE' . $row, $record->actual_user);
                $sheet->setCellValue('AG' . $row, $record->employment_title);
                $sheet->setCellValue('AH' . $row, $record->nature_work_title);
                $sheet->setCellValue('AI' . $row, $record->remarks);
                $sheet->setCellValue('AJ' . $row, $record->rict_code);

                // Fetch the software data
                $software_opts = $this->getSoftwareData($record->id);
                $colIndex = 10; // Start at column K (Index 10 in PHPExcel)
                $columns = ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V']; // Columns K to V

                foreach ($software_opts as $index => $item) {
                    // Ensure the current column is within the allowed range
                    if (isset($columns[$index])) {
                        $softwareColumn = $columns[$index * 2]; // Software column (K, M, O, etc.)
                        $remarksColumn = $columns[$index * 2 + 1]; // Remarks column (L, N, P, etc.)

                        // Set the software name in the appropriate column
                        $sheet->setCellValue($softwareColumn . $row, $item->software);
                        // Set the remarks in the next column
                        $sheet->setCellValue($remarksColumn . $row, $item->remarks);
                    }
                }

                // Apply the wrapping text and border style to the entire row at once
                $sheet->getStyle('A' . $row . ':AJ' . $row)->applyFromArray($styleArray);

                $row++;
            }

            // Save to a temporary file
            $tempFile = tempnam(sys_get_temp_dir(), 'denr');
            $writer = new Xlsx($spreadsheet);
            $writer->save($tempFile);

            // Send the file for download and delete after sending
            return response()->download($tempFile, 'denr_ict_inv_2024.xlsx')->deleteFileAfterSend(true);
        } else {
            return response()->json(['error' => 'Export flag missing.'], 400);
        }
    }




    public function getInventoryData()
    {

        $equipmentData = DB::table('tbl_general_info as gi')
            ->leftJoin('tbl_specification as s', 's.control_id', '=', 'gi.id')
            ->leftJoin('tbl_peripherals as p', 'p.control_id', '=', 'gi.id')
            ->leftJoin('tbl_division as acct_division', 'acct_division.id', '=', 'gi.acct_person_division_id')
            ->leftJoin('tbl_division as actual_division', 'actual_division.id', '=', 'gi.actual_user_division_id')
            ->leftJoin('tbl_equipment_type as eq_t', 'eq_t.id', '=', 'gi.equipment_type')
            ->leftJoin('tbl_employment_type as emp', 'emp.id', '=', 'gi.actual_employment_type')
            ->leftJoin('tbl_nature_of_work as nw', 'nw.id', '=', 'gi.work_nature_id')
            ->select(
                'gi.id',
                'gi.control_no',
                'eq_t.equipment_title',
                'gi.year_acquired',
                'gi.shelf_life',
                'gi.brand',
                DB::raw("CONCAT(
                s.processor, CHAR(10),
                CASE 
                    WHEN s.ram_type = 1 THEN 'Static RAM'
                    WHEN s.ram_type = 2 THEN '(SDRAM)'
                    ELSE 'Unknown RAM'
                END, CHAR(10),
                s.ram_capacity, CHAR(10),
                s.dedicated_information, CHAR(10),
                CONCAT('HDD NO: ', s.no_of_hdd), CHAR(10),
                CONCAT('SSD NO: ', s.no_of_ssd), CHAR(10),
                s.ssd_capacity, CHAR(10),
                CASE 
                    WHEN s.specs_gpu = 1 THEN 'Built In'
                    WHEN s.specs_gpu = 2 THEN 'Dedicated'
                    ELSE 'Unknown'
                END, CHAR(10),
                CONCAT('Network Type: ',
                    CASE 
                        WHEN s.wireless_type = 1 THEN 'LAN'
                        WHEN s.wireless_type = 2 THEN 'Wireless'
                        WHEN s.wireless_type = 3 THEN 'Both'
                        ELSE 'Unknown'
                    END)
            ) AS full_specs"),
                DB::raw("CASE 
                WHEN gi.range_category = 1 THEN 'Entry Level'
                WHEN gi.range_category = 2 THEN 'Mid Level'
                WHEN gi.range_category = 3 THEN 'High End Level'
                ELSE 'Unknown'
            END AS range_category"),
                'gi.serial_no',
                'gi.property_no',
                'gi.acct_person',
                'acct_division.division_title as acct_division_title',
                'emp.employment_title',
                'gi.actual_user',
                'actual_division.division_title as actual_division_title',
                'nw.nature_work_title',
                'gi.remarks',
                DB::raw("CONCAT(gi.qr_code, CHAR(10), 'MONITOR 1:', p.mon_qr_code1, CHAR(10), 'MONITOR 2:', p.mon_qr_code2, CHAR(10), 'UPS:', p.ups_qr_code) AS rict_code")
            )
            ->get();

        return $equipmentData;
    }

    public function getSoftwareData($id)
    {
        // Perform the query
        $softwareData = DB::table('tbl_software_install AS si')
            ->leftJoin('tbl_general_info AS gi', 'gi.id', '=', 'si.control_id')
            ->select(
                'si.software',
                DB::raw("CASE 
                    WHEN si.remarks = '1' THEN 'perpetual'
                    WHEN si.remarks = '2' THEN 'subscription'
                    WHEN si.remarks = '3' THEN 'evaluation'
                    ELSE si.remarks
                END AS remarks")
            )
            ->where('control_id', $id)
            ->get();

        // Return the results as JSON
        return $softwareData;
    }
}
