<?php

namespace App\Http\Controllers\Modules\GoogleDrive;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GoogleDriveController extends Controller
{
    public function uploadImage(Request $request)
    {
        // Validate the incoming filedrive
        $request->validate([
            'image' => 'required|file|mimes:jpg,png,jpeg,gif|max:2048',
            'destination_folder' => 'required|string|max:255',
            'qr_code' => 'required|string|max:255'
        ]);

        try {
            $file = $request->file('image'); // Get the uploaded file
            $dest_folder =$request->input('destination_folder');
            $qr_code =$request->input('qr_code');
            $fileName = $qr_code. '_' . $file->getClientOriginalName(); // Generate a unique file name

            // Upload file to Google Drive
            $stream = fopen($file->getRealPath(), 'r+'); // Open the file as a stream
            $filePath = 'uploads/' .$dest_folder.'/'. $fileName; // Path in Google Drive

            // Write to the disk
            Storage::disk('google')->writeStream($filePath, $stream);

            return response()->json([
                'status' => true,
                'message' => 'File uploaded successfully!',
                'path' => $filePath,
            ]);
        } catch (\Exception $e) {
            \Log::error('Google Drive Upload Error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => false,
                'message' => 'File upload failed!',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
