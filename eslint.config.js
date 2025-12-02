// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

// Plugin personalizado para proibir comentários
const noCommentsPlugin = {
  rules: {
    'no-comments': {
      meta: {
        type: 'suggestion',
        fixable: 'code',
        docs: {
          description: 'Remove comentários do código automaticamente',
        },
      },
      create(context) {
        return {
          Program(node) {
            node.comments.forEach((comment) => {
              const commentText = comment.value.trim();

              const eslintPatterns = [
                'eslint-disable',
                'eslint-enable',
                'eslint-disable-next-line',
                'eslint-disable-line',
                '@ts-check',
                '@ts-expect-error',
                '@ts-ignore',
                '@ts-nocheck',
              ];

              const isEslintDirective = eslintPatterns.some((pattern) =>
                commentText.includes(pattern)
              );

              if (isEslintDirective) {
                return;
              }

              context.report({
                node: comment,
                message: 'Comentários no código devem ser evitados.',
                fix(fixer) {
                  const sourceCode = context.getSourceCode();
                  const lines = sourceCode.getLines();
                  const commentLineIndex = comment.loc.start.line - 1;

                  const commentLine = lines[commentLineIndex];
                  const commentOnly =
                    commentLine.trim() === comment.value.trim() ||
                    commentLine.trim() === `//${comment.value.trim()}` ||
                    commentLine.trim() === `/*${comment.value.trim()}*/`;

                  if (commentOnly) {
                    const lineStart = sourceCode.getIndexFromLoc({
                      line: commentLineIndex + 1,
                      column: 0,
                    });
                    const lineEnd =
                      commentLineIndex + 1 < lines.length
                        ? sourceCode.getIndexFromLoc({ line: commentLineIndex + 2, column: 0 })
                        : sourceCode.getText().length;

                    return fixer.removeRange([lineStart, lineEnd]);
                  } else {
                    return fixer.remove(comment);
                  }
                },
              });
            });
          },
        };
      },
    },
  },
};

export default tseslint.config(
  {
    files: ['**/*.ts'],
    plugins: {
      'no-comments-plugin': noCommentsPlugin,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['app', 'os'],
          style: 'kebab-case',
        },
      ],
      // Regra personalizada para proibir comentários
      'no-comments-plugin/no-comments': 'warn',
      // Remove linhas em branco múltiplas
      'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0, maxBOF: 0 }],
      // Permitir métodos vazios para ControlValueAccessor
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions', 'functions', 'methods'],
        },
      ],
      // Permitir parâmetros não usados que começam com underscore
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
    ignores: ['src/app/core/mocks/**/*.ts'],
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
  storybook.configs['flat/recommended']
);
