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
        if ($user && Hash::check($request->input('password'), $user->password)) {

            // Create an API token
            $token = $user->createToken('auth-token')->plainTextToken;

            // Update the user with the new token if needed (but typically not necessary)
            $user->update([
                'api_token' => $token
            ]);

            return response()->json([
                'status' => true,
                'email'  => $user->email,
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

    public function post_save_userCred(Request $req)
    {
        $validated = $req->validate([
            'geo_code' => 'nullable|string|max:100', // Optional, string, max length 100
            'region' => 'nullable|string|max:100', // Optional, string, max length 100
            'province' => 'nullable|integer', // Optional, string, max length 100
            'city_mun' => 'nullable|string|max:100', // Optional, string, max length 100
            'first_name' => 'required|string|min:2|max:100', // Required, string, minimum 2 characters, max 100
            'middle_name' => 'nullable|string|max:100', // Optional, string, max length 100
            'last_name' => 'required|string|min:2|max:100', // Required, string, minimum 2 characters, max 100
            'complete_address' => 'nullable|string|max:100',
            'designation' => 'nullable|integer', // Optional, string, max length 100
            'sex' => 'nullable|integer', // Optional, string, must be 'male' or 'female'
            'division' => 'nullable|integer', // Optional, string, max length 100
            'employment_status' => 'nullable|integer', // Optional, string, max length 100
            'position' => 'nullable|string|max:100', // Optional, string, max length 100
            'email' => 'nullable|email|max:150', // Optional, valid email format, max length 150
            'contact_details' => 'nullable|string|max:15', // Optional, string, max length 15 (e.g., for phone numbers)
            'roles' => 'nullable|integer', // Optional, string, max length 50
            // 'assign_module' => 'nullable|string|max:50', // Optional, string, max length 50
            'username' => 'required|string|min:5|max:50|unique:users,username', // Required, string, unique, between 5 and 50 characters
            'password' => 'required|string|max:100', // Required, string, at least 8 characters, must be confirmed
        ]);


        // Insert the data into the GeneralInformation model
        $user_opts = User::updateOrCreate(
            ['id' => $validated['id'] ?? null], // Use 'id' as the unique identifier; if not provided, create a new record
            [
                'geo_id' => $validated['geo_code'] ?? null,
                'region_c' => $validated['region'] ?? null,
                'province_c' => $validated['province'] ?? null,
                'city_mun_c' => $validated['city_mun'] ?? null,
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],
                'complete_address' => $validated['complete_address'],
                'designation' => $validated['designation'] ?? null,
                'sex' => $validated['sex'] ?? null,
                'division_id' => $validated['division'] ?? null,
                'employment_status' => $validated['employment_status'] ?? null,
                'position' => $validated['position'] ?? null,
                'email' => $validated['email'] ?? null,
                'mobile_no' => $validated['contact_details'] ?? null,
                'roles' => $validated['roles'] ?? null,
                // 'assign_module' => $validated['assign_module'] ?? null,
                'username' => $validated['username'],
                'password' => bcrypt($validated['password']), // Encrypt the password before storing it
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Return a response with the created ID and a success message
        return response()->json([
            'message' => 'Data saved successfully.',
            'id' => $user_opts->id, // Returning the ID of the newly created record
        ], 200);
    }

    public function getUserRoles()
    {
        $results = DB::table('user_roles')
            ->select(DB::raw('id,roles'))
            ->get();
        return response()->json($results);
    }

    public function retriveDataviaAPI(Request $request)
    {
        $id = $request->query('id');

        $results = DB::table('users')
            ->select(DB::raw(
                'id, 
                control_no, 
                division_id as selectedDivision, 
                section_id as selectedSection, 
                acct_person, 
                acct_person_division_id as selectedAcctDivision , 
                actual_user, 
                sex, 
                actual_user_division_id as selectedActualDivision, 
                actual_employment_type as employmentType , 
                work_nature_id as selectedWorkNature, 
                qr_code, 
                equipment_type as selectedEquipmentType, 
                brand, 
                model, 
                property_no,
                serial_no, 
                range_category as selectedRangeCategory, 
                acquisition_cost, 
                year_acquired, 
                shelf_life, 
                remarks, 
                status, 
                created_at,
                updated_at'
            ))
            ->where('id', $id)
            ->get();

        return response()->json($results);
    }

    public function getUsers(Request $request)
    {
        $api_token = $request->query('api_token');
        $id = $request->query('id');

        try {
            // Start building the query
            $query = DB::table('users as u')
                ->leftJoin('tbl_division as d', 'd.id', '=', 'u.division_id')
                ->leftJoin('tbl_employment_type as e', 'e.id', '=', 'u.employment_status')
                ->leftJoin('user_roles as ur', 'ur.id', '=', 'u.roles')
                ->leftJoin('geo_map as g', 'g.geo_code', '=','u.geo_id')
                ->select(
                    'u.id',
                    'u.first_name',
                    'u.middle_name',
                    'u.last_name',
                    'u.position',
                    'u.complete_address',
                    'u.username',
                    'u.roles as role_id',
                    'ur.roles',
                    'u.sex',
                    'u.employment_status',
                    DB::raw('CONCAT(u.first_name, " ", u.last_name) as name'),
                    'd.division_title',
                    'u.username',
                    'u.email',
                    'u.mobile_no',
                    'u.province_c',
                    'u.city_mun_c',
                    'u.division_id',
                    'g.prov_name',
                    'g.mun_name'
                );
        
            // Conditionally add the where clause
            if($id)
            {
                     $query->where('u.id', $id);
            }
            if ($api_token) {
                $query->where('u.api_token', $api_token);
            }
        
            // Execute the query
            $results = $query->get();

            // Return the results as JSON
            return response()->json([
                'status' => true,
                'data' => $results,
            ], 200);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch users.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

   

}
