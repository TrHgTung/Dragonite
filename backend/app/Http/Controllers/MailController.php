<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mail;
use App\Models\User;

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

    public function SaveMail(Request $req){
        $randNum = (string)rand(1111,9999);
        //$userId = (string)auth()->user()->user_id;
        $updateModifiedDate = (string)Carbon::now()->toDateString();
        $mailIdInit = 'MAIL_'.str_replace('-','', $updateModifiedDate).'_'.$randNum.'_'.$userId;
        
        // validate tren front-end

        // $req->validate([
        //     'subject' => 'required',
        //     'content' => 'required',
        //     'to' => 'required',
        // ]);

        $data = $req->all();

        $getUserName = (string)auth()->user()->display_name;
        $getUserEmail = (string)auth()->user()->email;

        $data['mail_id'] = $mailIdInit;
        $data['from'] = $getUserEmail;
        $data['time_sent'] = $updateModifiedDate;
        $data['status'] = '1';

        Mail::create($data);
           
        return response()->json([
                'mail_data' => $data,
            ]
        );
    }

    public function SendMail(){
        $getUserName = (string)auth()->user()->display_name;
        $getUserEmail = (string)auth()->user()->email;
        $getSMTP_Password = (string)auth()->user()->smtp_password;

        // Xu ly du lieu de gui e-mail
        
        $getMailsDataForSending = Mail::where('from', $getUserEmail)->get();
        for($i = 0; $i <= $getMailsDataForSending->count(); $i++){
            $getAddressTo = $getMailsDataForSending->to;
            $getAddressCC = $getMailsDataForSending->cc;
            $getAddressBCC = $getMailsDataForSending->bcc;
            $getAttachment = $getMailsDataForSending->attachment;
            $getSubject = $getMailsDataForSending->subject;
            $getContent = $getMailsDataForSending->content;

            try {
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
                    'mail_status' => 'Khong the gui e-mail, hay kiem tra ket noi Internet',
                ]);
            }
        }

        return response()->json(
            [
                'mail_status' => 'Gui e-mail thanh cong',
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
            ], 401);
        }
        
    } 

}
