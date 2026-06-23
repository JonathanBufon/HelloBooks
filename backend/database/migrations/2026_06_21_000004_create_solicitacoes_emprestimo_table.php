<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitacoes_emprestimo', function (Blueprint $table) {
            $table->bigIncrements('id_solicitacao_emprestimo');
            $table->foreignId('id_usuario')->constrained('usuarios', 'id_usuario')->restrictOnDelete();
            $table->foreignId('id_livro')->constrained('livros', 'id_livro')->restrictOnDelete();
            $table->foreignId('id_emprestimo')->nullable()->constrained('emprestimos', 'id_emprestimo')->restrictOnDelete();
            $table->string('status', 20)->default('pendente');
            $table->text('observacoes')->nullable();
            $table->text('justificativa_recusa')->nullable();
            $table->foreignId('id_bibliotecario_responsavel')->nullable()->constrained('usuarios', 'id_usuario')->restrictOnDelete();
            $table->timestampTz('data_decisao')->nullable();
            $table->timestampsTz();

            $table->index(['id_usuario', 'status']);
            $table->index(['id_livro', 'status']);
            $table->index('id_bibliotecario_responsavel');
        });

        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE solicitacoes_emprestimo ADD CONSTRAINT solicitacoes_emprestimo_status_check CHECK (status IN ('pendente', 'aprovada', 'recusada', 'cancelada'))");
            DB::statement("ALTER TABLE solicitacoes_emprestimo ADD CONSTRAINT solicitacoes_emprestimo_aprovada_emprestimo_check CHECK ((status != 'aprovada') OR (id_emprestimo IS NOT NULL))");
            DB::statement("ALTER TABLE solicitacoes_emprestimo ADD CONSTRAINT solicitacoes_emprestimo_recusada_justificativa_check CHECK ((status != 'recusada') OR (justificativa_recusa IS NOT NULL))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitacoes_emprestimo');
    }
};
