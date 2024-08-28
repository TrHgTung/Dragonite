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
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

class MailController extends Controller
{
    public function GetMails(){ // get all sent mails
        // lay tu auth sanctum laravel
        // try{
            $userId = (string)auth()->user()->user_id; 
            $getSMTP_Password = (string)auth()->user()->smtp_password;

            $getMailsByUsrId = Mail::where('user_id', $userId)->where('status', 'n')->get();
            $getSentMail = Mail::where('user_id', $userId)->where('status', 'y')->get();
            $getNumberOfSentMail = Mail::where('user_id', $userId)->where('status', 'y')->get()->count();

            return response([
                'data' => $getMailsByUsrId,
                'all_mails_sent' => $getSentMail,
                'the_number_of_mail_sent' => $getNumberOfSentMail,
            ], 200);
        // } 
        // catch (Exception $e){
        //     return response([
        //         'error' => 'Ban chua dang nhap hoac du lieu bi chan',
        //     ], 401);
        // }
    }

    public function SaveMail(Request $req){
        $randNum = (string)rand(1111,9999);
        $userId = (string)auth()->user()->user_id;
        $updateModifiedDate = (string)Carbon::now()->toDateString();
        $mailIdInit = 'MAIL_'.str_replace('-','', $updateModifiedDate).'_'.$randNum.'_'.$userId;
    
        $data = $req->all();
        $data2 = array();

        $getUserName = (string)auth()->user()->display_name;
        $getUserEmail = (string)auth()->user()->email;

        $data['user_id'] = $userId;
        $data['mail_id'] = $mailIdInit;
        $data['from'] = $getUserEmail;
        $data['time_sent'] = $updateModifiedDate;
        $data['status'] = 'n';  // khoi tao trang thai chua gui (no)

        //$data['attachment'] = $req->file("attachment");
        $getFile = $req->file('attachment');

        if($req->hasFile('attachment')){
            $getFileName = $getFile->getClientOriginalName();
            // $realFileName = current(explode('.',$getFileName));
            $realFileName = pathinfo($getFileName, PATHINFO_FILENAME);
            $getFileExtension = $getFile->getClientOriginalExtension();

            $getRandomNumberForAddingToFileName = rand(1111,9999);
    
            $newFileInit = 'FILE'.$getRandomNumberForAddingToFileName.'_'.$realFileName.'.'.$getFileExtension;
    
            $getFile->storeAs('var/tmp', $newFileInit, 'public');

            $data['attachment'] = $newFileInit;
            
            // SAVE TO Suggestion
            // $data2['content'] = $req->content;
            // $data2['rating'] = 0;

            $data2 = array();
            // foreach($data2 as $dta2){
                if(strlen($req->content) > 15){
                    $data2[] = [
                        'content' => $req->content,
                        'rating' => 0
                    ];
                }
            // }
    
            $result = array_unique($data2['content'], SORT_REGULAR);   // Xoa cac content trung lap
           
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
                
            // Suggestion::create($data2);
            Suggestion::create($finalResult);

            Mail::create($data);

            return response()->json([
                // 'suggestion' => $data2,
                'suggestion' => $result,
                'data' => $data,
            ], 200);
        }

        // save to Suggestion
        $data2['content'] = $req->content;
        $data2['rating'] = 0;

        Mail::create($data);
        Suggestion::create($data2);
           
        return response()->json([
                'suggestion' => $data2,
                'mail_data' => $data,
            ]
        );
    }

    public function SendMail(Request $req){
        $userId = (string)auth()->user()->user_id;
        $getUserName = (string)auth()->user()->display_name;

        // Lay du lieu tu front-end
        $getUserEmail = (string)$req->email;
        $getSMTP_Password = (string)$req->smtp;

        // Xu ly du lieu de gui e-mail
        
        $getMailsDataForSending = Mail::where('from', $getUserEmail)
                                        ->where('status', 'n')
                                        ->get();

        foreach ($getMailsDataForSending as $mailData) {
            $getAddressTo = $mailData->to;
            $getAttachment = $mailData->attachment;
            $getSubject = $mailData->subject;
            $getContent = $mailData->content;
            $mailId = $mailData->mail_id;

            $getEverySingleMail = Mail::where('user_id', $userId)
                                        ->where('status', 'n')
                                        ->where('mail_id', $mailId)
                                        ->first();

            $mail = new PHPMailer(true);
            try {
                $mail->CharSet = "UTF-8";
                //Server settings
                $mail->SMTPDebug = 0;                      //Enable verbose debug output
                $mail->isSMTP();                                            //Send using SMTP
                $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
                $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
                $mail->Username   = $getUserEmail;                     //SMTP username
                $mail->Password   = $getSMTP_Password;             //SMTP password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
                $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
            
                //Recipients
                $mail->setFrom($getUserEmail, $getUserName);
                $mail->addAddress($getAddressTo, $getAddressTo);     //Add a recipient

                if($getAttachment) {
                     //$mail->addAttachment('public/storage/var/tmp/'.$getAttachment);
                    $attachmentPath = public_path('storage/var/tmp/' . $getAttachment);
                    if (file_exists($attachmentPath)) {
                        $mail->addAttachment($attachmentPath);
                    } else {
                        return response()->json([
                            'mail_status' => 'File ko ton tai'], 404);
                    }
                }

                //Content
                $mail->isHTML(true);                                  //Set email format to HTML
                $mail->Subject = $getSubject;
                $mail->Body    = $getContent;
            
                $mail->send();

                $data['status'] = 'y'; // yes (da gui)

                $getEverySingleMail->update($data);
            } catch (Exception $e) {
                return response()->json([
                    'mail_status' => 'Khong the gui e-mail, hay kiem tra ket noi Internet (500)',
                ]); // loi 500 server
            }
        }

        return response()->json([
                'mail_status' => 'Gui e-mail thanh cong (200)',
            ]
        );
    }

    public function GetMail($id){
        $userId = auth()->user()->user_id;
        $getData = Mail::find($id);

        if($userId == $getData->user_id){
            return response([
                'data' => $getData,
            ], 200);
        }
        else{
            return response([
                'message' => 'Nội dung không tìm thấy hoặc không thuộc về bạn',
            ], 404);
        }
        
    } 

    public function Remove($id){
        //$data['status'] = 'y';
        $userId = (string)auth()->user()->user_id;
        $getMailById = Mail::where('user_id', $userId)->where('status', 'n')->where('id', $id)->first();

        if (!$getMailById) {
            return response()->json([
                'error' => 'Không tìm thấy mail'
            ], 404);
        }
        else if($getMailById){
            $data['status'] = 'y';
    
            $getMailById->update($data);
            
            return response()->json([
                'message' => 'Đã xóa mail: '. $id
            ], 200);
        }
        else{
            return response()->json([
                'message' => 'Not Authorized',
            ], 401);
        }

    }

}
