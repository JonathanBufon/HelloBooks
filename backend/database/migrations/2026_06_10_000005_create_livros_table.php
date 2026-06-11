<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('livros', function (Blueprint $table) {
            $table->bigIncrements('id_livro');
            $table->foreignId('id_editora')->constrained('editoras', 'id_editora')->restrictOnDelete();
            $table->string('titulo');
            $table->string('isbn', 13)->unique();
            $table->smallInteger('ano_publicacao');
            $table->timestampsTz();

            $table->check('char_length(isbn) between 10 and 13');
            $table->check('ano_publicacao between 1000 and extract(year from now())::int + 1');
            $table->index('id_editora');
        });

        DB::statement('CREATE INDEX livros_titulo_unaccent_idx ON livros (lower(unaccent(titulo)))');
    }

    public function down(): void
    {
        Schema::dropIfExists('livros');
    }
};
