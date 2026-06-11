<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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

            $table->index(['id_livro', 'status']);
        });

        DB::statement("ALTER TABLE exemplares ADD CONSTRAINT exemplares_status_check CHECK (status in ('disponivel', 'emprestado', 'reservado', 'manutencao'))");
        DB::statement("ALTER TABLE exemplares ADD CONSTRAINT exemplares_condicao_fisica_check CHECK (condicao_fisica in ('intacto', 'rabiscado', 'rasgado', 'dobrado'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('exemplares');
    }
};
