<?php
namespace App\Http\Controllers\Modules\Reports;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Modules\Inventory\InventoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use DB;
use JasperPHP\JasperPHP;
use PHPJasper\PHPJasper;



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
            $data = $this->getInventoryData(request());

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


    public function generateSummaryReport(Request $request, InventoryController $inventoryController)
    {
        $office = $request->query('role_id');

        $currentDateTime = Carbon::now()->format('Y-m-d H:i:s');
        $roleMapping = [
            1 => "PENRO CAVITE",
            2 => "PENRO LAGUNA",
            3 => "PENRO BATANGAS",
            4 => "PENRO RIZAL",
            5 => "PENRO QUEZON",
            6 => "CENRO Sta. Cruz",
            7 => "CENRO Lipa City",
            8 => "CENRO Calaca",
            9 => "CENRO Calauag",
            10 => "CENRO Catanauan",
            11 => "CENRO Tayabas",
            12 => "CENRO Real",
            13 => "Regional Office"
        ];

        $userRole = $roleMapping[$office] ?? "Unknown Role";


        if ($request->has('export')) {
            $templatePath = public_path('templates/summary_report.xlsx');

            if (!file_exists($templatePath)) {
                return response()->json(['error' => 'Template file not found.'], 404);
            }

            $spreadsheet = IOFactory::load($templatePath);
            $sheet = $spreadsheet->getActiveSheet();

            // Fetch data from InventoryController
            $response = $inventoryController->getSummaryData($request);

            // Ensure the response is converted to an array
            if ($response instanceof \Illuminate\Http\JsonResponse) {
                $data = $response->getData(true); // Convert JSON response to array
            } else {
                return response()->json(['error' => 'Invalid data response format.'], 500);
            }

            if (!isset($data['data']) || empty($data['data'])) {
                return response()->json(['error' => 'No data available for export.'], 404);
            }

            $styleArray = [
                'alignment' => ['wrapText' => true],
                'borders' => [
                    'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN]
                ],
            ];

            $row = 8;
            $items = $data['data'];
            $sheet->setCellValue('A5', 'Office: ' . $userRole);
            $sheet->setCellValue('A6', 'Generated Date: ' . $currentDateTime);

            foreach ($items as $item) {
                $sheet->setCellValue('A' . $row, $item['equipment_title'] ?? '');
                $sheet->setCellValue('B' . $row, $item['year_2025'] ?? 0);
                $sheet->setCellValue('C' . $row, $item['year_2024'] ?? 0);
                $sheet->setCellValue('D' . $row, $item['year_2023'] ?? 0);
                $sheet->setCellValue('E' . $row, $item['year_2022'] ?? 0);
                $sheet->setCellValue('F' . $row, $item['below_2021'] ?? 0);

                $sheet->getStyle("A{$row}:F{$row}")->applyFromArray($styleArray);
                $row++;
            }

            // Generate temp file
            $tempFile = tempnam(sys_get_temp_dir(), 'summary_report');
            $writer = new Xlsx($spreadsheet);
            $writer->save($tempFile);

            // Download file and delete after sending
            return response()->download($tempFile, 'summary_report.xlsx')->deleteFileAfterSend(true);
        }

        return response()->json(['error' => 'Export flag missing.'], 400);
    }

    public function getInventoryData(Request $request)
    {
        $role_id = $request->query('role_id');

        $equipmentData = DB::table('tbl_general_info as gi')
            ->leftJoin('tbl_specification as s', 's.control_id', '=', 'gi.id')
            ->leftJoin('tbl_peripherals as p', 'p.control_id', '=', 'gi.id')
            ->leftJoin('tbl_division as acct_division', 'acct_division.id', '=', 'gi.acct_person_division_id')
            ->leftJoin('tbl_division as actual_division', 'actual_division.id', '=', 'gi.actual_user_division_id')
            ->leftJoin('tbl_equipment_type as eq_t', 'eq_t.id', '=', 'gi.equipment_type')
            ->leftJoin('tbl_employment_type as emp', 'emp.id', '=', 'gi.actual_employment_type')
            ->leftJoin('tbl_nature_of_work as nw', 'nw.id', '=', 'gi.work_nature_id')
            ->leftJoin('users as u', 'u.roles', '=', 'gi.registered_loc')

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
                DB::raw("CONCAT( 'QR Code: ', COALESCE(gi.qr_code, 'N/A'), CHAR(10), 'MONITOR 1 QR Code: ', COALESCE(p.mon_qr_code1, 'N/A'), CHAR(10), 'MONITOR 2 QR Code:', COALESCE(p.mon_qr_code2, 'N/A'), CHAR(10), 'UPS QR Code: ', COALESCE(p.ups_qr_code, 'N/A') ) AS rict_code")
            );

        if ($role_id !== "13") {
            $equipmentData->where('u.roles', $role_id);
        }
        $equipmentData = $equipmentData->get();



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

    public function getDatabaseConfig()
    {
        return [
            'driver'   => env('com.mysql.jdbc.Driver'),
            'host'     => env('localhost'),
            'port'     => env('3306'),
            'username' => env('denr_riis'),
            'password' => env('sodniwutnubu06179'),
            'database' => env('riis'),
        ];
    }

    public function generatePDFReport(Request $request)
    {
        try {
            $id = $request->query('id');
            $ext = 'pdf';

            // Log the requested ID for debugging
            \Log::info('Generating PDF report for ID:', ['id' => $id]);

            // Paths
            $paths = [
                'input' => storage_path('templates/report/report.jasper'),
                'check_icon' => storage_path('templates/report/check.png'),
                'uncheck_icon' => storage_path('templates/report/uncheck.png'),
                'output' => public_path('templates/report'),
            ];

            // Ensure output folder exists
            if (!file_exists($paths['output'])) {
                mkdir($paths['output'], 0777, true);
            }

            // Fetch data
            $resultDataOpts = $this->fetchData(new InventoryController, 'retriveDataviaAPI', $id);
            $resultData = $this->fetchData(new InventoryController, 'retrieveSoftwareData', $id);
            $specsDataOpts = $this->fetchData(new InventoryController, 'retrieveSpecsData', $id);

            // Generate parameters
            $worknatureRemarks = $this->prepareWorknatureRemarks($resultDataOpts, $paths['check_icon'], $paths['uncheck_icon']);
            $softwareRemarks = $this->prepareSoftwareRemarks($resultData, $paths['check_icon'], $paths['uncheck_icon']);
            $empTypeRemarks = $this->prepareEmpTypeRemarks($resultDataOpts, $paths['check_icon'], $paths['uncheck_icon']);
            $gpuInfoRemarks = $this->prepareSpecsInfoRemarks($specsDataOpts, $paths['check_icon'], $paths['uncheck_icon']);
            $networkInfoRemarks = $this->prepareNetworkInfoRemarks($specsDataOpts, $paths['check_icon'], $paths['uncheck_icon']);

            // Merge parameters for Jasper
            $jasperParams = array_merge(
                ['id' => $id],
                $gpuInfoRemarks,
                $networkInfoRemarks,
                $worknatureRemarks,
                $empTypeRemarks,
                $this->flattenSoftwareRemarks($softwareRemarks)
            );

            // --- [ IMPORTANT ] Generate UNIQUE file name based on ID
            $filename = "report_{$id}." . $ext;
            $outputFile = $paths['output'] . '/' . $filename;

            // Clean up old file (optional but safe)
            if (file_exists($outputFile)) {
                unlink($outputFile);
            }

            // Actually generate PDF (pass custom output path)
            $generatedFile = $this->generatePDF($paths, $jasperParams, $ext, $outputFile);

            // Verify the file exists
            if (!file_exists($generatedFile)) {
                \Log::error('PDF generation failed. File not found.', ['file' => $generatedFile]);
                return response()->json(['error' => 'Report generation failed!'], 500);
            }

            // Serve the file with no-cache headers
            return response()->file($generatedFile, [
                'Content-Type' => 'application/pdf',
            ]);
        } catch (\Exception $e) {
            // Log error for debugging
            \Log::error("PDF Report Generation Error: " . $e->getMessage(), [
                'id' => $request->query('id'),
                'stack' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'An error occurred while generating the report.'], 500);
        }
    }


    private function fetchData($controller, $method, $id)
    {
        $newRequest = new Request(['id' => $id]);
        $response = $controller->{$method}($newRequest);
        return json_decode($response->getContent(), true);
    }

    private function prepareNetworkInfoRemarks($specsDataOpts, $checkIcon, $uncheckIcon)
    {
        $networkMapping = [
            '1' => 'lan',
            '2' => 'wireless',
            '3' => 'both',
        ];

        $networkRemarks = array_fill_keys(
            array_map(fn($key, $value) => "{$key}_{$value}", array_keys($networkMapping), $networkMapping),
            $uncheckIcon
        );

        $selectedNework = $specsDataOpts[0]['specs_net'] ?? null;
        if ($selectedNework && isset($networkMapping[$selectedNework])) {
            foreach ($networkMapping as $key => $value) {
                $mappedKey = "{$key}_{$value}";
                $networkRemarks[$mappedKey] = $key == $selectedNework ? $checkIcon : $uncheckIcon;
            }
        }

        return $networkRemarks;
    }

    private function prepareSpecsInfoRemarks($specsDataOpts, $checkIcon, $uncheckIcon)
    {
        $gpuMapping = [
            '1' => 'built_in',
            '2' => 'dedicated',
        ];

        $gpuRemarks = array_fill_keys(
            array_map(fn($key, $value) => "{$key}_{$value}", array_keys($gpuMapping), $gpuMapping),
            $uncheckIcon
        );

        $selectedGPU = $specsDataOpts[0]['specs_gpu'] ?? null;
        if ($selectedGPU && isset($gpuMapping[$selectedGPU])) {
            foreach ($gpuMapping as $key => $value) {
                $mappedKey = "{$key}_{$value}";
                $gpuRemarks[$mappedKey] = $key == $selectedGPU ? $checkIcon : $uncheckIcon;
            }
        }

        return $gpuRemarks;
    }

    private function prepareWorknatureRemarks($resultDataOpts, $checkIcon, $uncheckIcon)
    {
        $workMapping = [
            '1' => 'admin',
            '2' => 'technical',
            '3' => 'gis',
        ];

        $worknatureRemarks = array_fill_keys(
            array_map(fn($key, $value) => "{$key}_{$value}", array_keys($workMapping), $workMapping),
            $uncheckIcon
        );

        $selectedWorkNature = $resultDataOpts[0]['selectedWorkNature'] ?? null;
        if ($selectedWorkNature && isset($workMapping[$selectedWorkNature])) {
            foreach ($workMapping as $key => $value) {
                $mappedKey = "{$key}_{$value}";
                $worknatureRemarks[$mappedKey] = $key == $selectedWorkNature ? $checkIcon : $uncheckIcon;
            }
        }

        return $worknatureRemarks;
    }

    private function prepareEmpTypeRemarks($resultDataOpts, $checkIcon, $uncheckIcon)
    {
        $empMapping = [
            '1' => 'casual',
            '2' => 'cti',
            '3' => 'jo',
        ];

        $empTypeRemarks = array_fill_keys(
            array_map(fn($key, $value) => "{$key}_{$value}", array_keys($empMapping), $empMapping),
            $uncheckIcon
        );

        $selectedEmpType = $resultDataOpts[0]['employmentType'] ?? null;
        if ($selectedEmpType && isset($empMapping[$selectedEmpType])) {
            foreach ($empMapping as $key => $value) {
                $mappedKey = "{$key}_{$value}";
                $empTypeRemarks[$mappedKey] = $key == $selectedEmpType ? $checkIcon : $uncheckIcon;
            }
        }

        return $empTypeRemarks;
    }

    private function prepareSoftwareRemarks($resultData, $checkIcon, $uncheckIcon)
    {
        $softwareRemarks = [
            'operating_system' => [$uncheckIcon, $uncheckIcon, $uncheckIcon],
            'ms_office' => [$uncheckIcon, $uncheckIcon, $uncheckIcon],
            'arcgis' => [$uncheckIcon, $uncheckIcon, $uncheckIcon],
            'adobe_pdf' => [$uncheckIcon, $uncheckIcon, $uncheckIcon],
            'adobe_photoshop' => [$uncheckIcon, $uncheckIcon, $uncheckIcon],
            'autocad' => [$uncheckIcon, $uncheckIcon, $uncheckIcon],
        ];

        foreach ($resultData as $data) {
            $software = $data['software'];
            $remarkIndex = $data['remarks'] - 1; // Convert 1-based to 0-based index
            if (isset($softwareRemarks[$software], $softwareRemarks[$software][$remarkIndex])) {
                $softwareRemarks[$software] = array_fill(0, 3, $uncheckIcon);
                $softwareRemarks[$software][$remarkIndex] = $checkIcon;
            }
        }

        return $softwareRemarks;
    }

    private function flattenSoftwareRemarks($softwareRemarks)
    {
        $flattened = [];
        foreach ($softwareRemarks as $software => $icons) {
            $flattened["{$software}_perpetual"] = $icons[0];
            $flattened["{$software}_subscription"] = $icons[1];
            $flattened["{$software}_evaluation"] = $icons[2];
        }
        return $flattened;
    }

    private function generatePDF($paths, $jasperParams, $ext)
    {
        $jasper = new JasperPHP();

        // Build the command (but JasperPHP doesn't expose it before execution)
        $jasper->process(
            $paths['input'],
            $paths['output'],
            [$ext],
            $jasperParams,
            [
                'driver' => 'mysql',
                'username' => env('DB_USERNAME', 'root'),
                'password' => env('DB_PASSWORD', ''),
                'host' => env('DB_HOST', 'localhost'),
                'database' => env('DB_DATABASE', 'denr_staging'),
                'port' => env('DB_PORT', '3306'),
            ],
            true,   // useLocale
            false   // put to true only if you want the process command to output
        )->execute();


        // Build the expected output file path
        $outputFile = "{$paths['output']}/report.{$ext}";

        // Log if the file exists
        if (file_exists($outputFile)) {
            Log::info("Jasper report generated successfully at: $outputFile");
        } else {
            Log::error("Failed to generate Jasper report. File not found: $outputFile");
        }

        return $outputFile;
    }



    public function uploadQRFiles(Request $request)
    {
        $request->validate([
            'files' => 'required',
            'files.*' => 'image|mimes:jpeg,png,jpg|max:2048'
        ]);


        foreach ($request->file('files') as $file) {
            $filename = $file->getClientOriginalName();
        }
        $paths = [
            'input' => storage_path('templates/report/generate_qr_report.jasper'),
            'output' => storage_path('templates/report/'),
        ];

        $jasperParams = [
            'qrcode_paths' => $filename
        ];


        $file = $this->generateQRPDF($paths, $jasperParams, '.pdf');
        if (!file_exists($file)) {
            return response()->json(['error' => 'Report generation failed!'], 500);
        }

        return response()->file($file, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="qr.pdf"',
        ]);
    }



    private function generateQRPDF($paths, $jasperParams, $ext)
    {
        $jasper = new JasperPHP();
        $jasper->process(
            $paths['input'],
            $paths['output'],
            [$ext],
            $jasperParams,
            [
                'driver' => 'mysql',
                'username' => env('DB_USERNAME', 'root'),
                'password' => env('DB_PASSWORD', ''),
                'host' => env('DB_HOST', 'localhost'),
                'database' => env('DB_DATABASE', 'denr_staging'),
                'port' => env('DB_PORT', '3306'),
            ],
            true,
            true
        )->execute();

        // ✅ Manually log the command being executed
        return "{$paths['output']}/generate_qr_report.{$ext}";

        // $command = $process->output();
        // \Log::info('JasperPHP Command:', ['command' => $command]);

        // // ✅ Return command output for debugging
        // return response()->json([
        //     'success' => false,
        //     'message' => 'Check logs for JasperPHP command',
        //     'command' => $command
        // ]);
    }
}
