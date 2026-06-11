<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->bigIncrements('id_usuario');
            $table->string('nome_completo');
            $table->string('endereco', 500)->nullable();
            $table->string('cargo', 20);
            $table->string('email')->unique();
            $table->string('senha_hash');
            $table->timestampsTz();

            $table->check("cargo in ('bibliotecario', 'leitor')");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
