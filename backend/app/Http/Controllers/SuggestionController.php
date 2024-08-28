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
        $getPaginatedData = Suggestion::orderBy('rating', 'desc')->paginate(3);

        return response()->json([
            'paginated_data' => $getPaginatedData,
            'data' => $getMailContentFromHistory,
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
