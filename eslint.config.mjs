import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import { tanstackConfig } from '@tanstack/config/eslint';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ['*/schedules/*', '**/archive/**/*', 'node_modules'],
    },
    ...compat.extends('expo', 'prettier'),
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    {
        plugins: {
            prettier,
            tanstackConfig,
            tseslint
        },

        rules: {
            'no-unused-vars': 'error',
            'no-console': 'error',
            'no-duplicate-imports': 'error',
            'react-hooks/exhaustive-deps': 'off',
            'prettier/prettier': 'error',
            'import/order': 'error',
            "@typescript-eslint/no-deprecated": "warn"
        },
    },
];
