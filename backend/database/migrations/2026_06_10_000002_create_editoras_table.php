<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('editoras', function (Blueprint $table) {
            $table->bigIncrements('id_editora');
            $table->string('nome');
            $table->timestampsTz();
        });

        DB::statement('CREATE INDEX editoras_nome_unaccent_idx ON editoras (lower(immutable_unaccent(nome)))');
    }

    public function down(): void
    {
        Schema::dropIfExists('editoras');
    }
};
