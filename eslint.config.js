import typescriptParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import angularEslintPlugin from '@angular-eslint/eslint-plugin';
import angularTemplateEslintPlugin from '@angular-eslint/eslint-plugin-template';
import boundariesPlugin from 'eslint-plugin-boundaries';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      '@angular-eslint': angularEslintPlugin,
      boundaries: boundariesPlugin,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'method',
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
        },
      ],

      // Angular rules
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'os',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'os',
          style: 'camelCase',
        },
      ],

      // Boundary rules para arquitetura Feature-Based
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: ['core'],
              allow: ['shared', 'dtos'],
            },
            {
              from: ['shared'],
              allow: ['dtos'],
            },
            {
              from: ['features'],
              allow: ['core', 'shared', 'dtos'],
            },
            {
              from: ['dtos'],
              disallow: ['core', 'shared', 'features'],
            },
          ],
        },
      ],

      // Security rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
    },
    settings: {
      'boundaries/elements': [
        {
          type: 'core',
          pattern: 'app/core/**/*',
          mode: 'file',
        },
        {
          type: 'shared',
          pattern: 'app/shared/**/*',
          mode: 'file',
        },
        {
          type: 'features',
          pattern: 'app/features/**/*',
          mode: 'file',
        },
        {
          type: 'dtos',
          pattern: 'dtos/**/*',
          mode: 'file',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplateEslintPlugin,
    },
    rules: {
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-positive-tabindex': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
      '@angular-eslint/template/use-track-by-function': 'error',
      '@angular-eslint/template/prefer-contextual-for-variables': 'error',
      '@angular-eslint/template/cyclomatic-complexity': [
        'error',
        {
          maxComplexity: 5,
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
];
