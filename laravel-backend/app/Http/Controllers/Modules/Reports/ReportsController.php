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
            $data = $this->fecthVWGeneralInfo($request);

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

            // Software mapping (fixed layout in your Excel)
            $softwareMap = [
                'operating_system' => ['K', 'L'], // SOFTWARE 1 OS + LIC MODEL
                'ms_office' => ['M', 'N'], // SOFTWARE 2 MS OFFICE + LIC MODEL
                'arcgis' => ['O', 'P'], // SOFTWARE 3 ArcGIS + LIC MODEL
                'adobe_pdf' => ['Q', 'R'], // SOFTWARE 4 Adobe PDF + LIC MODEL
                'photoshop' => ['S', 'T'], // SOFTWARE 5 Photoshop + LIC MODEL
                'autocad' => ['U', 'V'], // SOFTWARE 6 AutoCAD + LIC MODEL
            ];

            // Populate spreadsheet with database data
            $row = 3; // Start from row 3
            foreach ($data as $record) {
                // Populate other fields
                $sheet->setCellValue('A' . $row, $record->actual_division_title);
                $sheet->setCellValue('D' . $row, $record->equipment_title);
                $sheet->setCellValue('E' . $row, $record->equipment_title);
                $sheet->setCellValue('F' . $row, $record->year_acquired);
                $sheet->setCellValue('G' . $row, $record->shelf_life);
                $sheet->setCellValue('H' . $row, $record->equipment_brand);
                $sheet->setCellValue('I' . $row, $record->full_specs);
                $sheet->setCellValue('J' . $row, $record->range_category);
                $sheet->setCellValue('W' . $row, $record->serial_no);
                $sheet->setCellValue('X' . $row, $record->property_no);
                $sheet->setCellValue('Y' . $row, $record->acct_person);
                $sheet->setCellValue('Z' . $row, $record->actual_division_title);
                $sheet->setCellValue('AA' . $row, $record->employment_title);

                $sheet->setCellValue('AB' . $row, $record->actual_user);
                $sheet->setCellValue('AC' . $row, $record->employment_title);
                $sheet->setCellValue('AD' . $row, $record->nature_work_title);
                $sheet->setCellValue('AE' . $row, $record->remarks);
                $sheet->setCellValue('AF' . $row, $record->rict_code);
                if (!empty($record->os_installed)) {
                    $sheet->setCellValue('K' . $row, $record->os_installed);
                }

                if (!empty($record->ms_office_installed)) {
                    $sheet->setCellValue('M' . $row, $record->ms_office_installed);
                }

                // If vw_gen_info also has arcgis_installed, adobe_pdf_installed, etc:
                if (!empty($record->arcgis_installed)) {
                    $sheet->setCellValue('O' . $row, $record->arcgis_installed);
                }

                if (!empty($record->adobe_pdf_installed)) {
                    $sheet->setCellValue('Q' . $row, $record->adobe_pdf_installed);
                }

                if (!empty($record->photoshop_installed)) {
                    $sheet->setCellValue('S' . $row, $record->photoshop_installed);
                }

                if (!empty($record->autocad_installed)) {
                    $sheet->setCellValue('U' . $row, $record->autocad_installed);
                }
                // Fetch software data for this record
                // Fetch software data for this record
                $software_opts = $this->getSoftwareData($record->id);

                // Loop through each software slot
                foreach ($softwareMap as $key => [$colSoftware, $colLicense]) {
                    if (isset($software_opts[$key])) {
                        // Instead of label, use actual database value
                        // Software values directly from vw_gen_info


                        $sheet->setCellValue($colLicense . $row, $software_opts[$key]->remarks);
                    } else {
                        // leave blank if no software data
                        $sheet->setCellValue($colSoftware . $row, null);
                        $sheet->setCellValue($colLicense . $row, null);
                    }
                }


                // Apply styling
                $sheet->getStyle('A' . $row . ':AJ' . $row)->applyFromArray($styleArray);

                $row++;
            }

            // Save to a temporary file
            $tempFile = tempnam(sys_get_temp_dir(), 'denr');
            $writer = new Xlsx($spreadsheet);
            $writer->save($tempFile);

            return response()->download($tempFile, 'denr_ict_inv_2024.xlsx')->deleteFileAfterSend(true);
        } else {
            return response()->json(['error' => 'Export flag missing.'], 400);
        }
    }
    public function fecthVWGeneralInfo(Request $request)
    {
        $tableName = 'vw_gen_info';

        $query = DB::table($tableName)
            ->whereNotNull('equipment_type')   // equipment_type IS NOT NULL
            ->where('equipment_type', '!=', value: 0) // AND equipment_type != 0
            ->orderBy('id', 'desc');

        // If you still want to filter by role_id (designation) when passed
        if ($request->has('role_id') && is_numeric($request->query('role_id'))) {
            $designation = (int) $request->query('role_id');
            $query->where('registered_loc', $designation);
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
                WHEN si.remarks = '1' THEN 'perpetual'
                WHEN si.remarks = '2' THEN 'subscription'
                WHEN si.remarks = '3' THEN 'evaluation'
                ELSE NULL
            END AS remarks")
            )
            ->get()
            ->keyBy(function ($item) {
                return strtolower(str_replace(' ', '_', $item->software));
            });
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
