<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('multas', function (Blueprint $table): void {
            $table->timestampTz('notificado_em')->nullable()->after('data_baixa');
            $table->foreignId('id_bibliotecario_notificacao')
                ->nullable()
                ->after('id_bibliotecario_baixa')
                ->constrained('usuarios', 'id_usuario')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('multas', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('id_bibliotecario_notificacao');
            $table->dropColumn('notificado_em');
        });
    }
};
