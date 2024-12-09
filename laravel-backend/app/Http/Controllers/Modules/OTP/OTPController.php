<?php

namespace App\Http\Controllers\Modules\OTP;

use App\Http\Controllers\Controller;
use App\Models\OTP;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class OTPController extends Controller
{
    public function sendOtp(Request $request)
    {

        $request->validate(['email' => 'required|email']);

        $otpCode = rand(100000, 999999);

        // Save OTP to the database
        Otp::create([
            'email' => $request->email,
            'otp' => $otpCode,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

        // Send OTP via email
        Mail::raw("A sign in attempt requires further verification because we did not recognize your device. To complete the sign in, enter the verification code on the unrecognized device. \n Verification code: $otpCode ", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Login | OTP');
        });

        return response()->json(['message' => 'OTP sent successfully!'], 200);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'user_email' => 'required|email',
            'otp' => 'required',
        ]);

        $otpRecord = Otp::where('email', $request->user_email)
            ->where('otp', $request->otp)
            ->where('expires_at', '>=', Carbon::now())
            ->first();


        if ($otpRecord) {
            $otpRecord->update(['is_verified' => true]);
            return response()->json(
                [
                    'status' => true,
                    'message' => 'OTP verified successfully!'
                ],
                200
            );
        }

        return response()->json(
            [
                'status' => false,
                'message' => 'Invalid or expired OTP.'
            ],
            400
        );
    }
}
