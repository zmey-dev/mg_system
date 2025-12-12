<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCnpj implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Remove non-numeric characters
        $cnpj = preg_replace('/\D/', '', $value);

        // Check if it has 14 digits
        if (strlen($cnpj) !== 14) {
            $fail('O CNPJ deve ter 14 dígitos.');
            return;
        }

        // Check if all digits are the same (invalid CNPJ)
        if (preg_match('/^(\d)\1+$/', $cnpj)) {
            $fail('O CNPJ informado é inválido.');
            return;
        }

        // Validate first check digit
        $sum = 0;
        $weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        for ($i = 0; $i < 12; $i++) {
            $sum += $cnpj[$i] * $weights[$i];
        }
        $remainder = $sum % 11;
        $digit1 = $remainder < 2 ? 0 : 11 - $remainder;

        if ($cnpj[12] != $digit1) {
            $fail('O CNPJ informado é inválido.');
            return;
        }

        // Validate second check digit
        $sum = 0;
        $weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        for ($i = 0; $i < 13; $i++) {
            $sum += $cnpj[$i] * $weights[$i];
        }
        $remainder = $sum % 11;
        $digit2 = $remainder < 2 ? 0 : 11 - $remainder;

        if ($cnpj[13] != $digit2) {
            $fail('O CNPJ informado é inválido.');
            return;
        }
    }
}
