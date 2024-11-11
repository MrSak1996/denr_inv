<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExampleController;
use App\Http\Controllers\Modules\User\UserController;
use App\Http\Controllers\Modules\Inventory\InventoryController;


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


Route::middleware('api')->group(function () {
    Route::get('/showData', [ExampleController::class, 'showData']);
    Route::get('/getControlNo', [InventoryController::class, 'getControlNo']);
    Route::get('/getDivision', [InventoryController::class, 'getDivision']);
    Route::get('/getNatureWork', [InventoryController::class, 'getNatureWork']);
    Route::get('/getEquipment', [InventoryController::class, 'getEquipment']);
    Route::get('/getRangeCategory', [InventoryController::class, 'getRangeCategory']);
    Route::get('/getEmploymentType', [InventoryController::class, 'getEmploymentType']);
    Route::get('/retriveDataviaAPI', [InventoryController::class, 'retriveDataviaAPI']);
    Route::get('/retrieveSpecsData', [InventoryController::class, 'retrieveSpecsData']);

    Route::post('post_insert_gen_info', [InventoryController::class, 'post_insert_gen_info']);
    Route::post('post_insert_specs_info', [InventoryController::class, 'post_insert_specs_info']);
    Route::post('/post_insert_software', [InventoryController::class, 'post_insert_software']);
    Route::post('/post_insert_peripheral', [InventoryController::class, 'post_insert_peripheral']);

});
Route::post('login', [UserController::class, 'login']);
Route::post('logout', [UserController::class, 'logout']);
