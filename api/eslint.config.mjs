// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,

  // ✅ em vez de recommendedTypeChecked (que liga as regras com type info)
  ...tseslint.configs.recommended,

  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        // ✅ remove isso para não rodar o ESLint com TypeScript Program
        // projectService: true,
        // tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',

      // ✅ mata as warnings de unsafe
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      // você pode manter esse warn se quiser (não depende de type-check)
      '@typescript-eslint/no-floating-promises': 'warn',

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
