import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Turn off the rule requiring React to be in scope
      'react/prop-types': 0, // Turn off the prop-types validation rule
      'prop-types': 0,
      'jsx-quotes': ['error', 'prefer-single'] // Enforce single quotes in JSX attributes
    }
  },
  {
    settings: {
      react: {
        version: 'detect' // Automatically detect the React version
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    }
  },
  {
    plugins: {
      import: pluginImport
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object', 'type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['react']
        }
      ],
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-duplicates': 'error'
    }
  }
];
