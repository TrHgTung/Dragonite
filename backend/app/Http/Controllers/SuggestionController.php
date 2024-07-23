<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mail;
use App\Models\User;
use App\Models\Suggestion;
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
        $getMailContentFromHistory = Suggestion::orderBy('rating', 'desc')->get();

        // Goi y lay noi dung mail: Chi lay nhung content co do dai, va phai loai bo nhung ten/thong tin ca nhan
        $res = array();
        //$getOnlyContentMail = $getMailContentFromHistory->content;
        foreach($getMailContentFromHistory as $data){
            if(strlen($data->content) > 15){
                $res[] = [
                    'id' => $data->id,
                    'content' => $data->content,
                    'rating' => $data->rating
                ];
            }
        }

        //$result = array();
        $result = array_unique($res, SORT_REGULAR);   // Xoa cac content trung lap
       
        $processedArray = array_map(function ($sentence) {
            $words = explode(' ', $sentence['content']);
            $filteredWords = array();
    
            foreach ($words as $index => $word) {
                if ($index == 0 || !ctype_upper($word[0])) {  // Xoa cac tu viet hoa (ten rieng), nhung giu nguyen nhung tu dau cau
                    $filteredWords[] = $word;
                }
            }

            $sentence['content'] = implode(' ', $filteredWords);
    
            // return implode(' ', $filteredWords);
            return $sentence;
        }, $result);

        foreach($processedArray as $data3){
            if(strlen($data3['content']) > 15){
                $finalResult[] = [
                    'id' => $data3['id'],
                    //
                    // chỉ láy ra tối đa 250 ký tự trong content; còn mb_convert_encoding dùng để fix lôix "Malformed UTF-8 characters, possibly incorrectly encoded"
                    'content' => mb_convert_encoding(substr($data3['content'], 0, 250),'UTF-8', 'UTF-8'),
                    'rating' => $data3['rating']
                ];
            }
        }

        return response()->json([
            'data' => $finalResult,
        ]);
    }

    public function CheckPoint($id){
        $getSuggestById = Suggestion::where('id', $id)->first();

        if(!$getSuggestById){
            return response->json([
                'error' => 'Khong tim thay'
            ]);
        }
        else{
            $upvote = $getSuggestById->rating + 1;
            $data['rating'] = $upvote;
    
            $getSuggestById->update($data);
            
            return response()->json([
                'message' => 'Da upvote cho ID content: '. $id
            ], 200);
        }
    }
}
