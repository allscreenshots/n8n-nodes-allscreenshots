import tsParser from '@typescript-eslint/parser';

export default [
	{
		ignores: ['dist/**', 'node_modules/**'],
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'no-console': 'warn',
		},
	},
];
