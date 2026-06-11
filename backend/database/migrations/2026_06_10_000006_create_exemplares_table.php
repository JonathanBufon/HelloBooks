<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exemplares', function (Blueprint $table) {
            $table->bigIncrements('id_exemplar');
            $table->foreignId('id_livro')->constrained('livros', 'id_livro')->restrictOnDelete();
            $table->string('status', 20)->default('disponivel');
            $table->string('condicao_fisica', 20)->default('intacto');
            $table->timestampsTz();

            $table->check("status in ('disponivel', 'emprestado', 'reservado', 'manutencao')");
            $table->check("condicao_fisica in ('intacto', 'rabiscado', 'rasgado', 'dobrado')");
            $table->index(['id_livro', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exemplares');
    }
};
