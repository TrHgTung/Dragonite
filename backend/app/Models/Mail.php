<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Mail extends Model
{
    use HasFactory;

    protected $fillable = [
        'mail_id',
        'user_id',
        'from',
        'to',
        'attachment',
        'subject',
        'content',
        'status',
        'time_sent',
    ];
    public $timestamps = false;

    // Limit characters
    public function setFromAttribute($value)
    {
        $this->attributes['from'] = Str::limit($value, 50);
    }

    public function setToAttribute($value)
    {
        $this->attributes['to'] = Str::limit($value, 50);
    }

    public function setAttachmentAttribute($value)
    {
        $this->attributes['attachment'] = Str::limit($value, 50);
    }

    public function setSubjectAttribute($value)
    {
        $this->attributes['subject'] = Str::limit($value, 100);
    }

    public function setContentAttribute($value)
    {
        $this->attributes['content'] = Str::limit($value, 300);
    }
}
