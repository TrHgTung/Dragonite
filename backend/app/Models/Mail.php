<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mail extends Model
{
    use HasFactory;

    protected $fillable = [
        'mail_id',
        'user_id',
        'from',
        'to',
        //'cc',
        //'bcc',
        'attachment',
        'subject',
        'content',
        'status',
        'time_sent',
    ];
    public $timestamps = false;
}
