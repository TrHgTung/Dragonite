<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SuggestionController extends Controller
{
    public function GetSuggestion(){
        $getMailContentFromHistory = Mail::pluck('content');

        // Goi y lay noi dung mail: Chi lay nhung content co do dai, va phai loai bo nhung ten/thong tin ca nhan
        $result = array();
        foreach($getMailContentFromHistory as $data){
            if(strlen($data) > 15){
                $result = $data;
            }
        }

        return response()->json([
            'data' => $result,
        ]);
    }
}
