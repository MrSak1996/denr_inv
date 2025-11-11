<?php

namespace App\Http\Controllers\Modules\DataCleaning;

use Illuminate\Http\Request;
use App\Jobs\ProcessUploadedFileJob;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;



class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'excel_file' => 'required|mimes:xls,xlsx|max:10240',
            'registered_loc' => 'required',
            'userId' => 'required'
        ]);

        $uploadedFile = $request->file('excel_file');
        $registered_loc = $request->input('registered_loc');
        $userId = $request->input('userId');

        // ✅ Get original filename (real name)
        $originalFileName = $uploadedFile->getClientOriginalName();

        // ✅ Store file (returns hashed storage path)
        $path = $uploadedFile->store('uploads');

        // ✅ Get logged-in user
        $uploadedBy = auth()->user()->username ?? 'system';

        // ✅ Dispatch the job with the CORRECT parameters
        ProcessUploadedFileJob::dispatch($userId,$registered_loc,$originalFileName, $path, $uploadedBy);

        return response()->json([
            'message' => 'File uploaded successfully!',
            'filename' => $originalFileName,
        ]);
    }



}
