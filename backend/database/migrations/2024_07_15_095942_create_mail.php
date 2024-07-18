<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // mail_id',
        // 'from',
        // 'to',
        //
        // 'attachment',
        // 'subject',
        // 'content',
        // 'time_sent',
        Schema::create('mails', function (Blueprint $table) {
            $table->id();
            $table->string('mail_id', 64)->unique();
            $table->string('user_id', 64);
            $table->string('from', 128);
            $table->string('to', 128);
            $table->string('attachment', 128)->nullable();
            $table->string('subject');
            $table->longText('content')->nullable();
            $table->string('status', 4);
            $table->string('time_sent', 32);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email');
    }
};
