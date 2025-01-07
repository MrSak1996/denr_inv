<?php

namespace App\Http\Controllers\Modules\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;
class SettingsController extends Controller
{
    public function getOTPStatus()
    {
        try {
            // Query the database to get the OTP settings
            $otpSetting = DB::table('settings')
                ->where('module_title', 'OTP Verification') 
                ->value('options'); // Fetch only the 'options' column

            // Convert the options value to a boolean (e.g., 'enabled' => true, otherwise false)
            $isEnabled = ($otpSetting === 'true'); // Adjust logic based on your actual 'options' values

            return response()->json($isEnabled, 200);
        } catch (\Exception $e) {
            return response()->json(false, 500); // Return false on error
        }
    }
}
