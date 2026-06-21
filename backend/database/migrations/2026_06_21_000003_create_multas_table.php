<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('multas', function (Blueprint $table) {
            $table->bigIncrements('id_multa');
            $table->foreignId('id_item_emprestimo')->constrained('itens_emprestimo', 'id_item_emprestimo')->restrictOnDelete();
            $table->string('motivo', 20);
            $table->decimal('valor', 10, 2);
            $table->string('status', 20)->default('pendente');
            $table->text('justificativa_perdao')->nullable();
            $table->foreignId('id_bibliotecario_baixa')->nullable()->constrained('usuarios', 'id_usuario')->restrictOnDelete();
            $table->timestampTz('data_baixa')->nullable();
            $table->timestampsTz();

            $table->unique(['id_item_emprestimo', 'motivo']);
            $table->index('status');
            $table->index('id_bibliotecario_baixa');
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE multas ADD CONSTRAINT multas_motivo_check CHECK (motivo IN ('atraso', 'rabisco', 'rasgo', 'dobra'))");
            DB::statement("ALTER TABLE multas ADD CONSTRAINT multas_valor_check CHECK (valor > 0)");
            DB::statement("ALTER TABLE multas ADD CONSTRAINT multas_status_check CHECK (status IN ('pendente', 'paga', 'perdoada'))");
            DB::statement("ALTER TABLE multas ADD CONSTRAINT multas_perdoada_justificativa_check CHECK ((status != 'perdoada') OR (justificativa_perdao IS NOT NULL))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('multas');
    }
};
