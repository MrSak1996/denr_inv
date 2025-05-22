<?php

namespace App\Http\Controllers\Modules\GoogleDrive;

use App\Models\UploadedFile;
use Illuminate\Support\Facades\Log;

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
            'CENRO Calaca' => '12llA50qmuNsWWjwx66UaM0WFXmXZ5-tT',
            'CENRO Calauag' => '1pD2tOd5IajnJ1MaDpCdyh9K8qEPfEvTo',
            'CENRO Catanauan' => '1fBliA4G6ZXUwOnMlVBTjqMuQlPq99h1r',
            'CENRO Lipa City' => '16rXeEXvSUSz9PgKooLYnYCfBYITMf19V',
            'CENRO Real' => '1Hg0m68_t0JJfXo_jw8UdeXMlTLz8WrL8',
            'CENRO Sta. Cruz' => '1WuOPmKgXS5smJ-N2aJO6ZDacbi5nH3jZ',
            'CENRO Tayabas' => '1g5ayDEUs-Wg6QBHpK655MLiNB9cLkGYb',
            'PENRO BATANGAS' => '1yZNDiZox_izPLafHaxe3BrLF6X1K8kr0',
            'PENRO CAVITE' => '1r3tW_ZpGCkwnV1uvoM5jPBBnT1pqhNbq',
            'PENRO LAGUNA' => '1U8tH52i0W4y2ulsg-iK2TexN6FtzZSok',
            'PENRO QUEZON' => '1cMrNgggUURXQCfSqRlE7na1iFJiDxHHG',
            'PENRO RIZAL' => '1UdQFxYBjOekKJeXv7yNRxhLHiw9mfpyi',
            'Regional Office' => '1J3ZOL2eGqHgwBqtoviceupnv5BljE6Iz',
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
