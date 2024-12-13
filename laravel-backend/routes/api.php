<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExampleController;
use App\Http\Controllers\Modules\User\UserController;
use App\Http\Controllers\Modules\Inventory\InventoryController;
use App\Http\Controllers\Modules\Reports\ReportsController;
use App\Http\Controllers\Modules\OTP\OTPController;
use App\Http\Controllers\Modules\GoogleDrive\GoogleDriveController;

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
Route::post('login',[UserController::class,'login']);
Route::middleware('auth:sanctum')->post('/logout',[UserController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth:api')->group(function () {
    Route::get('/authenticated', function (Request $request) {
        return response()->json(['authenticated' => true]);
    });
});

Route::middleware('api')->group(function () {
    Route::get('/showData', [ExampleController::class, 'showData']);
    Route::get('/getControlNo', [InventoryController::class, 'getControlNo']);
    Route::get('/generateQRCode', [InventoryController::class, 'generateQRCode']);
    Route::get('/getDivision', [InventoryController::class, 'getDivision']);
    Route::get('/getNatureWork', [InventoryController::class, 'getNatureWork']);
    Route::get('/getEquipment', [InventoryController::class, 'getEquipment']);
    Route::get('/getRangeCategory', [InventoryController::class, 'getRangeCategory']);
    Route::get('/getEmploymentType', [InventoryController::class, 'getEmploymentType']);
    Route::get('/retriveDataviaAPI', [InventoryController::class, 'retriveDataviaAPI']);
    Route::get('/retrieveSpecsData', [InventoryController::class, 'retrieveSpecsData']);
    Route::get('/retrieveSoftwareData', [InventoryController::class, 'retrieveSoftwareData']);
    Route::get('/retrievePeripheralsData', [InventoryController::class, 'retrievePeripheralsData']);
    Route::get('/getCountStatus', [InventoryController::class, 'getCountStatus']);
    Route::get('/getInventoryData', [InventoryController::class, 'getInventoryData']);
    Route::get('/getOutdatedEquipment', [InventoryController::class, 'getOutdatedEquipment']);
    Route::get('/provinces/{provinceId}/cities', [UserController::class, 'getCitiesByProvince']);

    Route::get('/export', [ReportsController::class, 'generateReport']);
    Route::get('/generatePDFReport', [ReportsController::class, 'generatePDFReport']);
    Route::get('/checkItemStatus', [InventoryController::class, 'checkItemStatus']);


    Route::post('post_insert_gen_info', [InventoryController::class, 'post_insert_gen_info']);
    Route::post('post_insert_specs_info', [InventoryController::class, 'post_insert_specs_info']);
    Route::post('/post_insert_software', [InventoryController::class, 'post_insert_software']);
    Route::post('/post_insert_peripheral', [InventoryController::class, 'post_insert_peripheral']);
    Route::post('/post_add_os', [InventoryController::class, 'post_add_os']);
    Route::post('/post_add_msoffice', [InventoryController::class, 'post_add_msoffice']);
    Route::post('post_final_review', [InventoryController::class, 'post_final_review']);


    //USER MANAGEMENT
    Route::post('post_save_userCred', [UserController::class, 'post_save_userCred']);
    Route::get('/getUserRoles', [UserController::class, 'getUserRoles']);
    Route::get('/getUsers', [UserController::class, 'getUsers']);
    Route::post('/send-otp', [OTPController::class, 'sendOtp']);
    Route::post('/verify-otp', [OTPController::class, 'verifyOtp']);
    Route::post('/upload-image', [GoogleDriveController::class, 'uploadImage']);


   


});
