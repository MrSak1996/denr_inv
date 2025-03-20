<?php

namespace App\Http\Controllers\Modules\GoogleDrive;

use App\Models\UploadedFile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class GoogleDriveController extends Controller
{

    public function uploadImage(Request $request)
    {
        // Folder Mapping
        $movs_folder = [
            'Regional Office' => '1J3ZOL2eGqHgwBqtoviceupnv5BljE6Iz',
            'PENRO RIZAL' => '1UdQFxYBjOekKJeXv7yNRxhLHiw9mfpyi'
        ];

        $request->validate([
            'image' => 'required|file|mimes:jpg,png,jpeg,gif|max:2048',
            'destination_folder' => 'required|string|max:255',
            'qr_code' => 'required|string|max:255'
        ]);

        try {
            $file = $request->file('image');
            $dest_folder = $request->input('destination_folder');
            $qr_code = $request->input('qr_code');
            $fileName = $qr_code . '_' . $file->getClientOriginalName();
            $filePath = 'uploads/' . $dest_folder . '/' . $fileName;
            Storage::disk('google')->write($filePath, file_get_contents($file));
            $files = Storage::disk('google')->listContents('', true);

            $fileMeta = collect($files)->where('path', $filePath)->first();
            $fileId = $fileMeta['extraMetadata']['id'] ?? null;

            if (!$fileId) {
                throw new \Exception('File upload failed: Unable to retrieve file ID.');
            }

            $publicUrl = isset($movs_folder[$dest_folder])
                ? "https://drive.google.com/drive/folders/{$movs_folder[$dest_folder]}"
                : null;

            $uploadedFile = UploadedFile::create([
                'file_name'          => $fileName,
                'file_path'          => $filePath,
                'destination_folder' => $dest_folder,
                'qr_code'            => $qr_code,
                'folder_id'          => $movs_folder[$dest_folder] ?? null,
                'file_id'            => $fileId,
            ]);

            return response()->json([
                'status'    => true,
                'message'   => 'File uploaded successfully!',
                'file_id'   => $fileId,
                'image_url' => $publicUrl,
                'data'      => $uploadedFile,
            ], 200, [], JSON_UNESCAPED_SLASHES);
        } catch (\Exception $e) {
            Log::error('Google Drive Upload Error', ['error' => $e->getMessage()]);

            return response()->json([
                'status'  => false,
                'message' => 'File upload failed!',
                'error'   => $e->getMessage(),
            ]);
        }
    }

    public function getGoogleFile(Request $request)
    {
        $item_id = $request->query('id');
    
        // Validate input
        if (!$item_id) {
            return response()->json(['error' => 'item_id is required'], 400);
        }
    
        // Query data
        $query = DB::table('tbl_general_info as g')
        ->select('file_id')
            ->leftJoin('tbl_uploaded_file as p', 'p.qr_code', '=', 'g.id')
            ->where('g.id', $item_id)
            ->get(); // Use `first()` if you expect only one record
    
        // Return JSON response
        return response()->json($query);
    }
}
