<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class ExemplarUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, string>
     */
    public function rules(): array
    {
        return [
            'status' => 'required_without:condicao_fisica|string|in:disponivel,manutencao',
            'condicao_fisica' => 'required_without:status|string|in:intacto,rabiscado,rasgado,dobrado',
        ];
    }
}
