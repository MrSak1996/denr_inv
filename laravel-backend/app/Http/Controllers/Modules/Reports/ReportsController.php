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



class ReportsController extends Controller
{
    public function generateReport(Request $request)
    {
        if (!$request->has('export')) {
            return response()->json(['error' => 'Export flag missing.'], 400);
        }

        $templatePath = public_path('templates/denr_ict_inv_template.xlsx');

        if (!file_exists($templatePath)) {
            return response()->json(['error' => 'Template file not found.'], 404);
        }

        $spreadsheet = IOFactory::load($templatePath);
        $sheet = $spreadsheet->getActiveSheet();

        $records = $this->fecthVWGeneralInfo($request);

        $styleArray = [
            'alignment' => ['wrapText' => true],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
        ];

        // SOFTWARE COLUMN MAP
        $softwareMap = [
            'operating_system' => ['L', 'M'],
            'ms_office' => ['N', 'O'],
        ];

        $row = 7;

        foreach ($records as $rec) {

            // Convert all string fields to UPPERCASE
            foreach ($rec as $key => $value) {
                if (is_string($value)) {
                    $rec->$key = strtoupper($value);
                }
            }

            // ======================
            // MAIN FIELDS
            // ======================
            $sheet->setCellValue("A{$row}", $rec->acct_person_division_id);
            $sheet->setCellValue("B{$row}", $rec->qr_code);
            $sheet->setCellValue("C{$row}", $rec->equipment_title);
            $sheet->setCellValue("D{$row}", $rec->year_acquired);
            $sheet->setCellValue("E{$row}", $rec->shelf_life);
            $sheet->setCellValue("F{$row}", $rec->brand);
            $sheet->setCellValue("G{$row}", $rec->model);
            $sheet->setCellValue("H{$row}", $rec->processor);
            $sheet->setCellValue("I{$row}", $rec->ram_type);
            $sheet->setCellValue("J{$row}", $rec->installed_gpu);
            $sheet->setCellValue("K{$row}", $rec->range_category);
            $sheet->setCellValue("P{$row}", $rec->type_endpoint_protection);
            $sheet->setCellValue("Q{$row}", $rec->computer_name);

            $sheet->setCellValue("R{$row}", $rec->serial_no);
            $sheet->setCellValue("S{$row}", $rec->property_no);
            $sheet->setCellValue("T{$row}", $rec->acct_person);
            $sheet->setCellValue("U{$row}", $rec->sex);
            $sheet->setCellValue("V{$row}", $rec->acct_status_of_employment);
            $sheet->setCellValue("W{$row}", $rec->acct_nature_work_title);

            $sheet->setCellValue("X{$row}", $rec->actual_user_division_id);
            $sheet->setCellValue("Y{$row}", $rec->actual_user);
            $sheet->setCellValue("Z{$row}", $rec->sex_2);
            $sheet->setCellValue("AA{$row}", $rec->employment_title);
            $sheet->setCellValue("AB{$row}", $rec->actual_nature_work_title);
            $sheet->setCellValue("AC{$row}", $rec->remarks);

            // DIRECT SOFTWARE INSTALLED COLUMNS
            if (!empty($rec->os_installed)) {
                $sheet->setCellValue("L{$row}", $rec->os_installed);
            }

            if (!empty($rec->ms_office_installed)) {
                $sheet->setCellValue("N{$row}", $rec->ms_office_installed);
            }

            // ======================
            // SOFTWARE INSTALLATION TABLE
            // ======================

            $softwareData = $this->getSoftwareData($rec->id);

            foreach ($softwareMap as $key => [$colSW, $colLic]) {
                if (isset($softwareData[$key])) {
                    $sheet->setCellValue("{$colLic}{$row}", strtoupper($softwareData[$key]->remarks));
                } else {
                    $sheet->setCellValue("{$colSW}{$row}", null);
                    $sheet->setCellValue("{$colLic}{$row}", null);
                }
            }

            // STYLE
            $sheet->getStyle("A{$row}:AC{$row}")->applyFromArray($styleArray);

            $row++;
        }

        $tempFile = tempnam(sys_get_temp_dir(), 'denr');
        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        return response()->download($tempFile, 'denr_ict_inv_2025.xlsx')->deleteFileAfterSend(true);
    }

    public function fecthVWGeneralInfo(Request $request)
    {
        $query = DB::table('vw_gen_info')
            ->whereNotNull('equipment_type')
            ->where('equipment_type', '!=', 0)
            ->orderBy('id', 'desc');

        if ($request->filled('role_id') && is_numeric($request->role_id)) {
            $query->where('registered_loc', (int) $request->role_id);
        }

        return $query->get();
    }

    public function getSoftwareData($controlId)
    {
        return DB::table('tbl_software_install AS si')
            ->where('si.control_id', $controlId)
            ->select(
                'si.software',
                DB::raw("CASE 
                WHEN si.remarks = '1' THEN 'PERPETUAL'
                WHEN si.remarks = '2' THEN 'SUBSCRIPTION'
                WHEN si.remarks = '3' THEN 'EVALUATION'
                ELSE ''
            END AS remarks")
            )
            ->get()
            ->keyBy(fn($item) => strtolower(str_replace(' ', '_', $item->software)));
    }



    // Optional: normalize raw DB software keys into user-friendly labels
    protected function normalizeSoftwareName($key)
    {
        $map = [
            'operating_system' => 'Windows 11',
            'ms_office' => 'MS 365',
            'arcgis' => 'ArcGIS',
            'adobe_pdf' => 'Adobe PDF',
            'photoshop' => 'Photoshop',
            'autocad' => 'AutoCAD',
        ];

        return $map[$key] ?? ucfirst(str_replace('_', ' ', $key));
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




    public function getDatabaseConfig()
    {
        return [
            'driver' => env('com.mysql.jdbc.Driver'),
            'host' => env('localhost'),
            'port' => env('3306'),
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
                'input' => storage_path(path: 'templates/report/report.jasper'),
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
