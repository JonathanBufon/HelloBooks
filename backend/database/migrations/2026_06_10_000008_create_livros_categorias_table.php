<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('livros_categorias', function (Blueprint $table) {
            $table->foreignId('id_livro')->constrained('livros', 'id_livro')->cascadeOnDelete();
            $table->foreignId('id_categoria')->constrained('categorias', 'id_categoria')->restrictOnDelete();

            $table->primary(['id_livro', 'id_categoria']);
            $table->index('id_categoria');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('livros_categorias');
    }
};
