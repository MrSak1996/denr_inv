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
            $data = DB::table('tbl_general_info')->get();

            // Populate spreadsheet with database data
            $row = 2; // Start from row 2
            $index = 1;
            foreach ($data as $record) {
                $sheet->setCellValue('A' . $row, $index);
                $sheet->setCellValue('B' . $row, $record->control_no);
                $sheet->setCellValue('C' . $row, $record->acct_person);
                $sheet->setCellValue('D' . $row, $record->actual_user);
                // Populate other fields as needed
                $row++;
                $index++;
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
}
