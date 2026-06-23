<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('multas', function (Blueprint $table): void {
            $table->timestampTz('notificacao_lida_em')->nullable()->after('notificado_em');
        });
    }

    public function down(): void
    {
        Schema::table('multas', function (Blueprint $table): void {
            $table->dropColumn('notificacao_lida_em');
        });
    }
};
