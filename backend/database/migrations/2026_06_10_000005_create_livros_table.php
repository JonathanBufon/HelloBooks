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

            $table->index('id_editora');
        });

        DB::statement('ALTER TABLE livros ADD CONSTRAINT livros_isbn_length_check CHECK (char_length(isbn) between 10 and 13)');
        DB::statement('ALTER TABLE livros ADD CONSTRAINT livros_ano_publicacao_check CHECK (ano_publicacao between 1000 and extract(year from now())::int + 1)');
        DB::statement('CREATE INDEX livros_titulo_unaccent_idx ON livros (lower(immutable_unaccent(titulo)))');
    }

    public function down(): void
    {
        Schema::dropIfExists('livros');
    }
};
