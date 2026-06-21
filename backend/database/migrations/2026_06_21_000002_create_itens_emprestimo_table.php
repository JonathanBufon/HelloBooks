<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itens_emprestimo', function (Blueprint $table) {
            $table->bigIncrements('id_item_emprestimo');
            $table->foreignId('id_emprestimo')->constrained('emprestimos', 'id_emprestimo')->restrictOnDelete();
            $table->foreignId('id_exemplar')->constrained('exemplares', 'id_exemplar')->restrictOnDelete();
            $table->timestampTz('data_devolucao_item')->nullable();
            $table->timestampsTz();

            $table->index('id_emprestimo');
            $table->index('id_exemplar');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itens_emprestimo');
    }
};
