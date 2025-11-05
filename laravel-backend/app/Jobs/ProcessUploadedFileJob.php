<?php

namespace App\Jobs;

use App\Models\OnbintModel;
use App\Models\OnbintSummary;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProcessUploadedFileJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $filePath;
    public $uploadedBy;
    public $fileName;

    public function __construct($fileName, $filePath, $uploadedBy)
    {
        $this->fileName = $fileName;
        $this->filePath = $filePath;
        $this->uploadedBy = $uploadedBy;
    }

    protected function normalizeString($value)
    {
        if ($value === null)
            return null;
        $value = trim((string) $value);
        if ($value === '')
            return null;
        return mb_strtoupper($value, 'UTF-8');
    }

    protected function normalizeIdentifier($value)
    {
        if ($value === null)
            return null;
        $v = trim((string) $value);
        if ($v === '')
            return null;
        $v = mb_strtoupper($v, 'UTF-8');
        $v = preg_replace('/[^A-Z0-9]/u', '', $v);
        return $v === '' ? null : $v;
    }

    protected function normalizeYear($value)
    {
        if ($value === null)
            return null;
        $v = trim((string) $value);
        if (preg_match('/^\d{4}$/', $v)) {
            return $v . '-01-01';
        }
        return $v === '' ? null : $v;
    }

    public function handle(): void
    {
        $fullPath = storage_path('app/' . $this->filePath);

        \Log::info('📂 Processing file: ' . $this->fileName);

        if (!file_exists($fullPath)) {
            \Log::error('❌ Excel file not found at: ' . $fullPath);
            return;
        }

        try {
            $spreadsheet = IOFactory::load($fullPath);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);

            $firstRow = reset($rows);
            $isHeader = false;
            if ($firstRow) {
                $headerCandidates = implode(' ', $firstRow);
                if (preg_match('/office|serial|property|brand|model|year|accountable|remarks/i', $headerCandidates)) {
                    $isHeader = true;
                    array_shift($rows);
                }
            }

            $seenIdentifiers = [];
            $serialsToCheck = [];
            $propsToCheck = [];

            // 🔍 Load all division titles for mapping
            $divisions = DB::table('tbl_division')->pluck('id', 'division_title')->toArray();

            // Build normalized lookup (uppercased keys)
            $divisionLookup = [];
            foreach ($divisions as $title => $id) {
                $divisionLookup[mb_strtoupper(trim($title), 'UTF-8')] = $id;
            }

            $insertData = [];
            $countInserted = 0;
            $countSkippedDupFile = 0;
            $countSkippedDupDb = 0;
            $skippedRows = [];

            foreach ($rows as $idx => $row) {
                $normSerial = $this->normalizeIdentifier($row['R'] ?? null);
                $normProp = $this->normalizeIdentifier($row['S'] ?? null);

                if ($normSerial !== null)
                    $serialsToCheck[] = $normSerial;
                if ($normProp !== null)
                    $propsToCheck[] = $normProp;
            }

            $serialsToCheck = array_values(array_unique(array_filter($serialsToCheck)));
            $propsToCheck = array_values(array_unique(array_filter($propsToCheck)));

            $existingSerials = [];
            $existingProps = [];

            if (!empty($serialsToCheck) || !empty($propsToCheck)) {
                $query = OnbintModel::query();
                if (!empty($serialsToCheck)) {
                    $query->orWhereIn('serial_number', $serialsToCheck);
                }
                if (!empty($propsToCheck)) {
                    $query->orWhereIn('property_number', $propsToCheck);
                }
                $existingRows = $query->get(['serial_number', 'property_number'])->toArray();

                foreach ($existingRows as $er) {
                    $ns = $this->normalizeIdentifier($er['serial_number'] ?? null);
                    $np = $this->normalizeIdentifier($er['property_number'] ?? null);
                    if ($ns !== null)
                        $existingSerials[$ns] = true;
                    if ($np !== null)
                        $existingProps[$np] = true;
                }
            }

            foreach ($rows as $rowIndex => $row) {
                $office_division_raw = $this->normalizeString($row['B'] ?? null);

                // 🔍 Convert division name to ID
                $office_division = $divisionLookup[$office_division_raw] ?? null;

                $type_of_ict_equipment = $this->normalizeString($row['C'] ?? null);
                $year_acquired = $this->normalizeYear($row['D'] ?? null);
                $shelf_life = $this->normalizeString($row['E'] ?? null);
                $brand = $this->normalizeString($row['F'] ?? null);
                $model = $this->normalizeString($row['G'] ?? null);
                $processor = $this->normalizeString($row['H'] ?? null);
                $installed_memory_ram_size = $this->normalizeString($row['I'] ?? null);
                $installed_gpu = $this->normalizeString($row['J'] ?? null);
                $range_category = $this->normalizeString($row['K'] ?? null);
                $operating_system_version = $this->normalizeString($row['L'] ?? null);
                $office_productivity = $this->normalizeString($row['M'] ?? null);
                $microsoft_office_version = $this->normalizeString($row['N'] ?? null);
                $office_productivity_version = $this->normalizeString($row['O'] ?? null);
                $type_endpoint_protection = $this->normalizeString($row['P'] ?? null);
                $computer_name = $this->normalizeString($row['Q'] ?? null);
                $serial_number_raw = $row['R'] ?? null;
                $property_number_raw = $row['S'] ?? null;
                $normSerial = $this->normalizeIdentifier($serial_number_raw);
                $normProp = $this->normalizeIdentifier($property_number_raw);
                $accountable_person = $this->normalizeString($row['T'] ?? null);
                $sex = $this->normalizeString($row['U'] ?? null);
                $status_of_employment = $this->normalizeString($row['V'] ?? null);
                $actual_user = $this->normalizeString($row['W'] ?? null);
                $sex_2 = $this->normalizeString($row['X'] ?? null);
                $status_of_employment_2 = $this->normalizeString($row['Y'] ?? null);
                $nature_of_work = $this->normalizeString($row['Z'] ?? null);
                $remarks = $this->normalizeString($row['AA'] ?? null);
                $rict_code_local = $this->normalizeString($row['AB'] ?? null);

                // Duplicate checks
                $duplicateInFile = false;
                $duplicateInDb = false;

                if ($normSerial !== null) {
                    $key = "S:{$normSerial}";
                    if (isset($seenIdentifiers[$key]))
                        $duplicateInFile = true;
                    if (isset($existingSerials[$normSerial]))
                        $duplicateInDb = true;
                }

                if ($normProp !== null) {
                    $key = "P:{$normProp}";
                    if (isset($seenIdentifiers[$key]))
                        $duplicateInFile = true;
                    if (isset($existingProps[$normProp]))
                        $duplicateInDb = true;
                }

                if ($duplicateInFile || $duplicateInDb)
                    continue;

                if ($normSerial !== null)
                    $seenIdentifiers["S:{$normSerial}"] = true;
                if ($normProp !== null)
                    $seenIdentifiers["P:{$normProp}"] = true;

                $insertData[] = [
                    'office_division' => $office_division, // ✅ now stores numeric ID
                    'type_of_ict_equipment' => $type_of_ict_equipment,
                    'year_acquired' => $year_acquired,
                    'shelf_life' => $shelf_life,
                    'brand' => $brand,
                    'model' => $model,
                    'processor' => $processor,
                    'installed_memory_ram_size' => $installed_memory_ram_size,
                    'installed_gpu' => $installed_gpu,
                    'range_category' => $range_category,
                    'operating_system_version' => $operating_system_version,
                    'office_productivity' => $office_productivity,
                    'microsoft_office_version' => $microsoft_office_version,
                    'office_productivity_version' => $office_productivity_version,
                    'type_endpoint_protection' => $type_endpoint_protection,
                    'computer_name' => $computer_name,
                    'serial_number' => $normSerial ?? $this->normalizeString($serial_number_raw),
                    'property_number' => $normProp ?? $this->normalizeString($property_number_raw),
                    'accountable_person' => $accountable_person,
                    'sex' => $sex,
                    'status_of_employment' => $status_of_employment,
                    'actual_user' => $actual_user,
                    'sex_2' => $sex_2,
                    'status_of_employment_2' => $status_of_employment_2,
                    'nature_of_work' => $nature_of_work,
                    'remarks' => $remarks,
                    'rict_code_local' => $rict_code_local,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                if (count($insertData) >= 500) {
                    OnbintModel::insert($insertData);
                    $countInserted += count($insertData);
                    $insertData = [];
                }
            }

            if (!empty($insertData)) {
                OnbintModel::insert($insertData);
                $countInserted += count($insertData);
            }

            OnbintSummary::create([
                'filename' => $this->fileName,
                'total_rows' => $countInserted,
                'uploaded_by' => $this->uploadedBy,
                'created_at' => now(),
            ]);

            \Log::info("⚠️ Skipped duplicates in file: {$countSkippedDupFile}, duplicates in DB: {$countSkippedDupDb}.");
            if (!empty($skippedRows)) {
                \Log::info('🔍 Skipped rows detail: ', $skippedRows);
            }


            \Log::info("✅ Inserted {$countInserted} rows successfully.");
        } catch (\Throwable $e) {
            \Log::error('💥 Error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
        }

        Storage::delete($this->filePath);
        \Log::info('🗑️ Deleted uploaded file after processing.');
    }
}
