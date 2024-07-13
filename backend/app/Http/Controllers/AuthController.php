<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function Register(Request $req){
        $fields = $req->validate([
            'email' => 'required|email',
            'display_name' => 'required|string',
            'smtp_password' => 'required|string',
            'password' => 'required|string',
        ]);

        // post User data
        $randInit = str_replace("-", "", (string)rand(1,9999).(string)Carbon::now()->toDateString());
        $user = User::create([
            'user_id' => 'USER_'.$randInit,
            'email' => $fields['email'],
            'display_name' => $fields['display_name'],
            'smtp_password' => $fields['smtp_password'],
            'password' => bcrypt($fields['password']),
        ]);
        $token = $user->createToken('myapptoken')->plainTextToken;
        $response = [
            'user' => $user,
            'token' => $token, // token để authenticate tính năng dưới dạng Bearer Token (Postman)
        ];

        return response($response, 201);
    }

    public function Login(Request $req){
        $fields = $req->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
        
        // check User data
        $getUserByEmail = User::where('email', $fields['email'])->first(); 

        if(!$getUserByEmail || !Hash::check($fields['password'], $getUserByEmail->password)){
            return response([
                'message' => 'Sai thong tin dang nhap'
            ], 401);
        }
         
        $displayName = $getUserByEmail->display_name;
        $token = $getUserByEmail->createToken('myapptoken')->plainTextToken;
        $getSMTP_Password = $getUserByEmail->smtp_password;

        return response()->json([
            'SMTP_pswrd' => $getSMTP_Password,
            'user' => $getUserByEmail,
            'display_name' => $displayName,
            'token' => $token, // token để authenticate tính năng dưới dạng Bearer Token (Postman)
        ], 201);
    }

    public function LogOut(Request $req){
        auth()->user()->tokens()->delete();

        return [
            'message' => "Đã đăng xuất",
        ];
    }

    public function Profile(){
        $userData = auth()->user();
        $userId = auth()->user()->user_id;

        return response()->json([
            'User Information' => $userData,
            'user_id' => $userId,
        ], 200);
    }
}
