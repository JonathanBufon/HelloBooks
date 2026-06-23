<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emprestimos', function (Blueprint $table) {
            $table->bigIncrements('id_emprestimo');
            $table->foreignId('id_usuario')->constrained('usuarios', 'id_usuario')->restrictOnDelete();
            $table->timestampTz('data_retirada');
            $table->date('data_devolucao_prevista');
            $table->timestampTz('data_devolucao_real')->nullable();
            $table->string('status', 20)->default('ativo');
            $table->timestampsTz();

            $table->index(['id_usuario', 'status']);
            $table->index('data_devolucao_prevista');
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE emprestimos ADD CONSTRAINT emprestimos_status_check CHECK (status IN ('ativo', 'devolvido', 'atrasado'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('emprestimos');
    }
};
