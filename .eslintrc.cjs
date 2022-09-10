/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:import/errors',
		'plugin:import/warnings'
	],
	plugins: ['svelte3', '@typescript-eslint', 'import'],
	ignorePatterns: ['*.cjs'],
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte3/svelte3',
			rules: {
				'no-undef': 0
			}
		}
	],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.ts']
			}
		},
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'@typescript-eslint/consistent-type-imports': 'error',
		'import/no-dynamic-require': 0,
		'import/no-extraneous-dependencies': 0,
		'import/no-unresolved': 0,
		'import/order': [
			'error',
			{
				alphabetize: {
					caseInsensitive: true,
					order: 'asc'
				},
				groups: ['builtin', 'external', 'internal'],
				'newlines-between': 'always',
				pathGroups: [
					{
						group: 'external',
						pattern: '{react,react-dom/**,react-dom}',
						position: 'before'
					},
					{
						group: 'external',
						pattern: '~/**',
						position: 'after'
					}
				],
				pathGroupsExcludedImportTypes: ['react']
			}
		],
		'import/prefer-default-export': 0,
		'no-console': 'warn'
	}
};
