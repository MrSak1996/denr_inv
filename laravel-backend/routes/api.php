<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExampleController;
use App\Http\Controllers\Modules\User\UserController;
use App\Http\Controllers\Modules\Inventory\InventoryController;
use App\Http\Controllers\Modules\Reports\ReportsController;
use App\Http\Controllers\Modules\OTP\OTPController;
use App\Http\Controllers\Modules\GoogleDrive\GoogleDriveController;
use App\Http\Controllers\Modules\Settings\SettingsController;

use App\Http\Controllers\Modules\Inventory\ItemHistoryController;
use App\Http\Controllers\Modules\Inventory\VwGenInfoController;
use App\Http\Controllers\Modules\Inventory\VwInvalidDataController;

use App\Http\Controllers\Modules\DataCleaning\FileUploadController;
use App\Http\Controllers\Modules\DataCleaning\FileSummaryController;


use App\Models\VwInvalidData;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () { // ✅ Changed from 'auth:api' to 'auth:sanctum'
    Route::get('/authenticated', function (Request $request) {
        return response()->json(['authenticated' => true]);
    });
});

Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);


// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::middleware('auth:api')->group(function () {
//     Route::get('/authenticated', function (Request $request) {
//         return response()->json(['authenticated' => true]);
//     });
// });

Route::middleware('api')->group(function () {
    
    // REACT NATIVE API
    Route::get('/fetchNativeAPI',[InventoryController::class,'fetchNativeAPI']);

    Route::get('/showData', [ExampleController::class, 'showData']);
    Route::get('/getControlNo', [InventoryController::class, 'getControlNo']);
    Route::get('/generateQRCode', [InventoryController::class, 'generateQRCode']);
    Route::get('/getDivision', [InventoryController::class, 'getDivision']);
    Route::get('/getQRData', [InventoryController::class, 'getQRData']);
    Route::get('/fetchRangeEntry', [InventoryController::class, 'fetchRangeEntry']);
    // react native api
    Route::get('/getNatureWork', [InventoryController::class, 'getNatureWork']); 
    Route::get('/fetchEmploymentType', [InventoryController::class, 'fetchEmploymentType']); 
    Route::get('/fetchNatureWork', [InventoryController::class, 'fetchNatureWork']);
    Route::get('/fetchEquipment', [InventoryController::class, 'fetchEquipment']);
    Route::get('/fetchDivisionData', [InventoryController::class, 'fetchDivisionData']);
    Route::post('/updateUser', [InventoryController::class, 'updateUser']);
    Route::post('/updatePeripherals', [InventoryController::class, 'updatePeripherals']);
    // end


    // VIEWS FUNCTION
    Route::get('/vw-gen-info', [VwGenInfoController::class, 'index']);
    Route::get('/print_preview', [VwGenInfoController::class, 'print_preview']);
    Route::get('/vw-invalid-data', [VwInvalidDataController::class, 'getInvalidData']);
    Route::get('/vw-invalid-dataPerDivision', [VwInvalidDataController::class, 'getInvalidDataPerDivision']);
    //END
    
    Route::get('/fetchLatestID', [InventoryController::class, 'fetchLatestID']);
    Route::get('/getQRCodeTemp', [InventoryController::class, 'getQRCodeTemp']);
    Route::get('/getEquipment', [InventoryController::class, 'getEquipment']);
    Route::get('/getRangeCategory', [InventoryController::class, 'getRangeCategory']);
    Route::get('/getRamTypes', [InventoryController::class, 'getRamTypes']);
    Route::get('/getEmploymentType', [InventoryController::class, 'getEmploymentType']);
    Route::get('/retriveDataviaAPI', [InventoryController::class, 'retriveDataviaAPI']);
    Route::get('/retrieveSpecsData', [InventoryController::class, 'retrieveSpecsData']);
    Route::get('/retrieveSoftwareData', [InventoryController::class, 'retrieveSoftwareData']);
    Route::get('/retrievePeripheralsData', [InventoryController::class, 'retrievePeripheralsData']);
    Route::get('/getCountStatus', [InventoryController::class, 'getCountStatus']);
    Route::get('/getCountStatusPerDivision', [InventoryController::class, 'getCountStatusPerDivision']);
    Route::get('/getInventoryData', [InventoryController::class, 'getInventoryData']);
    Route::get('/fetchTransaction', [InventoryController::class, 'fetchTransaction']);
    Route::get('/getOutdatedEquipment', [InventoryController::class, 'getOutdatedEquipment']);
    Route::get('/getOutdatedEquipmentPerDivision', [InventoryController::class, 'getOutdatedEquipmentPerDivision']);
    Route::get('/provinces/{provinceId}/cities', [UserController::class, 'getCitiesByProvince']);
    Route::get('/getSummaryData', [InventoryController::class, 'getSummaryData']);
    Route::get('/get_equipment', [InventoryController::class, 'get_equipment']);

    Route::get('/export', [ReportsController::class, 'generateReport']);
    Route::get('/exportSummary', [ReportsController::class, 'generateSummaryReport']);
    Route::get('/generatePDFReport', [ReportsController::class, 'generatePDFReport']);
    Route::post('/upload-qrcodes', [ReportsController::class, 'uploadQRFiles']);

    Route::get('/checkItemStatus', [InventoryController::class, 'checkItemStatus']);
    Route::get('/getOTPStatus', [SettingsController::class, 'getOTPStatus']);
	Route::get('/latest-qr-code', [InventoryController::class, 'getLatestQRCode']);
	Route::get('/getDesktopData', [InventoryController::class, 'getDesktopData']);


    


    Route::post('post_insert_gen_info', [InventoryController::class, 'post_insert_gen_info']);
    Route::post('post_insert_specs_info', [InventoryController::class, 'post_insert_specs_info']);
    Route::post('/post_insert_software', [InventoryController::class, 'post_insert_software']);
    Route::post('/post_insert_peripheral', [InventoryController::class, 'post_insert_peripheral']);
    Route::post('/post_add_os', [InventoryController::class, 'post_add_os']);
    Route::post('/post_add_msoffice', [InventoryController::class, 'post_add_msoffice']);
    Route::post('post_final_review', [InventoryController::class, 'post_final_review']);



    //USER MANAGEMENT
    Route::post('post_save_userCred', [UserController::class, 'post_save_userCred']);
    Route::post('post_update_user', [UserController::class, 'post_update_user']);
    Route::get('/getUserRoles', [UserController::class, 'getUserRoles']);
    Route::get('/getUsers', [UserController::class, 'getUsers']);
    Route::post('/send-otp', [OTPController::class, 'sendOtp']);
    Route::post('/verify-otp', [OTPController::class, 'verifyOtp']);
    Route::post('/upload-image', [GoogleDriveController::class, 'uploadImage']);
    Route::get('/view-image/{fileId}', [GoogleDriveController::class, 'viewImage']);
    Route::get('/getGoogleFile', [GoogleDriveController::class, 'getGoogleFile']);
    Route::post('/transfer', [InventoryController::class, 'transfer']);

    //CHECK DUPLICATES
    Route::get('/getSerialProno', [InventoryController::class, 'getSerialProno']);
    Route::get('/item-history/{itemId}', [ItemHistoryController::class, 'getItemHistory']);
    Route::get('/file-summary', [FileSummaryController::class, 'index']);


    Route::post('/upload-excel', [FileUploadController::class, 'upload']);


   


});
