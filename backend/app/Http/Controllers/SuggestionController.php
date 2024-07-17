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
use Illuminate\Support\Collection;

class SuggestionController extends Controller
{
    public function GetSuggestion(){
        $getMailContentFromHistory = Mail::pluck('content');

        // Goi y lay noi dung mail: Chi lay nhung content co do dai, va phai loai bo nhung ten/thong tin ca nhan
        $res = array();
        foreach($getMailContentFromHistory as $data){
            if(strlen($data) > 15){
                $res[] = $data;
            }
        }

        $result = array();
        $result = array_unique($res);   // Xoa cac content trung lap
        
        // for($i=0; $i < $getMailContentFromHistory->count(); $i++){
        //     if(strlen($getMailContentFromHistory[$i]) > 15){
        //         $result[] = $getMailContentFromHistory[$i];
        //     }
        // }

        $processedArray = array_map(function ($sentence) {
            $words = explode(' ', $sentence);
            $filteredWords = array();
    
            foreach ($words as $index => $word) {
                if ($index == 0 || !ctype_upper($word[0])) {  // Xoa cac tu viet hoa (ten rieng), nhung giu nguyen nhung tu dau cau
                    $filteredWords[] = $word;
                }
            }
    
            return implode(' ', $filteredWords);
        }, $result);

        return response()->json([
            'data' => $processedArray,
        ]);
    }
}
