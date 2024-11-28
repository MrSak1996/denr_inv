<?php

namespace App\Http\Controllers\Modules\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;



use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\HasApiTokens; // Import HasApiTokens trait
use Illuminate\Support\Facades\Validator;



use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function login(Request $request)
    {
        // Retrieve the user by username
        $user = User::where('username', $request->input('username'))->first();
        // Check if user exists and verify the password
        // if ($user && Hash::check($request->password, $user->password)) {
        if ($user && $request->input('password') === $user->password) {

            // Create an API token
            $token = $user->createToken('auth-token')->plainTextToken;

            // Update the user with the new token if needed (but typically not necessary)
            $user->update([
                'api_token' => $token
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Success',
                'api_token' => $token,
                'user_role' => $user->user_role,
                'userId' => $user->id,
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials',
            ]);
        }
    }

    public function getCitiesByProvince($provinceId)
    {
        if (!is_numeric($provinceId)) {
            return response()->json(['error' => 'Invalid province code'], 400);
        }

        $municipalities = DB::table('geo_map')
            ->select('mun_code', DB::raw('MIN(geo_code) as geo_code'), DB::raw('MIN(mun_name) as mun_name'))
            ->where('reg_name', 'REGION IV-A CALABARZON')
            ->where('reg_code', '04')
            ->where('prov_code', $provinceId)
            ->groupBy('mun_code')
            ->get();


        return response()->json($municipalities);
    }

    public function logout()
    {
        $user = Auth::guard('api')->user();
        if ($user) {
            $user->tokens()->delete();
        }
        return response()->json(['message' => 'Successfully logged out'], 200);
    }
}
