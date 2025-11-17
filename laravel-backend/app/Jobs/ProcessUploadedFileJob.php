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

    public $userId;
    public $filePath;
    public $uploadedBy;
    public $fileName;

    public $registered_loc;

    protected $logMessages = [];
    protected $startTime;
    protected $summaryId = null;

    public function __construct($userId, $registered_loc, $fileName, $filePath, $uploadedBy)
    {
        $this->userId = $userId;
        $this->fileName = $fileName;
        $this->filePath = $filePath;
        $this->uploadedBy = $uploadedBy;
        $this->registered_loc = $registered_loc;
    }

    /** Utility Normalizers */
    protected function normalizeString($value)
    {
        if ($value === null)
            return null;
        $value = trim((string) $value);
        return $value === '' ? null : mb_strtoupper($value, 'UTF-8');
    }

    protected function normalizeIdentifier($value)
    {
        if ($value === null)
            return null;
        $v = trim((string) $value);
        if ($v === '')
            return null;
        // Remove all non-alphanumeric chars
        $v = mb_strtoupper($v, 'UTF-8');
        $v = preg_replace('/[^A-Z0-9]/u', '', $v);
        return $v === '' ? null : $v;
    }

    protected function normalizeYear($value)
    {
        if ($value === null)
            return null;
        $v = trim((string) $value);
        return preg_match('/^\d{4}$/', $v) ? $v . '-01-01' : ($v === '' ? null : $v);
    }

    protected function addLog($level, $message, $context = [])
    {
        $timestamp = now()->format('Y-m-d H:i:s');
        $formatted = "[{$timestamp}] {$message}";
        $this->logMessages[] = $formatted;
        Log::{$level}($message, $context);
    }

    public function handle(): void
    {
        $this->startTime = microtime(true);

        $fullPath = storage_path('app/' . $this->filePath);
        $this->addLog('info', "📂 Starting processing: {$this->fileName}");

        if (!file_exists($fullPath)) {
            $this->addLog('error', "❌ Excel file not found at: {$fullPath}");
            $this->saveLog('error');
            return;
        }

        try {
            $spreadsheet = IOFactory::load($fullPath);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);

            if (empty($rows)) {
                $this->addLog('warning', "⚠️ No data found in Excel file: {$this->fileName}");
                $this->saveLog('warning');
                return;
            }

            // Detect and shift header row
            $firstRow = reset($rows);
            $this->addLog('debug', "🧭 Header Row detected");

            if ($firstRow && preg_match('/office|serial|property|brand|model|year|accountable|remarks/i', implode(' ', $firstRow))) {
                array_shift($rows);
            }

            // Load lookup tables
            $divisionLookup = DB::table('tbl_division')->pluck('id', 'division_title')
                ->mapWithKeys(fn($v, $k) => [mb_strtoupper(trim($k)) => $v])->toArray();
            $equipmentLookup = DB::table('tbl_equipment_type')->pluck('id', 'equipment_title')
                ->mapWithKeys(fn($v, $k) => [mb_strtoupper(trim($k)) => $v])->toArray();
            $rangeLookup = DB::table('tbl_range_category')->pluck('id', 'range_title')
                ->mapWithKeys(fn($v, $k) => [mb_strtoupper(trim($k)) => $v])->toArray();
            $employmentLookup = DB::table('tbl_employment_type')->pluck('id', 'employment_title')
                ->mapWithKeys(fn($v, $k) => [mb_strtoupper(trim($k)) => $v])->toArray();
            $workNatureLookup = DB::table('tbl_nature_of_work')->pluck('id', 'nature_work_title')
                ->mapWithKeys(fn($v, $k) => [mb_strtoupper(trim($k)) => $v])->toArray();

            $officeProductivityMap = [
                'PERPETUAL' => 1,
                'SUBSCRIPTION' => 2,
                'EVALUATION' => 3,
            ];

            // Pre-scan identifiers
            $serialsToCheck = [];
            $propsToCheck = [];

            foreach ($rows as $r) {
                if ($s = $this->normalizeIdentifier($r['R'] ?? null))
                    $serialsToCheck[] = $s;
                if ($p = $this->normalizeIdentifier($r['S'] ?? null))
                    $propsToCheck[] = $p;
            }

            $serialsToCheck = array_unique(array_filter($serialsToCheck));
            $propsToCheck = array_unique(array_filter($propsToCheck));

            $existingSerials = [];
            $existingProps = [];

            if ($serialsToCheck || $propsToCheck) {
                $query = OnbintModel::query();
                if ($serialsToCheck)
                    $query->orWhereIn('serial_number', $serialsToCheck);
                if ($propsToCheck)
                    $query->orWhereIn('property_number', $propsToCheck);

                foreach ($query->get(['serial_number', 'property_number']) as $row) {
                    if ($ns = $this->normalizeIdentifier($row->serial_number ?? null))
                        $existingSerials[$ns] = true;
                    if ($np = $this->normalizeIdentifier($row->property_number ?? null))
                        $existingProps[$np] = true;
                }
            }

            $seenIdentifiers = [];
            $insertData = [];
            $countInserted = 0;
            $duplicateFileRows = [];
            $duplicateDbRows = [];

            // Create summary record first (so we can update it later)
            $summary = OnbintSummary::create([
                'filename' => $this->fileName,
                'status' => 'processing',
                'uploaded_by' => $this->uploadedBy,
                'created_at' => now(),
            ]);
            $this->summaryId = $summary->id;

            foreach ($rows as $i => $row) {
                $rowNum = $i + 2;

                $office_division_raw = $this->normalizeString($row['B'] ?? null);
                $actual_user_division_raw = $this->normalizeString($row['X'] ?? null);
                $type_of_ict_equipment_raw = $this->normalizeString($row['C'] ?? null);
                $range_category_raw = $this->normalizeString($row['K'] ?? null);
                $office_productivity_raw = $this->normalizeString($row['M'] ?? null);
                $msoffice_productivity_raw = $this->normalizeString($row['O'] ?? null);
                $status_employment_type_raw = $this->normalizeString($row['V'] ?? null);
                $status_employment_type_raw_2 = $this->normalizeString($row['AA'] ?? null);
                $work_nature_raw = $this->normalizeString($row['W'] ?? null);
                $work_nature_raw_2 = $this->normalizeString($row['AB'] ?? null);

                $office_division = $divisionLookup[$office_division_raw] ?? null;
                $actual_office_division = $divisionLookup[$actual_user_division_raw] ?? null;
                $type_of_ict_equipment = $equipmentLookup[$type_of_ict_equipment_raw] ?? null;
                $range_category = $rangeLookup[$range_category_raw] ?? null;
                $office_productivity = $officeProductivityMap[$office_productivity_raw] ?? null;
                $msoffice_productivity = $officeProductivityMap[$msoffice_productivity_raw] ?? null;
                $status_of_employment = $employmentLookup[$status_employment_type_raw] ?? null;
                $status_of_employment_2 = $employmentLookup[$status_employment_type_raw_2] ?? null;
                $nature_of_work = $workNatureLookup[$work_nature_raw] ?? null;
                $nature_of_work_2 = $workNatureLookup[$work_nature_raw_2] ?? null;

                $normSerial = $this->normalizeIdentifier($row['R'] ?? null);
                $normProp = $this->normalizeIdentifier($row['S'] ?? null);

                // $this->addLog('debug', "Row {$rowNum}: Serial={$row['R']} → {$normSerial}, Property={$row['S']} → {$normProp}");

                $duplicateInFile = ($normSerial && isset($seenIdentifiers["S:$normSerial"])) ||
                    ($normProp && isset($seenIdentifiers["P:$normProp"]));

                $duplicateInDb = ($normSerial && isset($existingSerials[$normSerial])) ||
                    ($normProp && isset($existingProps[$normProp]));

                if ($duplicateInFile || $duplicateInDb) {
                    if ($duplicateInFile)
                        $duplicateFileRows[] = ['row' => $rowNum, 'serial' => $normSerial, 'property' => $normProp];
                    if ($duplicateInDb)
                        $duplicateDbRows[] = ['row' => $rowNum, 'serial' => $normSerial, 'property' => $normProp];
                    continue;
                }

                if ($normSerial)
                    $seenIdentifiers["S:$normSerial"] = true;
                if ($normProp)
                    $seenIdentifiers["P:$normProp"] = true;

                $insertData[] = [
                    'office_division' => $office_division,
                    'type_of_ict_equipment' => $type_of_ict_equipment,
                    'year_acquired' => $this->normalizeYear($row['D'] ?? null),
                    'shelf_life' => $this->normalizeString($row['E'] ?? null),
                    'brand' => $this->normalizeString($row['F'] ?? null),
                    'model' => $this->normalizeString($row['G'] ?? null),
                    'processor' => $this->normalizeString($row['H'] ?? null),
                    'installed_memory_ram_size' => $this->normalizeString($row['I'] ?? null),
                    'installed_gpu' => $this->normalizeString($row['J'] ?? null),
                    'range_category' => $range_category,
                    'operating_system_version' => $this->normalizeString($row['L'] ?? null),
                    'office_productivity' => $office_productivity,
                    'microsoft_office_version' => $this->normalizeString($row['N'] ?? null),
                    'office_productivity_version' => $msoffice_productivity,
                    'type_endpoint_protection' => $this->normalizeString($row['P'] ?? null),
                    'computer_name' => $this->normalizeString($row['Q'] ?? null),
                    'serial_number' => $normSerial,
                    'property_number' => $normProp,
                    'accountable_person' => $this->normalizeString($row['T'] ?? null),
                    'sex' => $this->normalizeString($row['U'] ?? null),
                    'status_of_employment' => $status_of_employment,
                    'acct_work_nature_id' => $nature_of_work,
                    'actual_user_division_id' => $actual_office_division,
                    'actual_user' => $this->normalizeString($row['Y'] ?? null),
                    'sex_2' => $this->normalizeString($row['Z'] ?? null),
                    'status_of_employment_2' => $status_of_employment_2,
                    'nature_of_work' => $nature_of_work_2,
                    'remarks' => $this->normalizeString($row['AC'] ?? null),
                    'rict_code_local' => $this->normalizeString($row['AD'] ?? null),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                if (count($insertData) >= 500) {
                    OnbintModel::insert($insertData);
                    $countInserted += count($insertData);
                    $insertData = [];
                }
            }

            if ($insertData) {
                OnbintModel::insert($insertData);
                $countInserted += count($insertData);
            }

            // ================================
            // ✅ ADD THIS BLOCK BELOW
            // ================================
            $this->addLog('info', '🚀 Starting data transfer to GeneralInformation...');

            // Transfer data from OnbintModel → GeneralInformation
            $onbintRecords = OnbintModel::all();
            $generalInsert = [];
            $counter = 1;

            foreach ($onbintRecords as $record) {
                $controlNo = sprintf('R4A-RICT-%04d', $counter++); // e.g., R4A-RICT-0001

                $generalInsert[] = [
                    'registered_loc' => $this->registered_loc, // or your default
                    'control_no' => $controlNo,
                    'division_id' => $record->office_division,
                    'section_id' => null,
                    'acct_person' => $record->accountable_person,
                    'acct_status_of_employment' => $record->status_of_employment,
                    'acct_person_division_id' => $record->office_division,
                    'actual_user' => $record->actual_user,
                    'sex' => $record->sex,
                    'sex_2' => $record->sex_2,
                    'actual_user_division_id' => $record->actual_user_division_id,
                    'actual_employment_type' => $record->status_of_employment_2,
                    'work_nature_id' => $record->nature_of_work,
                    'acct_work_nature_id' => $record->nature_of_work_2,
                    'equipment_type' => $record->type_of_ict_equipment,
                    'os_installed' => $record->operating_system_version,
                    'ms_office_installed' => $record->microsoft_office_version,
                    'brand' => $record->brand,
                    'model' => $record->model,
                    'property_no' => $record->property_number,
                    'serial_no' => $record->serial_number,
                    'range_category' => $record->range_category,
                    'acquisition_cost' => null,
                    'year_acquired' => $record->year_acquired,
                    'shelf_life' => $record->shelf_life,
                    'remarks' => $record->remarks,
                    'status' => null,
                    'item_status' => null,
                    'softwareName' => $record->office_productivity,
                    'softwareCategory' => $record->office_productivity_version,
                    'updated_by' => $this->userId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                if (count($generalInsert) >= 500) {
                    \App\Models\GeneralInformation::insert($generalInsert);
                    $generalInsert = [];
                }
            }

            if ($generalInsert) {
                \App\Models\GeneralInformation::insert($generalInsert);
            }

            $this->addLog('info', '✅ Successfully transferred cleansed data to GeneralInformation.');
            // ================================
            // ✅ END OF ADDED BLOCK
            // ================================


            // ==========================================
            // ✅ Insert OS + MS Office into tbl_software_install
            // ==========================================
            $this->addLog('info', '💾 Inserting OS and MS Office software installation details...');

            $generalRecords = DB::table('tbl_general_info')
                ->where('registered_loc', $this->registered_loc)
                ->where('updated_by', $this->userId)
                ->whereDate('created_at', now()->toDateString())
                ->get();

            if ($generalRecords->isEmpty()) {
                $this->addLog('warning', '⚠️ No new records found in tbl_general_info for software insertion.');
            } else {
                $this->addLog('info', 'Found ' . $generalRecords->count() . ' new records for software installation.');

                $softwareInsert = [];
                $officeProductivityMap = [
                    'PERPETUAL' => 1,
                    'SUBSCRIPTION' => 2,
                    'EVALUATION' => 3,
                ];

                foreach ($generalRecords as $record) {
                    // 🔹 Determine OS type (default = operating_system)
                    $osType = 'operating_system';
                    $osRemarksRaw = $this->normalizeString($record->office_productivity ?? null); // column M
                    $osRemarksValue = $officeProductivityMap[strtoupper($osRemarksRaw)] ?? 1; // default to perpetual if empty

                    // 🔹 Determine MS Office type (default = ms_office)
                    $officeType = 'ms_office';
                    $officeRemarksRaw = $this->normalizeString($record->office_productivity_version ?? null); // column O
                    $officeRemarksValue = $officeProductivityMap[strtoupper($officeRemarksRaw)] ?? 1;

                    // 🧱 Insert both OS and MS Office records
                    $softwareInsert[] = [
                        'control_id' => $record->id,
                        'software' => $osType,
                        'remarks' => $osRemarksValue,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    $softwareInsert[] = [
                        'control_id' => $record->id,
                        'software' => $officeType,
                        'remarks' => $officeRemarksValue,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    // 🧩 Batch insert every 500 records
                    if (count($softwareInsert) >= 500) {
                        DB::table('tbl_software_install')->insert($softwareInsert);
                        $softwareInsert = [];
                    }
                }

                // 🧩 Final batch insert
                if (!empty($softwareInsert)) {
                    DB::table('tbl_software_install')->insert($softwareInsert);
                }

                $this->addLog('info', '✅ Successfully inserted OS + MS Office software records into tbl_software_install.');
            }







            if ($duplicateFileRows) {
                $this->addLog('warning', '⚠️ Duplicates found within uploaded file: ' . count($duplicateFileRows));
                $this->addLog('debug', '📄 Sample duplicates in file: ' . json_encode(array_slice($duplicateFileRows, 0, 10)));
            }

            if ($duplicateDbRows) {
                $this->addLog('warning', '⚠️ Duplicates already existing in database: ' . count($duplicateDbRows));
                $this->addLog('debug', '📄 Sample duplicates in database: ' . json_encode(array_slice($duplicateDbRows, 0, 10)));
            }

            Storage::delete($this->filePath);
            $this->addLog('info', '🗑️ Deleted uploaded file after processing.');
            $this->saveLog('completed', [
                'rows_inserted' => $countInserted,
                'duplicates_found' => count($duplicateDbRows) + count($duplicateFileRows),
            ]);

        } catch (\Throwable $e) {
            $this->addLog('error', '💥 Error during processing: ' . $e->getMessage());
            $this->addLog('error', $e->getTraceAsString());
            $this->saveLog('error', ['exception' => $e->getMessage()]);
        }
    }

    protected function saveLog($status, $details = [])
    {
        $elapsed = round(microtime(true) - $this->startTime, 2);

        if ($this->summaryId) {
            OnbintSummary::where('id', $this->summaryId)->update([
                'status' => $status,
                'message' => implode("\n", $this->logMessages),
                'details' => json_encode(array_merge($details, [
                    'uploaded_by' => $this->uploadedBy,
                    'processing_time' => $elapsed,
                ])),
                'updated_at' => now(),
            ]);
        }
    }
}
