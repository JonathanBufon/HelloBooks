<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('autores', function (Blueprint $table) {
            $table->bigIncrements('id_autor');
            $table->string('nome');
            $table->timestampsTz();
        });

        DB::statement('CREATE INDEX autores_nome_unaccent_idx ON autores (lower(unaccent(nome)))');
    }

    public function down(): void
    {
        Schema::dropIfExists('autores');
    }
};
