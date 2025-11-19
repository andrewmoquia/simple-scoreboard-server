import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import eslintComments from 'eslint-plugin-eslint-comments';
import prettier from 'eslint-plugin-prettier';

export default [
    {
        files: ['**/*.ts', '**/*.js'],
        ignores: ['node_modules/**', 'dist/**', 'build/**'],

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2021,
            sourceType: 'module',
        },

        settings: {
            'import/resolver': {
                typescript: {},
                node: {
                    extensions: ['.js', '.ts'],
                },
            },
        },

        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            'eslint-comments': eslintComments,
            prettier: prettier,
        },

        rules: {
            // Prettier rule
            'prettier/prettier': ['error', { endOfLine: 'auto' }],

            // Typescript rules
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',

            // JS rules
            'no-console': 'warn',

            // Import order rules
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                },
            ],
        },
    },
];
