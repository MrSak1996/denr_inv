<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UploadedFile extends Model
{
    use HasFactory;
    protected $connection = 'mysql';

    protected $table = 'tbl_uploaded_file';


    protected $fillable = ['file_name', 'file_path', 'destination_folder', 'qr_code','folder_id','file_id','created_at','updated_at'];

}
