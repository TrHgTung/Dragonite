<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MailController extends Controller
{
    public function GetMails(){ // get all sent mails
        // lay tu auth sanctum laravel
        $userId = (string)auth()->user()->user_id; 
        $getSMTP_Password = (string)auth()->user()->smtp_password;

        $getMailsByUsrId = Mail::where('user_id', $userId)->where('status', '1')->get();

        return response([
            'data' => $getJobsByUsrId,
        ], 200);
    }

    public function SendMail(Request $req){
        $randNum = (string)rand(1111,9999);
        $userId = (string)auth()->user()->user_id;
        $updateModifiedDate = (string)Carbon::now()->toDateString();
        $mailIdInit = 'MAIL_'.str_replace('-','', $updateModifiedDate).'_'.$randNum.'_'.$userId;

        $req->validate([
            'subject' => 'required',
            'content' => 'required',
            'to' => 'required',
            // 'cc' => 'required',
            // 'bcc' => 'required',
            //'attachment' => 'required',
        ]);

        $data = $req->all();
        $data['mail_id'] = $mailIdInit;
        $data['user_id'] = $userId;
        $data['last_modified'] = $updateModifiedDate;

        // Xu ly du lieu de gui e-mail
        $getUserName = (string)auth()->user()->display_name;
        $getAddressTo = $req->to;
        $getAddressCC = $req->cc;
        $getAddressBCC = $req->bcc;
        $getAttachment = $req->attachment;
        $getSubject = $req->subject;
        $getContent = $req->content;

        try {
            $hostMail = 'tungng14@gmail.com';  // change your mail address
            //Server settings
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = $hostMail;                     //SMTP username
            $mail->Password   = $getSMTP_Password;             //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
        
            //Recipients
            $mail->setFrom($hostMail, $getUserName);
            $mail->addAddress($getAddressTo, 'Laravel E-mail Sending System');     //Add a recipient

            if($getAddressCC){
                $mail->addCC($getAddressCC);
                
            } else if($getAddressBCC){
                $mail->addBCC($getAddressBCC);
            }
            else if($getAttachment) {
                $mail->addAttachment('/var/tmp/'.$getAttachment);
            }

            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = $getSubject;
            $mail->Body    = $getContent;
            // $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
        
            $mail->send();

            $data['status'] = '1';
            //echo 'Message has been sent';
        } catch (Exception $e) {
            $data['status'] = '0';
            // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            return response()->json([
                'message' => 'Khong the gui e-mail, hay kiem tra ket noi Internet',
            ]);
        }

        // $data['status'] = '0';

        Jobs::create($data);
           
        return response()->json(
            [
                'mail_data' => $data,
            ]
        );
    }

    public function JobDetails($id){ // làm tới đây rồi
        $userId = auth()->user()->user_id;
        $getData = Jobs::find($id);

        $getCharacterId = DB::table('jobs')
                            ->join('assistants', 'jobs.job_id', '=', 'assistants.job_id')
                            ->where('jobs.user_id', $userId)
                            ->where('jobs.id', $id)
                            ->where('jobs.status', '1')
                            ->select('assistants.character_id')
                            ->get();

        $checkPokemonShiny = DB::table('jobs')
                            ->join('assistants', 'jobs.job_id', '=', 'assistants.job_id')
                            ->where('jobs.id', $id)
                            ->where('jobs.user_id', $userId)
                            ->where('jobs.status', '1')
                            ->select('assistants.is_shiny')
                            ->get();

        $getPokemonName = DB::table('jobs')
                            ->join('assistants', 'jobs.job_id', '=', 'assistants.job_id')
                            ->join('characters', 'assistants.character_id', '=', 'characters.character_id')
                            ->where('jobs.id', $id)
                            ->where('jobs.user_id', $userId)
                            ->where('jobs.status', '1')
                            ->select('characters.character_name')
                            ->get();

        // foreach($getPokemonName as $pokemon){
        //     if($pokemon->character_name === $id){
        //         $matchedPokemon = $pokemon->character_name;
        //         break;
        //     }
        // }

        if($userId == $getData->user_id){
            return response([
                'get_pokemon_name' => $getPokemonName,
                'get_character_id' => $getCharacterId,
                'check_pokemon_shiny' => $checkPokemonShiny,
                'result' => $getData,
            ], 200);
        }
        else{
            return response([
                'message' => 'Da co loi xay ra',
            ], 401);
        }
        
    } 

    public function Update(Request $req, $id){
        $updateModifiedDate = (string)Carbon::now()->toDateString();

        $userId = (string)auth()->user()->user_id;
        $getJobsAuthorized = Jobs::where('user_id', $userId)->where('status', '1')->where('id', $id)->first(); // chỉ lấy những job có userId được authorized

        if (!$getJobsAuthorized) {
            return response()->json(['error' => 'Khong tim thay'], 404);
        }
        else if($getJobsAuthorized){
            $data = $req->all();
            $data['last_modified'] = $updateModifiedDate;
    
            $getJobsAuthorized->update($data);
            
            return response()->json([
                'message' => 'Da cap nhat thong tin cho ID Task: '. $id
            ], 200);
           
        }
        else{
            return response()->json([
                'message' => 'Thao tac bi chan vi ban khong du quyen (Not Authorized)',
            ], 401);
        }
        //  echo $getJobsAuthorized;
        //  return;
        
    }
    
    public function Finish(Request $req, $id){
        $updateModifiedDate = (string)Carbon::now()->toDateString();

        $userId = (string)auth()->user()->user_id;
        $getJobsAuthorized = Jobs::where('user_id', $userId)->where('status', '1')->where('id', $id)->first(); // chỉ lấy những job có userId được authorized

        if (!$getJobsAuthorized) {
            return response()->json(['error' => 'Không tìm thấy'], 404);
        }
        else if($getJobsAuthorized){
            //$data = $req->all();
            $data['status'] = '0';
    
            $getJobsAuthorized->update($data);
            
            return response()->json([
                'message' => 'Da danh dau hoan thanh cho ID Task: '. $id
            ], 200);
        }
        else{
            return response()->json([
                'message' => 'Thao tac bi chan vi ban khong du quyen (Not Authorized)',
            ], 401);
        }
    }

    // public function Destroy($id){ // for testing API
    //     return Jobs::destroy($id);
    // }

    public function XemCacJobsDaHoanThanh(){ // get all jobs but by a specific user (auth requested)
        // $jobs = Jobs::all(); // for testing API
        $userId = auth()->user()->user_id;

        // $getJobsByUsrId = Jobs::where('user_id', $userId)->where('status', '0')->get();
        $getJobsByUsrId = Jobs::where('user_id', $userId)->get();

        return response([
            'result' => $getJobsByUsrId,
        ], 200);
    }
}
