<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logs_atividades', function (Blueprint $table) {
            $table->bigIncrements('id_log');
            $table->foreignId('id_usuario')->constrained('usuarios', 'id_usuario')->restrictOnDelete();
            $table->string('acao_realizada', 20);
            $table->string('entidade_afetada', 50);
            $table->string('id_registro_afetado', 100);
            $table->timestampTz('data_hora')->useCurrent();

            $table->check("acao_realizada in ('created', 'updated', 'deleted')");
            $table->index(['entidade_afetada', 'id_registro_afetado', 'data_hora']);
            $table->index(['id_usuario', 'data_hora']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs_atividades');
    }
};
