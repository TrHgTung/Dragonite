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

        $getUserName = (string)auth()->user()->display_name;
        $getUserEmail = (string)auth()->user()->email;

        $data['user_id'] = $userId;
        $data['mail_id'] = $mailIdInit;
        $data['from'] = $getUserEmail;
        $data['time_sent'] = $updateModifiedDate;
        $data['status'] = 'n';  // khoi tao trang thai chua gui (no)

        Mail::create($data);
           
        return response()->json([
                'mail_data' => $data,
            ]
        );
    }

    public function SendMail(Request $req){
        $userId = (string)auth()->user()->user_id;
        $getUserName = (string)auth()->user()->display_name;
        // $getUserEmail = (string)auth()->user()->email;
        // $getSMTP_Password = (string)auth()->user()->smtp_password;

        // Lay du lieu tu front-end
        $getUserEmail = (string)$req->email;
        $getSMTP_Password = (string)$req->smtp;

        // Xu ly du lieu de gui e-mail
        
        $getMailsDataForSending = Mail::where('from', $getUserEmail)->where('status', 'n')->get();
        foreach ($getMailsDataForSending as $mailData) {
            $getAddressTo = $mailData->to;
            //$getAddressCC = $mailData->cc;
            //$getAddressBCC = $mailData->bcc;
            $getAttachment = $mailData->attachment;
            $getSubject = $mailData->subject;
            $getContent = $mailData->content;
            $mailId = $mailData->mail_id;

            $getEverySingleMail = Mail::where('user_id', $userId)->where('status', 'n')->where('mail_id', $mailId)->first();

            // $mail->CharSet = "UTF-8";
            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
            try {
                $mail->CharSet = "UTF-8";
                //Server settings
                $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
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

                // if($getAddressCC){
                //     $mail->addCC($getAddressCC);
                    
                // } else if($getAddressBCC){
                //     $mail->addBCC($getAddressBCC);
                // }
                if($getAttachment) {
                    $mail->addAttachment('/var/tmp/'.$getAttachment);
                }

                //Content
                $mail->isHTML(true);                                  //Set email format to HTML
                $mail->Subject = $getSubject;
                $mail->Body    = $getContent;
                // $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
            
                $mail->send();

                $data['status'] = 'y'; // yes (da gui)

                $getEverySingleMail->update($data);
                //echo 'Message has been sent';
            } catch (Exception $e) {
               // $data['status'] = 'n'; // no (chua gui duoc)
                // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
                return response()->json([
                    'mail_status' => 'Khong the gui e-mail, hay kiem tra ket noi Internet',
                    // 'mailer_error' => $mail->ErrorInfo,
                ]);
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
